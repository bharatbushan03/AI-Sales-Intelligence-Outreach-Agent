import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../lib/firebase-admin';

/**
 * Google Calendar Push Notifications Webhook
 * Receives POST requests from Google when a subscribed calendar changes.
 */
export async function POST(req: NextRequest) {
  try {
    const channelId = req.headers.get('x-goog-channel-id');
    const resourceId = req.headers.get('x-goog-resource-id');
    const resourceState = req.headers.get('x-goog-resource-state');
    const channelToken = req.headers.get('x-goog-channel-token');

    if (!channelId || !resourceId) {
      return NextResponse.json({ error: 'Missing required headers' }, { status: 400 });
    }

    console.log(`Received calendar webhook: Channel ${channelId}, State ${resourceState}`);

    // Parse the channelId to get the userId (e.g. sync-channel-USERID-TIMESTAMP)
    const parts = channelId.split('-');
    if (parts.length >= 3 && parts[0] === 'sync' && parts[1] === 'channel') {
      const userId = parts[2];

      // In a real implementation, we would queue a background task here
      // instead of processing it synchronously, to avoid timeouts and Google retries.
      // E.g. publish to Cloud Pub/Sub or Cloud Tasks.

      // We can record the event for asynchronous processing by a Cloud Function:
      await adminDb.collection('webhookEvents').add({
        type: 'calendar_sync',
        userId: userId,
        channelId: channelId,
        resourceId: resourceId,
        resourceState: resourceState,
        timestamp: new Date().toISOString(),
        processed: false,
      });
    }

    // Google requires a 200 OK or 201 Created or 202 Accepted response.
    // Otherwise it will retry exponentially.
    return NextResponse.json({ success: true, message: 'Webhook received' }, { status: 202 });
  } catch (error: any) {
    console.error('Calendar webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process webhook' },
      { status: 500 },
    );
  }
}
