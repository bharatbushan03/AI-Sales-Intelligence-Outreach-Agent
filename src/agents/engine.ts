import { AgentContext, WorkflowPlan, AgentStepResult, AgentTrace } from './types';
import { AgentRegistry } from './registry';
import { logTimelineEvent, recordAgentTrace } from './context';
import { logger } from '../utils/logger';

/**
 * Executes a Promise, throwing a timeout error if it exceeds the specified limit in milliseconds.
 */
function withTimeout<T>(promise: Promise<T>, ms: number, stepId: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout: Step "${stepId}" exceeded execution limit of ${ms}ms.`));
    }, ms);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

/**
 * Executes a function with retries and exponential backoff.
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  limit: number,
  stepId: string,
  initialDelayMs = 100,
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt >= limit) {
        throw error;
      }
      const delay = initialDelayMs * Math.pow(2, attempt);
      logger.warn(`Step "${stepId}" failed (attempt ${attempt}/${limit}). Retrying in ${delay}ms...`, { error });
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

export class WorkflowEngine {
  private registry = AgentRegistry.getInstance();

  /**
   * Executes a workflow plan utilizing dynamic topological ordering for parallel schedule execution.
   */
  public async execute(context: AgentContext, plan: WorkflowPlan): Promise<AgentContext> {
    context.status = 'running';
    logger.info(`Starting execution of workflow: ${context.workflowId}`, { goal: plan.goal });

    const completedStepIds = new Set<string>();
    const activeSteps = new Set<string>();
    const failedStepIds = new Set<string>();

    const remainingSteps = [...plan.steps];

    while (remainingSteps.length > 0 && failedStepIds.size === 0) {
      // Find all steps that have not been executed and whose dependencies are completely satisfied
      const executableSteps = remainingSteps.filter((step) => {
        if (activeSteps.has(step.id)) return false;
        
        const deps = step.dependsOn || [];
        return deps.every((depId) => completedStepIds.has(depId));
      });

      if (executableSteps.length === 0 && remainingSteps.length > 0) {
        const errorMsg = 'Deadlock detected: Cyclic dependencies in workflow plan steps.';
        logger.error(errorMsg);
        context.status = 'failed';
        logTimelineEvent(context, 'workflow_end', `Workflow aborted: ${errorMsg}`);
        return context;
      }

      // Execute all available steps in parallel
      const executionPromises = executableSteps.map(async (step) => {
        activeSteps.add(step.id);
        
        const startTime = new Date().toISOString();
        const startTimestamp = Date.now();
        logTimelineEvent(context, 'agent_start', `Starting execution of step "${step.id}"`, undefined);

        const agents = this.registry.findAgentsByCapability(step.agentCapability);
        const agent = agents[0]; // Select the first registered specialist

        if (!agent) {
          const errorMsg = `No specialist agent registered for capability: "${step.agentCapability}"`;
          const duration = Date.now() - startTimestamp;
          
          const trace: AgentTrace = {
            agentName: `UnknownAgent-${step.agentCapability}`,
            status: 'failed',
            startTime,
            endTime: new Date().toISOString(),
            durationMs: duration,
            input: {},
            error: errorMsg,
          };
          recordAgentTrace(context, trace);
          logTimelineEvent(context, 'agent_error', `Step "${step.id}" failed: ${errorMsg}`, undefined, duration);
          
          failedStepIds.add(step.id);
          return;
        }

        try {
          const mappedInput = step.inputMapping(context);
          const limit = step.retryLimit || 3;
          const timeout = step.timeoutMs || 30000; // default 30s

          const runExecution = () => agent.execute(context, mappedInput);
          const runWithRetryWrapper = () => withRetry(runExecution, limit, step.id);
          
          const result: AgentStepResult = await withTimeout(runWithRetryWrapper(), timeout, step.id);
          const duration = Date.now() - startTimestamp;

          if (result.success) {
            const trace: AgentTrace = {
              agentName: agent.name,
              status: 'success',
              startTime,
              endTime: new Date().toISOString(),
              durationMs: duration,
              input: mappedInput,
              output: result.output,
            };
            recordAgentTrace(context, trace);
            logTimelineEvent(
              context,
              'agent_end',
              `Step "${step.id}" completed successfully using ${agent.name}`,
              agent.name,
              duration,
            );
            completedStepIds.add(step.id);
          } else {
            throw new Error(result.error || 'Agent returned execution failure status.');
          }
        } catch (error) {
          const duration = Date.now() - startTimestamp;
          const errorMsg = error instanceof Error ? error.message : String(error);
          
          const trace: AgentTrace = {
            agentName: agent.name,
            status: 'failed',
            startTime,
            endTime: new Date().toISOString(),
            durationMs: duration,
            input: step.inputMapping(context),
            error: errorMsg,
          };
          recordAgentTrace(context, trace);
          logTimelineEvent(
            context,
            'agent_error',
            `Step "${step.id}" failed with error: "${errorMsg}"`,
            agent.name,
            duration,
          );
          
          failedStepIds.add(step.id);
        } finally {
          activeSteps.delete(step.id);
          // Remove step from remaining list
          const idx = remainingSteps.findIndex((s) => s.id === step.id);
          if (idx !== -1) remainingSteps.splice(idx, 1);
        }
      });

      await Promise.all(executionPromises);
    }

    if (failedStepIds.size > 0) {
      context.status = 'failed';
      logTimelineEvent(context, 'workflow_end', 'Workflow execution failed.');
    } else {
      context.status = 'completed';
      logTimelineEvent(context, 'workflow_end', 'Workflow completed successfully.');
    }

    logger.info(`Workflow execution completed: ${context.workflowId} (Status: ${context.status})`);
    return context;
  }
}
export default WorkflowEngine;
