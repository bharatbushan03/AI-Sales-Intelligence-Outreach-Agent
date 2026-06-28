import { logger } from '@/utils/logger';
import { Invitation } from '@/types/auth';

const DEV_MODE = process.env.NODE_ENV === 'development';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@yoursaas.com';

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

/**
 * Generate HTML email template for invitation
 */
function generateInvitationEmailTemplate(params: {
  inviterName: string;
  organizationName: string;
  workspaceName?: string;
  role: string;
  message?: string;
  acceptUrl: string;
}): EmailTemplate {
  const { inviterName, organizationName, workspaceName, role, message, acceptUrl } = params;

  const subject = `${inviterName} invited you to join ${organizationName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Team Invitation</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f5; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; }
    .content { padding: 40px 30px; }
    .content h2 { color: #1f2937; font-size: 20px; margin: 0 0 20px 0; }
    .content p { color: #4b5563; margin: 0 0 15px 0; }
    .invitation-details { background: #f9fafb; border-left: 4px solid #6366f1; padding: 20px; margin: 25px 0; border-radius: 4px; }
    .invitation-details p { margin: 8px 0; }
    .invitation-details strong { color: #1f2937; }
    .message-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .message-box p { color: #92400e; margin: 0; font-style: italic; }
    .cta-button { display: inline-block; background: #6366f1; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; margin: 25px 0; transition: background 0.2s; }
    .cta-button:hover { background: #4f46e5; }
    .footer { background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
    .footer p { color: #6b7280; font-size: 14px; margin: 5px 0; }
    .footer a { color: #6366f1; text-decoration: none; }
    .expiry-notice { color: #dc2626; font-size: 14px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 You've Been Invited!</h1>
    </div>
    <div class="content">
      <h2>Join ${organizationName}</h2>
      <p>Hi there!</p>
      <p><strong>${inviterName}</strong> has invited you to join their team on <strong>${organizationName}</strong>.</p>
      
      <div class="invitation-details">
        <p><strong>Organization:</strong> ${organizationName}</p>
        ${workspaceName ? `<p><strong>Workspace:</strong> ${workspaceName}</p>` : ''}
        <p><strong>Role:</strong> ${role}</p>
      </div>
      
      ${message ? `<div class="message-box"><p>"${message}"</p></div>` : ''}
      
      <p>Click the button below to accept the invitation and get started:</p>
      
      <div style="text-align: center;">
        <a href="${acceptUrl}" class="cta-button">Accept Invitation</a>
      </div>
      
      <p class="expiry-notice">⚠️ This invitation expires in 7 days.</p>
      
      <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
        If you're not sure why you received this email, you can safely ignore it.
      </p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} ${organizationName}. All rights reserved.</p>
      <p>This is an automated email. Please do not reply to this message.</p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
${inviterName} invited you to join ${organizationName}

Organization: ${organizationName}
${workspaceName ? `Workspace: ${workspaceName}` : ''}
Role: ${role}

${message ? `Message from ${inviterName}: "${message}"` : ''}

Accept your invitation by visiting this link:
${acceptUrl}

This invitation expires in 7 days.

If you're not sure why you received this email, you can safely ignore it.
  `.trim();

  return { subject, html, text };
}

/**
 * Send invitation email to a new team member
 */
export async function sendInvitationEmail(params: {
  email: string;
  invitation: Invitation;
  inviterName: string;
  organizationName: string;
  workspaceName?: string;
  message?: string;
}): Promise<void> {
  const { email, invitation, inviterName, organizationName, workspaceName, message } = params;

  const acceptUrl = `${APP_URL}/accept-invitation?token=${invitation.token}`;

  const emailTemplate = generateInvitationEmailTemplate({
    inviterName,
    organizationName,
    workspaceName,
    role: invitation.role,
    message,
    acceptUrl,
  });

  if (DEV_MODE) {
    // Development mode: Log email details
    logger.info(`[Email Service Mock] Sending invitation email`, {
      to: email,
      from: FROM_EMAIL,
      subject: emailTemplate.subject,
      acceptUrl,
      organization: organizationName,
      inviter: inviterName,
    });

    // In dev, we could also write to a file or use a service like Mailtrap
    // TODO: Consider using Mailtrap for development testing
  } else {
    // Production mode: Send real email
    // TODO: Integrate with SendGrid, Resend, AWS SES, or Postmark
    logger.warn('[Email Service] Production email service not configured', {
      to: email,
      subject: emailTemplate.subject,
    });

    // Example SendGrid integration (commented out):
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    await sgMail.send({
      to: email,
      from: FROM_EMAIL,
      subject: emailTemplate.subject,
      text: emailTemplate.text,
      html: emailTemplate.html,
    });
    */

    // Example Resend integration (commented out):
    /*
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });
    */
  }

  return Promise.resolve();
}

/**
 * Send reminder email for pending invitation
 */
export async function sendInvitationReminderEmail(params: {
  email: string;
  invitation: Invitation;
  inviterName: string;
  organizationName: string;
  workspaceName?: string;
}): Promise<void> {
  const { email, invitation, inviterName, organizationName, workspaceName } = params;

  const acceptUrl = `${APP_URL}/accept-invitation?token=${invitation.token}`;
  const daysLeft = Math.ceil(
    (new Date(invitation.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  const subject = `Reminder: Join ${organizationName}`;

  logger.info(`[Email Service Mock] Sending invitation reminder`, {
    to: email,
    from: FROM_EMAIL,
    subject,
    acceptUrl,
    daysLeft,
  });

  // TODO: Implement HTML template for reminder email similar to invitation email

  return Promise.resolve();
}

/**
 * Notify inviter that invitation was accepted
 */
export async function sendInvitationAcceptedNotification(params: {
  inviterEmail: string;
  inviterName: string;
  acceptedUserName: string;
  acceptedUserEmail: string;
  organizationName: string;
}): Promise<void> {
  const { inviterEmail, inviterName, acceptedUserName, acceptedUserEmail, organizationName } =
    params;

  const subject = `${acceptedUserName} accepted your invitation`;

  logger.info(`[Email Service Mock] Sending invitation accepted notification`, {
    to: inviterEmail,
    from: FROM_EMAIL,
    subject,
    acceptedUser: acceptedUserEmail,
  });

  // TODO: Implement HTML template for acceptance notification

  return Promise.resolve();
}
