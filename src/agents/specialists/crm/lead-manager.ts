import { LeadRecord, LeadStatus } from './types';

export class LeadManager {
  public async createLead(
    companyName: string,
    contactName: string,
    contactEmail: string,
    contactRole: string,
    score = 70,
  ): Promise<LeadRecord> {
    const timestamp = new Date().toISOString();
    return {
      leadId: `lead_${Math.random().toString(36).substring(2, 9)}`,
      company: companyName,
      contact: {
        name: contactName,
        email: contactEmail,
        role: contactRole,
      },
      status: 'New Lead' as LeadStatus,
      score,
      owner: 'mock-user-123',
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  }

  public calculateLeadScore(
    currentScore: number,
    engagementCount: number,
    hasActiveOpportunity: boolean,
  ): number {
    // Basic lead scoring calculation logic
    let score = currentScore;
    score += engagementCount * 5; // +5 points per engagement activity
    if (hasActiveOpportunity) {
      score += 15; // +15 points for active deals
    }
    return Math.min(100, Math.max(0, score));
  }

  public getMockLeads(companyName: string): LeadRecord[] {
    const name = companyName.toLowerCase();
    const timestamp = new Date().toISOString();

    if (name.includes('stripe')) {
      return [
        {
          leadId: 'lead_stripe_001',
          company: 'Stripe',
          contact: {
            name: 'John Collison',
            email: 'john@stripe.com',
            role: 'Co-Founder / President',
          },
          status: 'Discovery' as LeadStatus,
          score: 85,
          owner: 'mock-user-123',
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ];
    }

    if (name.includes('hubspot')) {
      return [
        {
          leadId: 'lead_hubspot_001',
          company: 'HubSpot',
          contact: {
            name: 'Brian Halligan',
            email: 'brian@hubspot.com',
            role: 'Co-Founder',
          },
          status: 'Proposal Sent' as LeadStatus,
          score: 90,
          owner: 'mock-user-123',
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ];
    }

    if (name.includes('salesforce')) {
      return [
        {
          leadId: 'lead_salesforce_001',
          company: 'Salesforce',
          contact: {
            name: 'Marc Benioff',
            email: 'marc@salesforce.com',
            role: 'CEO',
          },
          status: 'Negotiation' as LeadStatus,
          score: 95,
          owner: 'mock-user-123',
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ];
    }

    if (name.includes('notion')) {
      return [
        {
          leadId: 'lead_notion_001',
          company: 'Notion',
          contact: {
            name: 'Ivan Zhao',
            email: 'ivan@notion.so',
            role: 'Co-Founder / CEO',
          },
          status: 'Researching' as LeadStatus,
          score: 75,
          owner: 'mock-user-123',
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ];
    }

    if (name.includes('shopify')) {
      return [
        {
          leadId: 'lead_shopify_001',
          company: 'Shopify',
          contact: {
            name: 'Tobi Lutke',
            email: 'tobi@shopify.com',
            role: 'Founder & CEO',
          },
          status: 'Contacted' as LeadStatus,
          score: 80,
          owner: 'mock-user-123',
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ];
    }

    return [
      {
        leadId: 'lead_generic_001',
        company: companyName,
        contact: {
          name: 'Jane Doe',
          email: `jane@${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
          role: 'VP Sales',
        },
        status: 'New Lead' as LeadStatus,
        score: 65,
        owner: 'mock-user-123',
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ];
  }
}
export default LeadManager;
