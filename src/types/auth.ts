/**
 * Authentication and Authorization Type Definitions
 * Defines the complete schema for multi-tenant B2B SaaS platform
 */

// Core User and Authentication Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: Role;
  organizationId: string;
  workspaceIds: string[];
  preferences: UserPreferences;
  activityMetrics: ActivityMetrics;
  status: 'active' | 'inactive' | 'suspended';
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  deleted?: boolean;
}

export interface UserPreferences {
  activeWorkspaceId: string;
  theme: 'light' | 'dark';
  language: string;
  timezone: string;
  notifications: NotificationPreferences;
  industry?: string;
  teamSize?: string;
  roleTitle?: string;
}

export interface NotificationPreferences {
  email: boolean;
  inApp: boolean;
  workflowUpdates: boolean;
  teamInvites: boolean;
  proposalUpdates: boolean;
  followupReminders: boolean;
}

export interface ActivityMetrics {
  workflowsRun: number;
  proposalsCreated: number;
  leadsGenerated: number;
  lastActiveAt: string;
  sessionCount: number;
}

// Organization Structure
export interface Organization {
  id: string;
  organizationId: string; // For consistency with existing schema
  name: string;
  domain: string;
  owner: string; // User ID of organization owner
  logo?: string;
  industry?: string;
  size?: 'startup' | 'small' | 'medium' | 'enterprise';
  plan: Plan;
  settings: OrganizationSettings;
  billing?: BillingInfo;
  limits: UsageLimits;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationSettings {
  branding: {
    primaryColor: string;
    logo?: string;
    theme: 'light' | 'dark';
  };
  security: {
    mfa: boolean;
    ssoEnabled: boolean;
    passwordPolicy: PasswordPolicy;
    sessionTimeout: number; // in minutes
  };
  features: {
    aiEnabled: boolean;
    collaborationEnabled: boolean;
    advancedReporting: boolean;
    apiAccess: boolean;
  };
  integrations: {
    crm?: string; // 'salesforce' | 'hubspot' | 'pipedrive'
    email?: string; // 'gmail' | 'outlook'
  };
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSymbols: boolean;
  maxAge: number; // in days, 0 for no expiry
}

export interface BillingInfo {
  customerId: string;
  subscriptionId?: string;
  paymentMethod?: string;
  billingEmail: string;
  nextBillingDate?: string;
  status: 'active' | 'past_due' | 'cancelled' | 'trial';
}

export interface UsageLimits {
  maxUsers: number;
  maxWorkspaces: number;
  maxWorkflowRuns: number;
  maxStorageGB: number;
  currentUsers: number;
  currentWorkspaces: number;
  currentWorkflowRuns: number;
  currentStorageGB: number;
}

// Workspace Management
export interface Workspace {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  type: 'sales' | 'marketing' | 'customer_success' | 'general';
  settings: WorkspaceSettings;
  members: WorkspaceMember[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deleted?: boolean;
}

export interface WorkspaceSettings {
  isDefault: boolean;
  visibility: 'private' | 'organization';
  aiSettings: {
    model: string;
    temperature: number;
    enableAutoGeneration: boolean;
  };
  collaboration: {
    allowComments: boolean;
    allowSharing: boolean;
    requireApproval: boolean;
  };
}

export interface WorkspaceMember {
  userId: string;
  role: WorkspaceRole;
  permissions: Permission[];
  joinedAt: string;
}

// Role-Based Access Control
export type Role = 'Owner' | 'Admin' | 'Manager' | 'Sales Rep' | 'Viewer';
export type WorkspaceRole = 'Owner' | 'Admin' | 'Manager' | 'Member' | 'Viewer';

export interface RoleDefinition {
  name: Role;
  displayName: string;
  description: string;
  permissions: Permission[];
  isSystemRole: boolean;
  level: number; // For hierarchy: Owner=5, Admin=4, Manager=3, Sales Rep=2, Viewer=1
}

export type Permission = 
  // User Management
  | 'users.create'
  | 'users.read'
  | 'users.update'
  | 'users.delete'
  | 'users.invite'
  | 'users.manage_roles'
  
  // Organization Management
  | 'organization.read'
  | 'organization.update'
  | 'organization.settings'
  | 'organization.billing'
  | 'organization.delete'
  
  // Workspace Management
  | 'workspaces.create'
  | 'workspaces.read'
  | 'workspaces.update'
  | 'workspaces.delete'
  | 'workspaces.manage_members'
  
