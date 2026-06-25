import { google } from 'googleapis';
import { adminDb } from './firebase-admin';

// Initialize OAuth2 client
export const getOAuthClient = () => {
  // Use environment variables for OAuth credentials
  // Ensure these are set in .env.local
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID || 'mock_client_id',
    process.env.GOOGLE_CLIENT_SECRET || 'mock_client_secret',
    process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`
      : 'http://localhost:3000/api/auth/callback/google',
  );
};

/**
 * Retrieves the authenticated Google Calendar client for a specific user.
 * It fetches the user's OAuth tokens from Firestore.
 */
export async function getCalendarClientForUser(userId: string) {
  const userDoc = await adminDb.collection('users').doc(userId).get();

  if (!userDoc.exists) {
    throw new Error('User not found');
  }

  const userData = userDoc.data();
  const tokens = userData?.googleOAuthToken;

  if (!tokens || !tokens.access_token) {
    throw new Error('User has not connected their Google account or tokens are missing.');
  }

  const oauth2Client = getOAuthClient();
  oauth2Client.setCredentials({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expiry_date: tokens.expiry_date,
    token_type: tokens.token_type || 'Bearer',
  });

  // Automatically refresh the token if needed
  oauth2Client.on('tokens', async (newTokens) => {
    if (newTokens.refresh_token) {
      await adminDb.collection('users').doc(userId).update({
        'googleOAuthToken.refresh_token': newTokens.refresh_token,
        'googleOAuthToken.access_token': newTokens.access_token,
        'googleOAuthToken.expiry_date': newTokens.expiry_date,
      });
    } else {
      await adminDb.collection('users').doc(userId).update({
        'googleOAuthToken.access_token': newTokens.access_token,
        'googleOAuthToken.expiry_date': newTokens.expiry_date,
      });
    }
  });

  return google.calendar({ version: 'v3', auth: oauth2Client });
}

/**
 * Fetches upcoming meetings for the user (from now to 7 days ahead)
 * Filters out internal meetings (where all attendees have the same domain as the user).
 */
export async function fetchUpcomingSalesMeetings(userId: string, userDomain: string) {
  try {
    const calendar = await getCalendarClientForUser(userId);

    const timeMin = new Date().toISOString();
    const timeMax = new Date();
    timeMax.setDate(timeMax.getDate() + 7); // Look 7 days ahead

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin,
      timeMax: timeMax.toISOString(),
      maxResults: 50,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];

    // Filter for events with external attendees (prospects)
    const salesMeetings = events.filter((event) => {
      // Must have attendees
      if (!event.attendees || event.attendees.length === 0) return false;

      // Look for external domains
      const hasExternalAttendee = event.attendees.some((att) => {
        if (!att.email) return false;
        const domain = att.email.split('@')[1];
        // If domain is different from user's domain and not a generic email (simplified check)
        return domain !== userDomain && !['gmail.com', 'yahoo.com', 'hotmail.com'].includes(domain);
      });

      return hasExternalAttendee;
    });

    return salesMeetings;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
}

/**
 * Updates a calendar event description with an AI-generated meeting brief.
 */
export async function updateEventWithMeetingBrief(
  userId: string,
  eventId: string,
  briefContent: string,
) {
  try {
    const calendar = await getCalendarClientForUser(userId);

    // First fetch the event to get its current state and avoid overwriting other details
    const event = await calendar.events.get({
      calendarId: 'primary',
      eventId: eventId,
    });

    const existingDescription = event.data.description || '';

    // Check if we've already added a brief to avoid appending multiple times
    if (existingDescription.includes('--- AI SALES BRIEF ---')) {
      return event.data;
    }

    const newDescription = `${existingDescription}\n\n<br><br>--- AI SALES BRIEF ---\n${briefContent.replace(/\\n/g, '<br>')}`;

    const response = await calendar.events.patch({
      calendarId: 'primary',
      eventId: eventId,
      requestBody: {
        description: newDescription,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating event description:', error);
    throw error;
  }
}

/**
 * Sets up a push notification webhook for the user's primary calendar.
 * This tells Google to POST to our webhook whenever an event changes.
 */
export async function setupCalendarWebhook(userId: string, webhookUrl: string) {
  try {
    const calendar = await getCalendarClientForUser(userId);

    // Generate a unique channel ID
    const channelId = `sync-channel-${userId}-${Date.now()}`;

    const response = await calendar.events.watch({
      calendarId: 'primary',
      requestBody: {
        id: channelId,
        type: 'web_hook',
        address: webhookUrl,
        // Set an expiration (e.g., 1 week from now) - max is usually weeks
        expiration: (Date.now() + 7 * 24 * 60 * 60 * 1000).toString(),
      },
    });

    return {
      channelId: response.data.id,
      resourceId: response.data.resourceId,
      expiration: response.data.expiration,
    };
  } catch (error) {
    console.error('Error setting up calendar webhook:', error);
    throw error;
  }
}
