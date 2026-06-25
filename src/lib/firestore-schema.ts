/**
 * Firestore Database Schema Definition
 * Complete collection structure for multi-tenant B2B SaaS platform
 */

import {
  User,
  Organization,
  Workspace,
  Invitation,
  Notification,
  ActivityFeedItem,
  Comment,
  Session,
  ApiKey,
} from '../types/auth';

/**
 * Collection Names - Centralized constants
 */
export const COLLECTIONS = {
  // Core Authentication & Organization
  USERS: 'users',
  ORGANIZATIONS: 'organizations',
  WORKSPACES: 'workspaces',

  // Access Control & Invitations
  INVITATIONS: 'invitations',
  SESSIONS: 'sessions',
  API_KEYS: 'api_keys',

  // Communication & Activity
  NOTIFICATIONS: 'notifications',
  ACTIVITY_FEED: 'activity_feed',
  COMMENTS: 'comments',

  // Business Logic Collections (already existing)
  WORKFLOWS: 'workflows',
  WORKFLOW_STEPS: 'workflow_steps',
  RESEARCH_REPORTS: 'research_reports',
  OPPORTUNITY_REPORTS: 'opportunity_reports',
  OUTREACH_CAMPAIGNS: 'outreach_campaigns',
  PROPOSALS: 'proposals',
  LEADS: 'leads',
  ACCOUNTS: 'accounts',
  CONTACTS: 'contacts',

  // Memory & Knowledge
  WORKFLOW_MEMORY: 'workflow_memory',
  AGENT_MEMORY: 'agent_memory',
  COMPANY_MEMORY: 'company_memory',
  KNOWLEDGE_GRAPH: 'knowledge_graph',

  // Platform & System
  AUDIT_LOGS: 'audit_logs',
  DOMAIN_EVENTS: 'domain_events',
  PROMPT_REGISTRY: 'prompt_registry',
  EVALUATION_RESULTS: 'evaluation_results',
} as const;

/**
 * Document Structure Definitions
 */

// User Document Structure
export interface UserDocument extends User {
  // Firestore-specific fields
  _lastTokenRefresh?: string;
  _securityHash?: string;
}

// Organization Document Structure
export interface OrganizationDocument extends Organization {
  // Computed fields for quick access
  _memberCount?: number;
  _workspaceCount?: number;
  _planExpiresAt?: string;
}

// Workspace Document Structure
export interface WorkspaceDocument extends Workspace {
  // Computed fields
  _memberCount?: number;
  _lastActivity?: string;
  _contentCount?: {
    workflows: number;
    reports: number;
    proposals: number;
    leads: number;
  };
}

/**
 * Firestore Indexes Required for Efficient Queries
 * These should be added to firestore.indexes.json
 */
