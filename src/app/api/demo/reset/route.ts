import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { COLLECTIONS } from '@/lib/firestore-schema';
import { logger } from '@/utils/logger';
import crypto from 'crypto';

const DEMO_COMPANIES = [
  {
    name: 'Stripe',
    domain: 'stripe.com',
    industry: 'Financial Services',
    description: 'Payment processing platform for the internet.',
  },
  {
    name: 'HubSpot',
    domain: 'hubspot.com',
    industry: 'Software',
    description: 'CRM, marketing, sales, and customer service software.',
  },
  {
    name: 'Shopify',
    domain: 'shopify.com',
    industry: 'E-commerce',
    description:
      'Global commerce company providing trusted tools to start, grow, market, and manage a retail business.',
  },
  {
    name: 'Atlassian',
    domain: 'atlassian.com',
    industry: 'Software',
    description: 'Collaboration, development, and issue tracking software for teams.',
  },
  {
    name: 'Snowflake',
    domain: 'snowflake.com',
    industry: 'Data Analytics',
    description: 'Cloud computing-based data cloud company.',
  },
  {
    name: 'Canva',
    domain: 'canva.com',
    industry: 'Design',
    description: 'Online design and publishing tool.',
  },
  {
    name: 'Notion',
    domain: 'notion.so',
    industry: 'Productivity',
    description: 'All-in-one workspace for your notes, tasks, wikis, and databases.',
  },
  {
    name: 'Datadog',
    domain: 'datadoghq.com',
    industry: 'Cloud Monitoring',
    description: 'Monitoring and security platform for cloud applications.',
  },
];

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    logger.info('Starting Demo Reset and Seed process...');

    // In a real production app, we would authenticate the admin user here.
    // For demo/hackathon purposes, we proceed if a token is present.

    // Wipe specific collections (Leads, Opportunities, Outreach)
    const collectionsToWipe = [
      COLLECTIONS.LEADS,
      COLLECTIONS.OPPORTUNITY_REPORTS,
      COLLECTIONS.OUTREACH_CAMPAIGNS,
      COLLECTIONS.ACTIVITY_FEED,
    ];

    for (const coll of collectionsToWipe) {
      const snapshot = await adminDb.collection(coll).get();
      const batch = adminDb.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      logger.info(`Wiped collection: ${coll}`);
    }

    const organizationId = 'demo-org-id';

    // Seed new data
    const batch = adminDb.batch();

    DEMO_COMPANIES.forEach((company) => {
      // Create Lead
      const leadId = crypto.randomUUID();
      const leadRef = adminDb.collection(COLLECTIONS.LEADS).doc(leadId);
      batch.set(leadRef, {
        id: leadId,
        organizationId,
        companyName: company.name,
        domain: company.domain,
        industry: company.industry,
        status: 'new',
        score: Math.floor(Math.random() * 40) + 60, // 60-99
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Create Opportunity
      const oppId = crypto.randomUUID();
      const oppRef = adminDb.collection(COLLECTIONS.OPPORTUNITY_REPORTS).doc(oppId);
      batch.set(oppRef, {
        id: oppId,
        organizationId,
        leadId,
        title: `${company.name} - Enterprise License Expansion`,
        value: Math.floor(Math.random() * 50000) + 10000,
        stage: 'discovery',
        painPoints: [
          'Siloed data analytics',
          'High customer churn in Q3',
          'Inefficient sales workflows',
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Create Outreach
      const outreachId = crypto.randomUUID();
      const outreachRef = adminDb.collection(COLLECTIONS.OUTREACH_CAMPAIGNS).doc(outreachId);
      batch.set(outreachRef, {
        id: outreachId,
        organizationId,
        opportunityId: oppId,
        status: 'draft',
        type: 'email',
        subject: `Strategic Partnership with ${company.name}`,
        content: `Hi team,\n\nI noticed ${company.name} is scaling rapidly. Our intelligence agent can help streamline your sales pipeline by unifying data silos.\n\nLet's chat.`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Create Activity
      const activityRef = adminDb.collection(COLLECTIONS.ACTIVITY_FEED).doc();
      batch.set(activityRef, {
        userId: 'system',
        userName: 'Demo Seeder',
        organizationId,
        action: 'CREATED',
        entityType: 'lead',
        entityName: company.name,
        details: `Seeded ${company.name} for demo`,
        timestamp: new Date().toISOString(),
      });
    });

    await batch.commit();

    logger.info('Demo data successfully seeded.');

    return NextResponse.json({ success: true, message: 'Demo environment reset successfully.' });
  } catch (error) {
    logger.error('Failed to reset demo environment', error);
    return NextResponse.json({ error: 'Failed to reset demo environment' }, { status: 500 });
  }
}
