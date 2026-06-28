# Invitation System

A comprehensive invitation system for the B2B SaaS platform with full RBAC integration and email notifications.

## Features

- ✅ Send invitations to new team members
- ✅ Secure token-based invitation links
- ✅ Support for both new and existing users
- ✅ Email notifications with HTML templates
- ✅ Invitation management (resend, revoke, delete)
- ✅ Role-based access control integration
- ✅ Plan limit validation
- ✅ Activity logging and notifications
- ✅ Responsive UI components
- ✅ Status tracking (pending, accepted, expired, revoked, declined)

## Components

### 1. InvitationBadge
Status badge component with color coding.

```tsx
import { InvitationBadge } from '@/components/invitations';

<InvitationBadge status="pending" />
```

### 2. InviteMemberDialog
Modal for inviting new members.

```tsx
import { InviteMemberDialog } from '@/components/invitations';

<InviteMemberDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSuccess={() => {
    // Refresh invitation list
  }}
  organizationId="org_123"
  workspaceIds={['ws_456']}
/>
```

### 3. InvitationList
Table displaying all invitations with actions.

```tsx
import { InvitationList } from '@/components/invitations';

<InvitationList
  organizationId="org_123"
  onInvite={() => setShowDialog(true)}
/>
```

### 4. AcceptInvitationPage
Public page for accepting invitations.

```tsx
// src/app/accept-invitation/page.tsx
import { AcceptInvitationPage } from '@/components/invitations';

export default function AcceptInvitation() {
  return <AcceptInvitationPage />;
}
```

## API Endpoints

### Create Invitation
```
POST /api/invitations
Authorization: Bearer <token>

{
  "email": "user@example.com",
  "role": "Sales Rep",
  "workspaceIds": ["ws_123"],
  "workspaceRole": "Member",
  "message": "Welcome to the team!"
}
```

### List Invitations
```
GET /api/invitations?status=pending&page=1&pageSize=20
Authorization: Bearer <token>
```

### Get Invitation
```
GET /api/invitations/:id
Authorization: Bearer <token>
```

### Update Invitation (Resend/Revoke)
```
PATCH /api/invitations/:id
Authorization: Bearer <token>

{
  "action": "resend" | "revoke"
}
```

### Delete Invitation
```
DELETE /api/invitations/:id
Authorization: Bearer <token>
```

### Accept Invitation (Public)
```
POST /api/invitations/accept

// For new users:
{
  "token": "abc123...",
  "name": "John Doe",
  "password": "securepass123"
}

// For existing users:
{
  "token": "abc123...",
  "userId": "user_123"
}
```

### Decline Invitation (Public)
```
POST /api/invitations/decline

{
  "token": "abc123..."
}
```

### Validate Invitation (Public)
```
GET /api/invitations/validate?token=abc123...
```

## React Hooks

### useInvitations
Fetch and manage invitations list.

```tsx
import { useInvitations } from '@/hooks/useInvitations';

const {
  invitations,
  loading,
  error,
  total,
  page,
  refresh,
  nextPage,
  previousPage,
  filterByStatus,
} = useInvitations('org_123');
```

### useSendInvitation
Send new invitations.

```tsx
import { useSendInvitation } from '@/hooks/useInvitations';

const { sendInvitation, loading, error } = useSendInvitation();

const result = await sendInvitation({
  email: 'user@example.com',
  role: 'Sales Rep',
  workspaceIds: ['ws_123'],
  message: 'Welcome!',
});
```

### useResendInvitation
Resend pending invitations.

```tsx
import { useResendInvitation } from '@/hooks/useInvitations';

const { resendInvitation, loading } = useResendInvitation();

await resendInvitation('inv_123');
```

### useRevokeInvitation
Revoke pending invitations.

```tsx
import { useRevokeInvitation } from '@/hooks/useInvitations';

const { revokeInvitation, loading } = useRevokeInvitation();

await revokeInvitation('inv_123');
```

### useDeleteInvitation
Delete invitations.

```tsx
import { useDeleteInvitation } from '@/hooks/useInvitations';

const { deleteInvitation, loading } = useDeleteInvitation();

await deleteInvitation('inv_123');
```

## Email Service

The email service supports both development and production modes:

### Development Mode
- Logs email details to console
- No actual emails sent
- Useful for testing

### Production Mode
- Integrates with email providers (SendGrid, Resend, AWS SES)
- Templates included for:
  - Invitation emails
  - Reminder emails
  - Acceptance notifications

To integrate with an email provider, update `src/lib/email-service.ts` with your provider's API.

## Security

- ✅ Secure token generation using crypto.randomBytes()
- ✅ Token expiration (default 7 days)
- ✅ Email validation
- ✅ Permission checks
- ✅ Plan limit validation
- ✅ Organization access control
- ✅ Rate limiting support

## Database Schema

Invitations are stored in Firestore with the following structure:

```typescript
{
  id: string;
  organizationId: string;
  workspaceIds?: string[];
  email: string;
  role: Role;
  workspaceRole?: WorkspaceRole;
  invitedBy: string;
  invitedByName: string;
  token: string;
  status: 'pending' | 'accepted' | 'expired' | 'revoked' | 'declined';
  message?: string;
  expiresAt: string;
  acceptedAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Firestore Indexes

Required indexes are defined in `src/lib/firestore-schema.ts`:

```javascript
{
  collectionGroup: 'invitations',
  queryScope: 'COLLECTION',
  fields: [
    { fieldPath: 'organizationId', order: 'ASCENDING' },
    { fieldPath: 'status', order: 'ASCENDING' },
    { fieldPath: 'createdAt', order: 'DESCENDING' },
  ],
}
```

Make sure to add these to your `firestore.indexes.json` file.

## Usage Example

Complete example of integrating the invitation system:

```tsx
'use client';

import { useState } from 'react';
import { InviteMemberDialog, InvitationList } from '@/components/invitations';
import { useOrganization } from '@/hooks/useOrganization';

export default function TeamPage() {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const { organization } = useOrganization();

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Team Management</h1>

      <InvitationList
        organizationId={organization?.id}
        onInvite={() => setShowInviteDialog(true)}
      />

      <InviteMemberDialog
        isOpen={showInviteDialog}
        onClose={() => setShowInviteDialog(false)}
        onSuccess={() => {
          // Optionally show success toast
          console.log('Invitation sent!');
        }}
        organizationId={organization?.id}
      />
    </div>
  );
}
```

## Future Enhancements

- [ ] Bulk invitation sending
- [ ] Custom invitation templates
- [ ] Invitation expiration reminders
- [ ] SSO integration
- [ ] Multi-language support
- [ ] Invitation analytics
- [ ] Custom expiration periods
- [ ] Invitation history and audit logs