export const REQUIRED_INDEXES = [
  // User queries
  {
    collectionGroup: 'users',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'organizationId', order: 'ASCENDING' },
      { fieldPath: 'role', order: 'ASCENDING' },
      { fieldPath: 'status', order: 'ASCENDING' },
    ],
  },
  {
    collectionGroup: 'users',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'email', order: 'ASCENDING' },
      { fieldPath: 'deleted', order: 'ASCENDING' },
    ],
  },

  // Organization queries
  {
    collectionGroup: 'organizations',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'domain', order: 'ASCENDING' },
      { fieldPath: 'plan', order: 'ASCENDING' },
    ],
  },

  // Workspace queries
  {
    collectionGroup: 'workspaces',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'organizationId', order: 'ASCENDING' },
      { fieldPath: 'type', order: 'ASCENDING' },
      { fieldPath: 'deleted', order: 'ASCENDING' },
    ],
  },
  {
    collectionGroup: 'workspaces',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'organizationId', order: 'ASCENDING' },
      { fieldPath: 'members.userId', order: 'ASCENDING' },
    ],
  },

  // Invitation queries
  {
    collectionGroup: 'invitations',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'organizationId', order: 'ASCENDING' },
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' },
    ],
  },
  {
    collectionGroup: 'invitations',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'email', order: 'ASCENDING' },
      { fieldPath: 'status', order: 'ASCENDING' },
    ],
  },
  {
    collectionGroup: 'invitations',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'token', order: 'ASCENDING' },
      { fieldPath: 'expiresAt', order: 'ASCENDING' },
    ],
  },

  // Notification queries
  {
    collectionGroup: 'notifications',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'userId', order: 'ASCENDING' },
      { fieldPath: 'read', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' },
    ],
  },
  {
    collectionGroup: 'notifications',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'organizationId', order: 'ASCENDING' },
      { fieldPath: 'type', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' },
    ],
  },

  // Activity Feed queries
  {
    collectionGroup: 'activity_feed',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'organizationId', order: 'ASCENDING' },
      { fieldPath: 'timestamp', order: 'DESCENDING' },
    ],
  },
  {
    collectionGroup: 'activity_feed',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'workspaceId', order: 'ASCENDING' },
      { fieldPath: 'timestamp', order: 'DESCENDING' },
    ],
  },
  {
    collectionGroup: 'activity_feed',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'userId', order: 'ASCENDING' },
      { fieldPath: 'timestamp', order: 'DESCENDING' },
    ],
  },
  {
    collectionGroup: 'activity_feed',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'organizationId', order: 'ASCENDING' },
      { fieldPath: 'action', order: 'ASCENDING' },
      { fieldPath: 'timestamp', order: 'DESCENDING' },
    ],
  },

  // Comment queries
  {
    collectionGroup: 'comments',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'entityType', order: 'ASCENDING' },
      { fieldPath: 'entityId', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'ASCENDING' },
    ],
  },
  {
    collectionGroup: 'comments',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'organizationId', order: 'ASCENDING' },
      { fieldPath: 'authorId', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' },
    ],
  },
  {
    collectionGroup: 'comments',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'workspaceId', order: 'ASCENDING' },
      { fieldPath: 'entityType', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' },
    ],
  },

  // Session queries
  {
    collectionGroup: 'sessions',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'userId', order: 'ASCENDING' },
      { fieldPath: 'revoked', order: 'ASCENDING' },
      { fieldPath: 'lastActiveAt', order: 'DESCENDING' },
    ],
  },
  {
    collectionGroup: 'sessions',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'expiresAt', order: 'ASCENDING' },
      { fieldPath: 'revoked', order: 'ASCENDING' },
    ],
  },

  // Business Logic Collection Indexes (enhance existing)
  {
    collectionGroup: 'workflows',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'organizationId', order: 'ASCENDING' },
      { fieldPath: 'workspaceId', order: 'ASCENDING' },
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' },
    ],
  },
  {
    collectionGroup: 'research_reports',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'organizationId', order: 'ASCENDING' },
      { fieldPath: 'workspaceId', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' },
    ],
  },
  {
    collectionGroup: 'proposals',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'organizationId', order: 'ASCENDING' },
      { fieldPath: 'workspaceId', order: 'ASCENDING' },
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' },
    ],
  },
  {
    collectionGroup: 'leads',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'organizationId', order: 'ASCENDING' },
      { fieldPath: 'workspaceId', order: 'ASCENDING' },
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'score', order: 'DESCENDING' },
    ],
  },
];

/**
 * Collection Security Rules Helpers
 */
export const SECURITY_RULES_HELPERS = {
  // Standard multi-tenant read access
  canRead: `
    function canRead(resourceDoc) {
      return isSignedIn() && (
        isAdmin() || 
        isTenantOwner(resourceDoc)
      );
    }
  `,

  // Standard multi-tenant write access
  canWrite: `
    function canWrite(incomingDoc) {
      return isSignedIn() && (
        isAdmin() || 
        (hasRole(['Owner', 'Admin', 'Manager']) && isValidWrite(incomingDoc))
      );
    }
  `,

  // Workspace-level access control
  canAccessWorkspace: `
    function canAccessWorkspace(workspaceId) {
      return isSignedIn() && (
        isAdmin() || 
        (exists(/databases/$(database)/documents/users/$(request.auth.uid)) && 
         getUserData().workspaceIds.hasAny([workspaceId]))
      );
    }
  `,
};

/**
 * Document Validation Rules
 */
