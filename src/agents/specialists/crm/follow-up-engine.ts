import { GoogleGenerativeAI } from '@google/generative-ai';
import { FollowUpTask } from './types';
import { FOLLOW_UP_ENGINE_PROMPT } from '../../prompts/crm-prompts';
import { logger } from '../../../utils/logger';

export class FollowUpEngine {
  constructor(private genAI: GoogleGenerativeAI | null) {}

  public async generateTasks(
    companyName: string,
    historyLogs: unknown[],
    referenceId: string,
  ): Promise<FollowUpTask[]> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `Target Company: ${companyName}\nHistory:\n${JSON.stringify(
          historyLogs,
        )}\n\nGenerate recommended follow-up tasks.`;

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: FOLLOW_UP_ENGINE_PROMPT,
        });

        const json = JSON.parse(result.response.text());
        return (json.followups || []).map((task: Partial<FollowUpTask>) => ({
          taskId: task.taskId || `task_${Math.random().toString(36).substring(2, 9)}`,
          taskName: task.taskName || 'Follow up with client',
          priority: task.priority || 'medium',
          dueDate: task.dueDate || new Date().toISOString().split('T')[0],
          rationale: task.rationale || 'Regular check-in.',
          completed: false,
          referenceId,
        }));
      } catch (error) {
        logger.error(`FollowUpEngine live generation failed. Falling back to mock.`, error);
      }
    }

    return this.getMockTasks(companyName, referenceId);
  }

  private getMockTasks(companyName: string, referenceId: string): FollowUpTask[] {
    const name = companyName.toLowerCase();
    const dateOffset = (days: number) => {
      const d = new Date();
      d.setDate(d.getDate() + days);
      return d.toISOString().split('T')[0];
    };

    if (name.includes('stripe')) {
      return [
        {
          taskId: 'task_stripe_001',
          taskName: 'Send European localized routing SDK templates',
          priority: 'high',
          dueDate: dateOffset(2),
          rationale:
            'Follow up on the technical query regarding decline maps raised during the discovery alignment call.',
          completed: false,
          referenceId,
        },
        {
          taskId: 'task_stripe_002',
          taskName: 'Check checkouts local conversion benchmarks with sales engineering',
          priority: 'medium',
          dueDate: dateOffset(5),
          rationale:
            'Verify German bank routing configurations to provide the client concrete stats.',
          completed: false,
          referenceId,
        },
      ];
    }

    if (name.includes('hubspot')) {
      return [
        {
          taskId: 'task_hubspot_001',
          taskName: 'Coordinate developer sandbox session for CRM sync middleware',
          priority: 'high',
          dueDate: dateOffset(3),
          rationale:
            'Answer technical compliance questions about custom object limits bypass rules.',
          completed: false,
          referenceId,
        },
      ];
    }

    return [
      {
        taskId: 'task_generic_001',
        taskName: 'Send personalization benchmarks report',
        priority: 'medium',
        dueDate: dateOffset(4),
        rationale: 'Regular contact nurture following cold outreach.',
        completed: false,
        referenceId,
      },
    ];
  }
}
export default FollowUpEngine;
