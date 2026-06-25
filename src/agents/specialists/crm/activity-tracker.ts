import { ActivityRecord, ActivityType } from './types';

export class ActivityTracker {
  public async logActivity(
    activityType: ActivityType,
    description: string,
    actor: string,
    referenceId: string,
  ): Promise<ActivityRecord> {
    return {
      activityId: `act_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
      activityType,
      description,
      actor,
      referenceId,
    };
  }

  public getMockActivities(companyName: string): ActivityRecord[] {
    const name = companyName.toLowerCase();
    const now = new Date();
    const dateOffset = (days: number) =>
      new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

    if (name.includes('stripe')) {
      return [
        {
          activityId: 'act_stripe_001',
          timestamp: dateOffset(1),
          activityType: 'Email',
          description:
            'Sent personalized cold email (Executive Version) targeting EU routing leaks.',
          actor: 'mock-user-123',
          referenceId: 'lead_stripe_001',
        },
        {
          activityId: 'act_stripe_002',
          timestamp: dateOffset(3),
          activityType: 'LinkedIn',
          description: 'Established LinkedIn connection and dropped compliance benchmark deck.',
          actor: 'mock-user-123',
          referenceId: 'lead_stripe_001',
        },
      ];
    }

    if (name.includes('hubspot')) {
      return [
        {
          activityId: 'act_hubspot_001',
          timestamp: dateOffset(2),
          activityType: 'Meeting',
          description:
            'Discovery call held. Discussed database schema bottlenecks and custom objects caps.',
          actor: 'mock-user-123',
          referenceId: 'lead_hubspot_001',
        },
        {
          activityId: 'act_hubspot_002',
          timestamp: dateOffset(0),
          activityType: 'Email',
          description: 'Sent custom object bypass proposal document.',
          actor: 'mock-user-123',
          referenceId: 'lead_hubspot_001',
        },
      ];
    }

    return [
      {
        activityId: 'act_generic_001',
        timestamp: dateOffset(4),
        activityType: 'Call',
        description: 'Completed introduction phone call with sales coordinator.',
        actor: 'mock-user-123',
        referenceId: 'lead_generic_001',
      },
    ];
  }
}
export default ActivityTracker;