export const VALIDATION_RULES = {
  user: {
    required: ['name', 'email', 'role', 'organizationId'],
    email: 'valid email format',
    role: ['Owner', 'Admin', 'Manager', 'Sales Rep', 'Viewer'],
    maxLength: {
      name: 100,
      email: 254,
    },
  },

  organization: {
    required: ['name', 'domain', 'owner'],
    maxLength: {
      name: 100,
      domain: 253,
    },
    plan: ['Free', 'Pro', 'Business', 'Enterprise'],
  },

  workspace: {
    required: ['name', 'organizationId', 'createdBy'],
    maxLength: {
      name: 100,
      description: 500,
    },
    type: ['sales', 'marketing', 'customer_success', 'general'],
  },

  invitation: {
    required: ['organizationId', 'email', 'role', 'invitedBy', 'token', 'expiresAt'],
    email: 'valid email format',
    role: ['Owner', 'Admin', 'Manager', 'Sales Rep', 'Viewer'],
    status: ['pending', 'accepted', 'expired', 'revoked'],
  },

  comment: {
    required: ['organizationId', 'workspaceId', 'entityType', 'entityId', 'authorId', 'content'],
    maxLength: {
      content: 2000,
    },
    entityType: ['research_report', 'opportunity_report', 'proposal', 'lead', 'campaign'],
  },
};

/**
 * Default Document Templates
 */
export const DOCUMENT_TEMPLATES = {
  newUser: (userData: Partial<User>): Partial<UserDocument> => ({
    name: userData.name || '',
    email: userData.email || '',
    role: userData.role || 'Sales Rep',
    organizationId: userData.organizationId || '',
    workspaceIds: userData.workspaceIds || [],
    preferences: {
      activeWorkspaceId: '',
      theme: 'dark',
      language: 'en',
      timezone: 'UTC',
      notifications: {
        email: true,
        inApp: true,
        workflowUpdates: true,
        teamInvites: true,
        proposalUpdates: true,
        followupReminders: true,
      },
      ...userData.preferences,
    },
    activityMetrics: {
      workflowsRun: 0,
      proposalsCreated: 0,
      leadsGenerated: 0,
      lastActiveAt: new Date().toISOString(),
      sessionCount: 0,
      ...userData.activityMetrics,
    },
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }),

  newOrganization: (orgData: Partial<Organization>): Partial<OrganizationDocument> => ({
    organizationId: orgData.organizationId || orgData.id || '',
    name: orgData.name || '',
    domain: orgData.domain || '',
    owner: orgData.owner || '',
    plan: 'Free',
    settings: {
      branding: {
        primaryColor: '#6366f1',
        theme: 'dark',
      },
      security: {
        mfa: false,
        ssoEnabled: false,
        sessionTimeout: 480, // 8 hours
        passwordPolicy: {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSymbols: false,
          maxAge: 0, // No expiry
        },
      },
      features: {
        aiEnabled: true,
        collaborationEnabled: true,
        advancedReporting: false,
        apiAccess: false,
      },
      integrations: {},
      ...orgData.settings,
    },
    limits: {
      maxUsers: 3,
      maxWorkspaces: 2,
      maxWorkflowRuns: 50,
      maxStorageGB: 1,
      currentUsers: 1,
      currentWorkspaces: 1,
      currentWorkflowRuns: 0,
      currentStorageGB: 0,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }),

  newWorkspace: (workspaceData: Partial<Workspace>): Partial<WorkspaceDocument> => ({
    organizationId: workspaceData.organizationId || '',
    name: workspaceData.name || 'New Workspace',
    description: workspaceData.description || '',
    type: workspaceData.type || 'sales',
    settings: {
      isDefault: false,
      visibility: 'organization',
      aiSettings: {
        model: 'gemini-pro',
        temperature: 0.7,
        enableAutoGeneration: true,
      },
      collaboration: {
        allowComments: true,
        allowSharing: true,
        requireApproval: false,
      },
      ...workspaceData.settings,
    },
    members: workspaceData.members || [],
    createdBy: workspaceData.createdBy || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }),
};

export type FirestoreSchema = {
  [COLLECTIONS.USERS]: UserDocument;
  [COLLECTIONS.ORGANIZATIONS]: OrganizationDocument;
  [COLLECTIONS.WORKSPACES]: WorkspaceDocument;
  [COLLECTIONS.INVITATIONS]: Invitation;
  [COLLECTIONS.NOTIFICATIONS]: Notification;
  [COLLECTIONS.ACTIVITY_FEED]: ActivityFeedItem;
  [COLLECTIONS.COMMENTS]: Comment;
  [COLLECTIONS.SESSIONS]: Session;
  [COLLECTIONS.API_KEYS]: ApiKey;
};
