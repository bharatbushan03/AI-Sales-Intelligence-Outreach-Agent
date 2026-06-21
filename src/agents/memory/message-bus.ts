import { AgentMessage } from './types';
import { agentMessagesRepository } from '../../lib/repositories';
import { logger } from '../../utils/logger';

export class AgentMessagingBus {
  private static instance: AgentMessagingBus;
  private subscribers: Map<string, Array<(message: AgentMessage) => void>> = new Map();

  private constructor() {}

  public static getInstance(): AgentMessagingBus {
    if (!AgentMessagingBus.instance) {
      AgentMessagingBus.instance = new AgentMessagingBus();
    }
    return AgentMessagingBus.instance;
  }

  /**
   * Subscribes a callback function to a specific messaging topic.
   */
  public subscribe(topic: string, callback: (message: AgentMessage) => void): void {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, []);
    }
    this.subscribers.get(topic)!.push(callback);
    logger.info(`Callback subscribed to topic: "${topic}"`);
  }

  /**
   * Publishes a message to all subscribers of a topic and persists it in Firestore.
   */
  public async publish(
    sender: string,
    topic: string,
    payload: Record<string, unknown>,
  ): Promise<AgentMessage> {
    const timestamp = new Date().toISOString();
    const message: AgentMessage = {
      timestamp,
      sender,
      topic,
      payload,
    };

    // Trigger subscribers in-memory asynchronously to keep bus responsive
    const callbacks = this.subscribers.get(topic) || [];
    callbacks.forEach((cb) => {
      try {
        cb(message);
      } catch (err) {
        logger.error(`Error in message subscriber for topic "${topic}":`, err);
      }
    });

    try {
      // Persist in Firestore
      const savedMsg = await agentMessagesRepository.add(message);
      return savedMsg;
    } catch (err) {
      logger.error('Failed to log message in repository database:', err);
      return message;
    }
  }

  /**
   * Broadcasts a payload to a special "broadcast" topic.
   */
  public async broadcast(sender: string, payload: Record<string, unknown>): Promise<AgentMessage> {
    logger.info(`Agent "${sender}" broadcasting message payload`);
    return this.publish(sender, 'broadcast', payload);
  }

  /**
   * Sends a targeted message to a recipient.
   */
  public async directMessage(
    sender: string,
    recipient: string,
    payload: Record<string, unknown>,
  ): Promise<AgentMessage> {
    logger.info(`Agent "${sender}" sending direct message to "${recipient}"`);
    return this.publish(sender, `direct:${recipient}`, payload);
  }

  /**
   * Retrieves message history from database.
   */
  public async getHistory(topic?: string, limitCount = 50): Promise<AgentMessage[]> {
    try {
      const filters = topic ? [{ field: 'topic', operator: '==' as const, value: topic }] : undefined;
      return await agentMessagesRepository.list(filters, 'timestamp', 'desc', limitCount);
    } catch (err) {
      logger.error('Failed to retrieve agent messages history', err);
      return [];
    }
  }

  /**
   * Clears subscription listeners (useful for reset in test runs).
   */
  public clearSubscriptions(): void {
    this.subscribers.clear();
  }
}
export default AgentMessagingBus;
