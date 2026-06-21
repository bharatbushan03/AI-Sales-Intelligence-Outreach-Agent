import { IAgent, AgentCapability } from './types';

export class AgentRegistry {
  private static instance: AgentRegistry;
  private agents: Map<string, IAgent> = new Map();

  private constructor() {}

  /**
   * Fetches the singleton instance of the Agent Registry.
   */
  public static getInstance(): AgentRegistry {
    if (!AgentRegistry.instance) {
      AgentRegistry.instance = new AgentRegistry();
    }
    return AgentRegistry.instance;
  }

  /**
   * Registers a specialist agent inside the global workspace map.
   */
  public register(agent: IAgent): void {
    if (this.agents.has(agent.name)) {
      throw new Error(`Agent with name "${agent.name}" is already registered.`);
    }
    this.agents.set(agent.name, agent);
  }

  /**
   * Retrieves an agent directly by name.
   */
  public getAgent(name: string): IAgent | undefined {
    return this.agents.get(name);
  }

  /**
   * Discovers registered agents capable of fulfilling a specific function.
   */
  public findAgentsByCapability(capability: AgentCapability): IAgent[] {
    return Array.from(this.agents.values()).filter((agent) =>
      agent.capabilities.includes(capability),
    );
  }

  /**
   * Lists all currently registered agents.
   */
  public listAgents(): IAgent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Clears the registered agents database (mainly useful for unit testing resets).
   */
  public clear(): void {
    this.agents.clear();
  }
}
export default AgentRegistry;