  // Content Management
  | 'workflows.create'
  | 'workflows.read'
  | 'workflows.update'
  | 'workflows.delete'
  | 'workflows.execute'
  
  | 'reports.create'
  | 'reports.read'
  | 'reports.update'
  | 'reports.delete'
  | 'reports.export'
  
  | 'proposals.create'
  | 'proposals.read'
  | 'proposals.update'
  | 'proposals.delete'
  | 'proposals.share'
  
  | 'leads.create'
  | 'leads.read'
  | 'leads.update'
  | 'leads.delete'
  | 'leads.import'
  | 'leads.export'
  
  // Collaboration
  | 'comments.create'
  | 'comments.read'
  | 'comments.update'
  | 'comments.delete'
  
  // System
  | 'system.admin'
  | 'system.audit'
  | 'system.backup';

// Invitation System
export interface Invitation {
  id: string;
  organizationId: string;
  workspaceIds?: string[];
  email: string;
  role: Role;
  workspaceRole?: WorkspaceRole;
  invitedBy: string;
  invitedByName: string;
  token: string;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  message?: string;
  expiresAt: string;
  acceptedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Notification System
export interface Notification {
  id: string;
  userId: string;
  organizationId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  readAt?: string;
  expiresAt?: string;
}

export type NotificationType =
  | 'team_invite'
  | 'workflow_complete'
  | 'proposal_created'
  | 'follow_up_reminder'
  | 'crm_update'
  | 'workspace_added'
  | 'role_changed'
  | 'system_update'
  | 'billing_update';

// Activity Feed
export interface ActivityFeedItem {
  id: string;
  organizationId: string;
  workspaceId?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  action: ActivityAction;
  entityType: string;
  entityId: string;
  entityName?: string;
  details: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export type ActivityAction =
  | 'CREATED'
  | 'UPDATED'
  | 'DELETED'
  | 'SHARED'
  | 'COMPLETED'
  | 'INVITED'
  | 'JOINED'
  | 'LEFT'
  | 'ROLE_CHANGED'
  | 'WORKFLOW_EXECUTED'
  | 'PROPOSAL_GENERATED'
  | 'LEAD_CREATED'
  | 'ONBOARDING_COMPLETED';

// Comments and Collaboration
export interface Comment {
  id: string;
  organizationId: string;
  workspaceId: string;
  entityType: 'research_report' | 'opportunity_report' | 'proposal' | 'lead' | 'campaign';
  entityId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  mentions: string[]; // User IDs mentioned in comment
  attachments?: CommentAttachment[];
  parentId?: string; // For threaded comments
  reactions: CommentReaction[];
  edited: boolean;
  editedAt?: string;
  createdAt: string;
  updatedAt: string;
  deleted?: boolean;
}

export interface CommentAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface CommentReaction {
  userId: string;
  emoji: string;
  createdAt: string;
}

// Plans and Pricing
export type Plan = 'Free' | 'Pro' | 'Business' | 'Enterprise';

export interface PlanFeatures {
  name: Plan;
  displayName: string;
  price: number; // Monthly price in cents
  yearlyPrice?: number; // Yearly price in cents
  maxUsers: number;
  maxWorkspaces: number;
  maxWorkflowRuns: number;
  storageGB: number;
  features: {
    aiEnabled: boolean;
    advancedReporting: boolean;
    apiAccess: boolean;
    ssoEnabled: boolean;
    prioritySupport: boolean;
    customBranding: boolean;
  };
}

// Session and Security
export interface Session {
  id: string;
  userId: string;
  organizationId: string;
  deviceInfo: {
    userAgent: string;
    ip: string;
    location?: string;
  };
  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;
  revoked: boolean;
}

// API Keys for third-party integrations
export interface ApiKey {
  id: string;
  organizationId: string;
  name: string;
  keyHash: string; // Hashed version of the actual key
  permissions: Permission[];
  lastUsed?: string;
  createdBy: string;
  expiresAt?: string;
  revoked: boolean;
  createdAt: string;
  updatedAt: string;
}

// Export combined types for easy importing
export type AuthSchemaTypes = {
  User: User;
  Organization: Organization;
  Workspace: Workspace;
  Invitation: Invitation;
  Notification: Notification;
  ActivityFeedItem: ActivityFeedItem;
  Comment: Comment;
  Session: Session;
  ApiKey: ApiKey;
  RoleDefinition: RoleDefinition;
};