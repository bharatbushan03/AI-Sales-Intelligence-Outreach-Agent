/**
 * Accept Invitation Page Route
 * Public page for accepting team invitations
 */

import { AcceptInvitationPage } from '@/components/invitations/AcceptInvitationPage';
import { Suspense } from 'react';

export default function AcceptInvitation() {
  return (
    <Suspense fallback={<div>Loading invitation...</div>}>
      <AcceptInvitationPage />
    </Suspense>
  );
}
