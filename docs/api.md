# API Documentation

## Overview

This document describes the API structure, endpoints, data contracts, and integration patterns used in the Autonomous B2B Sales Intelligence Agent platform.

## Table of Contents

1. [API Overview](#api-overview)
2. [Authentication](#authentication)
3. [Error Handling](#error-handling)
4. [Rate Limiting](#rate-limiting)
5. [Endpoints](#endpoints)
   - [Authentication](#authentication-endpoints)
   - [CRM](#crm-endpoints)
   - [Research](#research-endpoints)
   - [Opportunities](#opportunities-endpoints)
   - [Outreach](#outreach-endpoints)
   - [Analytics](#analytics-endpoints)
   - [Memory](#memory-endpoints)
   - [Proposals](#proposals-endpoints)
6. [Data Models](#data-models)
7. [WebSocket API](#websocket-api)
8. [API Versioning](#api-versioning)
9. [Development Guidelines](#development-guidelines)

## API Overview

The application uses a RESTful API design with JSON payloads, served through Next.js API routes. All API endpoints are prefixed with `/api` and follow consistent patterns for request/response formatting, error handling, and authentication.

### Base URL
```
https://api.yourdomain.com/api
```
or in development:
```
http://localhost:3000/api
```

### Request/Response Format

All API endpoints use JSON for request and response bodies:

```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": {
    "timestamp": "2026-06-23T10:30:00Z",
    "requestId": "req_123456789"
  }
}
```

### HTTP Methods

- `GET`: Retrieve resources
- `POST`: Create new resources
- `PUT`: Update existing resources (full replacement)
- `PATCH`: Update existing resources (partial modification)
- `DELETE`: Remove resources

### Status Codes

- `200`: Success (GET, PUT, PATCH)
- `201`: Created (POST)
- `204`: No Content (DELETE)
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `422`: Unprocessable Entity
- `429`: Too Many Requests
- `500`: Internal Server Error
- `503`: Service Unavailable

## Authentication

The API uses JWT (JSON Web Token) for authentication. Tokens are obtained through the authentication endpoint and must be included in the Authorization header for protected endpoints.

### Login Endpoint

```
POST /api/auth/login
```

#### Request Body
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
    "expiresIn": 3600,
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "admin",
      "organizationId": "org_456"
    }
  },
  "error": null,
  "meta": {
    "timestamp": "2026-06-23T10:30:00Z",
    "requestId": "req_123456789"
  }
}
```

### Token Usage

Include the access token in the Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Refresh

```
POST /api/auth/refresh
```

#### Request Body
```json
{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
}
```

## Error Handling

All API errors follow a consistent format:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-06-23T10:30:00Z",
    "requestId": "req_123456789"
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR`: Input validation failed
- `AUTHENTICATION_ERROR`: Invalid or missing credentials
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `RESOURCE_NOT_FOUND`: Requested resource doesn't exist
- `RESOURCE_CONFLICT`: Conflict with existing resource
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Unexpected server error
- `SERVICE_UNAVAILABLE`: Temporary service outage

## Rate Limiting

API endpoints implement rate limiting to prevent abuse:

- **Authenticated users**: 1000 requests per hour
- **Unauthenticated users**: 100 requests per hour
- **Burst limit**: 100 requests per minute

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Timestamp when limit resets

## Endpoints

### Authentication Endpoints

#### Login
```
POST /api/auth/login
```
Authenticate user and return access/refresh tokens

#### Logout
```
POST /api/auth/logout
```
Invalidate refresh token

#### Refresh Token
```
POST /api/auth/refresh
```
Get new access token using refresh token

#### Get Current User
```
GET /api/auth/me
```
Get current user profile

### CRM Endpoints

#### Leads

##### Get Leads
```
GET /api/crm/leads
```
Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `sort`: Sort field (default: createdAt)
- `order`: Sort order (asc/desc, default: desc)
- `status`: Filter by lead status
- `source`: Filter by lead source
- `search`: Search term for name, email, company

##### Get Lead by ID
```
GET /api/crm/leads/:id
```

##### Create Lead
```
POST /api/crm/leads
```
Request body:
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  "phone": "+1234567890",
  "company": "Acme Corp",
  "title": "Sales Manager",
  "industry": "Technology",
  "source": "website",
  "status": "new",
  "leadScore": 75,
  "tags": ["enterprise", "tech"]
}
```

##### Update Lead
```
PUT /api/crm/leads/:id
```
or
```
PATCH /api/crm/leads/:id
```

##### Delete Lead
```
DELETE /api/crm/leads/:id
```

#### Contacts

Similar endpoints exist for contacts under `/api/crm/contacts`

#### Accounts

Similar endpoints exist for accounts under `/api/crm/accounts`

#### Activities

##### Get Activities
```
GET /api/crm/activities
```
Query parameters:
- `leadId`: Filter by lead ID
- `contactId`: Filter by contact ID
- `activityType`: Filter by type (call, email, meeting, etc.)
- `dateFrom`: Start date filter
- `dateTo`: End date filter
- `page`, `limit`, `sort`, `order`: Pagination and sorting

##### Log Activity
```
POST /api/crm/activities
```
Request body varies by activity type

### Research Endpoints

#### Company Research

##### Search Companies
```
GET /api/research/companies
```
Query parameters:
- `query`: Search term
- `industry`: Filter by industry
- `location`: Filter by location
- `minEmployees`: Minimum employee count
- `maxEmployees`: Maximum employee count
- `revenueRange`: Revenue range filter
- `techStack`: Filter by technology stack
- `page`, `limit`, `sort`, `order`: Pagination and sorting

##### Get Company Details
```
GET /api/research/companies/:id
```

##### Get Company Insights
```
GET /api/research/companies/:id/insights
```

#### Competitor Analysis

##### Get Competitor Landscape
```
GET /api/research/competitors/:companyId
```

##### Get Competitor Comparison
```
GET /api/research/competitors/:companyId/compare
```

#### Opportunity Scoring

##### Calculate Opportunity Score
```
POST /api/research/opportunity-score
```
Request body:
```json
{
  "companyId": "company_123",
  "criteria": {
    "budget": 85,
    "timeline": 70,
    "authority": 90,
    "need": 80
  }
}
```

### Opportunities Endpoints

#### Get Opportunities
```
GET /api/opportunities
```
Query parameters:
- `stage`: Filter by opportunity stage
- `probabilityMin`: Minimum probability (%)
- `probabilityMax`: Maximum probability (%)
- `amountMin`: Minimum amount
- `amountMax`: Maximum amount
- `closeDateFrom`: Earliest close date
- `closeDateTo`: Latest close date
- `ownerId`: Filter by owner
- `leadId`: Filter by associated lead
- `search`: Search term
- `page`, `limit`, `sort`, `order`: Pagination and sorting

#### Get Opportunity by ID
```
GET /api/opportunities/:id
```

#### Create Opportunity
```
POST /api/opportunities
```
Request body:
```json
{
  "name": "Q4 Enterprise Deal",
  "description": "Large enterprise software deal",
  "amount": 150000,
  "currency": "USD",
  "probability": 65,
  "stage": "proposal",
  "leadId": "lead_123",
  "expectedCloseDate": "2026-12-31",
  "tags": ["enterprise", "q4"]
}
```

#### Update Opportunity
```
PUT /api/opportunities/:id
```
or
```
PATCH /api/opportunities/:id
```

#### Delete Opportunity
```
DELETE /api/opportunities/:id
```

### Outreach Endpoints

#### Campaigns

##### Get Campaigns
```
GET /api/outreach/campaigns
```
Query parameters:
- `status`: Filter by campaign status (draft, active, paused, completed)
- `type`: Filter by campaign type (email, linkedin, multi-channel)
- `ownerId`: Filter by campaign owner
- `page`, `limit`, `sort`, `order`: Pagination and sorting

##### Get Campaign by ID
```
GET /api/outreach/campaigns/:id
```

##### Create Campaign
```
POST /api/outreach/campaigns
```
Request body:
```json
{
  "name": "Q4 Outreach Campaign",
  "description": "Targeted outreach for Q4 enterprise deals",
  "type": "email",
  "status": "draft",
  "startDate": "2026-07-01",
  "endDate": "2026-09-30",
  "dailyLimit": 50,
  "timezone": "America/New_York"
}
```

##### Update Campaign
```
PUT /api/outreach/campaigns/:id
```
or
```
PATCH /api/outreach/campaigns/:id
```

##### Delete Campaign
```
DELETE /api/outreach/campaigns/:id
```

#### Sequences

Similar endpoints exist for sequences under `/api/outreach/sequences`

#### Templates

Similar endpoints exist for templates under `/api/outreach/templates`

#### Analytics

##### Get Campaign Performance
```
GET /api/outreach/campaigns/:id/analytics
```

##### Get Sequence Performance
```
GET /api/outreach/sequences/:id/analytics
```

### Analytics Endpoints

#### Usage Analytics

##### Get Module Usage
```
GET /api/analytics/usage
```
Query parameters:
- `module`: Filter by module (crm, research, outreach, etc.)
- `dateFrom`: Start date
- `dateTo`: End date
- `granularity`: daily, weekly, monthly
- `userId`: Filter by user

##### Get User Activity
```
GET /api/analytics/user-activity
```
Query parameters:
- `userId`: Specific user (optional, defaults to current user)
- `dateFrom`: Start date
- `dateTo`: End date
- `actionType`: Filter by action type

#### Performance Metrics

##### Get System Performance
```
GET /api/analytics/performance
```
Query parameters:
- `metric`: Specific metric to retrieve
- `dateFrom`: Start date
- `dateTo`: End date
- `granularity`: hourly, daily, weekly

##### Get AI Performance
```
GET /api/analytics/ai-performance
```
Query parameters:
- `model`: Specific AI model
- `dateFrom`: Start date
- `dateTo`: End date

#### Business Impact

##### Get Revenue Metrics
```
GET /api/analytics/revenue
```
Query parameters:
- `dateFrom`: Start date
- `dateTo`: End date
- `granularity`: daily, weekly, monthly
- `segment`: Filter by segment (new business, expansion, renewal)

##### Get Pipeline Metrics
```
GET /api/analytics/pipeline
```
Query parameters:
- `dateFrom`: Start date
- `dateTo`: End date
- `stage`: Filter by opportunity stage

### Memory Endpoints

#### Knowledge Graph

##### Get Knowledge Graph
```
GET /api/memory/knowledge-graph
```
Query parameters:
- `depth`: Traversal depth (default: 2)
- `nodeTypes`: Filter by node types (company, person, technology)
- `limit`: Maximum nodes to return
- `offset`: Pagination offset

##### Get Node Details
```
GET /api/memory/knowledge-graph/nodes/:id
```

##### Get Node Relationships
```
GET /api/memory/knowledge-graph/nodes/:id/relationships
```

#### Company Intelligence

##### Get Company Intelligence
```
GET /api/memory/companies/:id
```

##### Update Company Intelligence
```
PUT /api/memory/companies/:id
```
or
```
PATCH /api/memory/companies/:id
```

#### Agent Interactions

##### Get Agent Interactions
```
GET /api/memory/agent-interactions
```
Query parameters:
- `agentId`: Filter by specific agent
- `interactionType`: Filter by type (collaboration, consultation, delegation)
- `dateFrom`: Start date
- `dateTo`: End date
- `page`, `limit`, `sort`, `order`: Pagination and sorting

##### Log Agent Interaction
```
POST /api/memory/agent-interactions
```
Request body:
```json
{
  "agentId": "agent_123",
  "interactionType": "collaboration",
  "participants": ["agent_456", "agent_789"],
  "topic": "Lead qualification strategy",
  "summary": "Discussed approaches for qualifying enterprise leads",
  "outcome": "Agreed on hybrid scoring model",
  "timestamp": "2026-06-23T10:30:00Z"
}
```

### Proposals Endpoints

#### Get Proposals
```
GET /api/proposals
```
Query parameters:
- `status`: Filter by proposal status (draft, sent, viewed, accepted, rejected)
- `opportunityId`: Filter by associated opportunity
- `templateId`: Filter by template used
- `dateFrom`: Start date
- `dateTo`: End date
- `page`, `limit`, `sort`, `order`: Pagination and sorting

##### Get Proposal by ID
```
GET /api/proposals/:id
```

##### Create Proposal
```
POST /api/proposals
```
Request body:
```json
{
  "title": "Enterprise Software Solution Proposal",
  "opportunityId": "opp_123",
  "templateId": "template_enterprise_saas",
  "sections": [
    {
      "type": "executive-summary",
      "content": {
        "title": "Executive Summary",
        "blocks": [
          { "type": "paragraph", "content": "We propose..." }
        ]
      }
    },
    {
      "type": "pricing",
      "content": {
        "items": [
          { "name": "Software License", "quantity": 1, "price": 50000 }
        ]
      }
    }
  ],
  "validUntil": "2026-09-30",
  "terms": "Standard terms and conditions apply"
}
```

##### Update Proposal
```
PUT /api/proposals/:id
```
or
```
PATCH /api/proposals/:id
```

##### Delete Proposal
```
DELETE /api/proposals/:id
```

##### Send Proposal
```
POST /api/proposals/:id/send
```
Request body:
```json
{
  "recipients": ["client@example.com"],
  "message": "Please review the attached proposal",
  "trackViews": true
}
```

##### Get Proposal Analytics
```
GET /api/proposals/:id/analytics
```

## Data Models

### Common Fields

All data models include these common fields:
- `id`: Unique identifier (UUID or ULID)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp
- `createdBy`: User who created the record
- `updatedBy`: User who last updated the record
- `isActive`: Soft delete flag
- `version`: Record version for optimistic locking

### Lead Model

```typescript
interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company: string;
  title?: string;
  industry?: string;
  source: LeadSource;
  status: LeadStatus;
  leadScore: number; // 0-100
  tags: string[];
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  createdAt: string;
  updatedAt: string;
}

type LeadSource = 'website' | 'referral' | 'social_media' | 'email_campaign' | 'event' | 'outbound' | 'other';
type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
```

### Opportunity Model

```typescript
interface Opportunity {
  id: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  probability: number; // 0-100
  stage: OpportunityStage;
  leadId: string;
  contactId?: string;
  accountId?: string;
  ownerId: string;
  expectedCloseDate: string; // ISO date
  actualCloseDate?: string;
  tags: string[];
  forecastCategory: 'pipeline' | 'best-case' | 'commit';
  createdAt: string;
  updatedAt: string;
}

type OpportunityStage = 'prospecting' | 'qualification' | 'needs-analysis' | 'value-proposition' | 
                      'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
```

### Activity Model

```typescript
interface Activity {
  id: string;
  type: ActivityType;
  subject: string;
  description?: string;
  relatedTo: {
    leadId?: string;
    contactId?: string;
    opportunityId?: string;
    accountId?: string;
  };
  ownerId: string;
  participants: string[]; // User IDs
  startTime: string; // ISO datetime
  endTime?: string; // ISO datetime
  location?: string;
  outcome?: ActivityOutcome;
  createdAt: string;
  updatedAt: string;
}

type ActivityType = 'call' | 'email' | 'meeting' | 'task' | 'event' | 'other';
type ActivityOutcome = 'completed' | 'cancelled' | 'rescheduled' | 'no-show';
```

### Campaign Model

```typescript
interface Campaign {
  id: string;
  name: string;
  description?: string;
  type: CampaignType;
  status: CampaignStatus;
  startDate: string; // ISO date
  endDate?: string; // ISO date
  dailyLimit: number;
  timezone: string;
  templateId?: string;
  recipientListId?: string;
  tracking: {
    openRate: number;
    clickRate: number;
    responseRate: number;
    bounceRate: number;
  };
  createdAt: string;
  updatedAt: string;
}

type CampaignType = 'email' | 'linkedin' | 'multi-channel' | 'direct-mail' | 'telephone';
type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
```

## WebSocket API

Real-time features use WebSocket connections for live updates.

### Connection

```
WebSocket: wss://api.yourdomain.com/ws
```

### Authentication

Upon connection, send authentication message:
```json
{
  "type": "auth",
  "token": "your_jwt_token_here"
}
```

### Message Types

#### Server-to-Client

```json
{
  "type": "notification",
  "data": {
    "id": "notif_123",
    "title": "New Lead Assigned",
    "message": "You have been assigned a new lead",
    "timestamp": "2026-06-23T10:30:00Z",
    "actionUrl": "/crm/leads/lead_123"
  }
}
```

```json
{
  "type": "live-update",
  "data": {
    "entityType": "lead",
    "entityId": "lead_123",
    "changes": {
      "status": { "old": "new", "new": "contacted" }
    },
    "timestamp": "2026-06-23T10:30:00Z",
    "updatedBy": "user_456"
  }
}
```

#### Client-to-Server

```json
{
  "type": "ping",
  "data": {}
}
```

```json
{
  "type": "join-room",
  "data": {
    "roomId": "crm-lead-lead_123"
  }
}
```

```json
{
  "type": "leave-room",
  "data": {
    "roomId": "crm-lead-lead_123"
  }
}
```

### Rooms

Clients can join rooms to receive specific updates:
- `user-{userId}`: User-specific notifications
- `crm-lead-{leadId}`: Lead-specific updates
- `crm-opportunity-{opportunityId}`: Opportunity-specific updates
- `outreach-campaign-{campaignId}`: Campaign performance updates
- `org-{organizationId}`: Organization-wide announcements

## API Versioning

The API uses URL versioning for major changes:

```
/api/v1/...  # Current stable version
/api/v2/...  # Future version (when needed)
```

### Versioning Policy

- **Major versions**: Breaking changes, new URL path
- **Minor versions**: Backward-compatible additions, same URL path
- **Patches**: Bug fixes and internal improvements, no version change

### Deprecation

Deprecated endpoints are maintained for one major version cycle and include:
- `Deprecation` header with sunset date
- Warning in response meta
- Migration guide in documentation

## Development Guidelines

### API Design Principles

1. **Consistency**: Follow established patterns for naming, structure, and behavior
2. **Simplicity**: Make common operations simple and intuitive
3. **Completeness**: Provide all necessary data in responses to avoid extra requests
4. **Discoverability**: Use consistent naming and structure for easy exploration
5. **Evolution**: Design for backward compatibility and clear versioning

### Security Practices

1. **Input Validation**: Validate all inputs on both client and server
2. **Output Encoding**: Properly escape outputs to prevent XSS
3. **Authentication**: Verify tokens for all protected endpoints
4. **Authorization**: Check permissions for resource access
5. **Rate Limiting**: Implement reasonable limits to prevent abuse
6. **HTTPS**: Enforce encryption in transit

### Performance Considerations

1. **Pagination**: Implement pagination for list endpoints
2. **Filtering**: Allow filtering to reduce data transfer
3. **Sorting**: Support sorting on common fields
4. **Field Selection**: Allow clients to request specific fields (future)
5. **Caching**: Use appropriate cache headers
6. **Compression**: Enable response compression

### Documentation Standards

1. **Keep Updated**: Update documentation alongside implementation
2. **Include Examples**: Provide request/response examples
3. **Document Errors**: List possible error responses
4. **Specify Requirements**: Clearly mark required vs optional fields
5. **Use Consistent Terminology**: Maintain consistent naming across docs

### Testing Guidelines

1. **Unit Tests**: Test individual API handlers
2. **Integration Tests**: Test API endpoints with database
3. **Contract Tests**: Validate API schema and responses
4. **Load Tests**: Test performance under expected load
5. **Security Tests**: Test for common vulnerabilities

## Error Response Examples

### Validation Error
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      },
      {
        "field": "probability",
        "message": "Must be between 0 and 100"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-06-23T10:30:00Z",
    "requestId": "req_123456789"
  }
}
```

### Authentication Error
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "AUTHENTICATION_ERROR",
    "message": "Invalid or expired token",
    "details": null
  },
  "meta": {
    "timestamp": "2026-06-23T10:30:00Z",
    "requestId": "req_123456789"
  }
}
```

### Rate Limit Error
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests, please try again later",
    "details": null
  },
  "meta": {
    "timestamp": "2026-06-23T10:30:00Z",
    "requestId": "req_123456789"
  }
}
```

## Versioning

This documentation corresponds to API Documentation v1.0.0
Last updated: June 23, 2026