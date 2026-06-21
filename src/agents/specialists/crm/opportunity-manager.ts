import { OpportunityRecord } from './types';

export class OpportunityManager {
  public async createOpportunity(
    name: string,
    stage: string,
    value: number,
    probability: number,
    rationale: string,
    accountId: string,
  ): Promise<OpportunityRecord> {
    return {
      opportunityId: `opp_${Math.random().toString(36).substring(2, 9)}`,
      name,
      stage,
      value,
      probability,
      rationale,
      closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      accountId,
    };
  }

  public getMockOpportunities(companyName: string): OpportunityRecord[] {
    const name = companyName.toLowerCase();
    const closeDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    if (name.includes('stripe')) {
      return [
        {
          opportunityId: 'opp_stripe_001',
          name: 'Stripe EU Localized Checkout Deal',
          stage: 'Discovery',
          value: 45000,
          probability: 40,
          rationale: 'Active exploration of local payment drops in European channels.',
          closeDate,
          accountId: 'acc_stripe_001',
        },
      ];
    }

    if (name.includes('hubspot')) {
      return [
        {
          opportunityId: 'opp_hubspot_001',
          name: 'HubSpot custom relational object middleware licensing',
          stage: 'Proposal Sent',
          value: 30000,
          probability: 70,
          rationale: 'Pricing brief sent. Partners seeking custom object limit bypass solutions.',
          closeDate,
          accountId: 'acc_hubspot_001',
        },
      ];
    }

    if (name.includes('salesforce')) {
      return [
        {
          opportunityId: 'opp_salesforce_001',
          name: 'Salesforce database customization automation',
          stage: 'Negotiation',
          value: 85000,
          probability: 85,
          rationale: 'High level ROI alignment. Contract in CRO review.',
          closeDate,
          accountId: 'acc_salesforce_001',
        },
      ];
    }

    if (name.includes('notion')) {
      return [
        {
          opportunityId: 'opp_notion_001',
          name: 'Notion structural wiki cleanup framework',
          stage: 'Discovery',
          value: 15000,
          probability: 20,
          rationale: 'Introductory discussion about permission leaks and workspace decluttering.',
          closeDate,
          accountId: 'acc_notion_001',
        },
      ];
    }

    if (name.includes('shopify')) {
      return [
        {
          opportunityId: 'opp_shopify_001',
          name: 'Shopify checkout app licensing suite',
          stage: 'Contacted',
          value: 50000,
          probability: 10,
          rationale: 'Initial contact with e-commerce operations team.',
          closeDate,
          accountId: 'acc_shopify_001',
        },
      ];
    }

    return [
      {
        opportunityId: 'opp_generic_001',
        name: `${companyName} B2B scaling automation`,
        stage: 'Discovery',
        value: 20000,
        probability: 30,
        rationale: 'Initial outbound context established.',
        closeDate,
        accountId: 'acc_generic_001',
      },
    ];
  }
}
export default OpportunityManager;
