import { google } from 'googleapis';
import { adminDb } from './firebase-admin';
import { getOAuthClient } from './google-calendar';

/**
 * Retrieves the authenticated Google Drive client for a specific user.
 * It fetches the user's OAuth tokens from Firestore.
 */
export async function getDriveClientForUser(userId: string) {
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

  return google.drive({ version: 'v3', auth: oauth2Client });
}

/**
 * Ensures a specific folder exists in the user's Google Drive.
 * If it doesn't exist, it creates it. Returns the Folder ID.
 */
async function ensureFolderExists(drive: any, folderName: string): Promise<string> {
  const response = await drive.files.list({
    q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`,
    fields: 'files(id, name)',
    spaces: 'drive',
  });

  if (response.data.files && response.data.files.length > 0) {
    return response.data.files[0].id;
  }

  const fileMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };

  const folder = await drive.files.create({
    requestBody: fileMetadata,
    fields: 'id',
  });

  return folder.data.id;
}

/**
 * Uploads proposal content to Google Drive as a Google Doc and creates a shareable link.
 */
export async function exportProposalToDrive(userId: string, title: string, markdownContent: string) {
  try {
    const drive = await getDriveClientForUser(userId);
    
    // Ensure "Sales Proposals" folder exists
    const folderId = await ensureFolderExists(drive, 'Sales Proposals');

    // Create a new file metadata
    const fileMetadata = {
      name: title,
      parents: [folderId],
      mimeType: 'application/vnd.google-apps.document', // Convert to Google Doc format
    };

    // Prepare content upload
    const media = {
      mimeType: 'text/markdown',
      body: markdownContent,
    };

    // Upload and convert file
    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink, webContentLink',
    });

    const fileId = file.data.id;

    if (!fileId) {
      throw new Error('Failed to retrieve file ID from Google Drive response');
    }

    // Set permissions to "Anyone with the link can view"
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    return {
      fileId: fileId,
      webViewLink: file.data.webViewLink,
      webContentLink: file.data.webContentLink,
    };
  } catch (error) {
    console.error('Error exporting proposal to Drive:', error);
    throw error;
  }
}
