import { NextRequest, NextResponse } from 'next/server';
import { exportProposalToDrive } from '../../../../lib/google-drive';
import { withAuth } from '../../../../lib/auth-middleware';
import { adminDb } from '../../../../lib/firebase-admin';

export const POST = withAuth(async (req: NextRequest, context: any) => {
  try {
    const user = context.user;
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.uid;
    const body = await req.json().catch(() => ({}));
    
    // Accept either a direct markdown content string or a proposalId
    let markdownContent = body.content;
    let title = body.title || `Sales Proposal - ${new Date().toISOString().split('T')[0]}`;

    if (!markdownContent && body.proposalId) {
      // Fetch from Firestore if proposalId is provided
      const proposalDoc = await adminDb.collection('proposals').doc(body.proposalId).get();
      if (!proposalDoc.exists) {
        return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
      }
      
      const proposalData = proposalDoc.data();
      // Assume the proposal document has a markdown field or an executive summary
      markdownContent = proposalData?.markdown || JSON.stringify(proposalData?.document || {}, null, 2);
      title = proposalData?.title || title;
    }

    if (!markdownContent) {
      return NextResponse.json({ error: 'Proposal content is required' }, { status: 400 });
    }

    // Export to Google Drive
    const result = await exportProposalToDrive(userId, title, markdownContent);

    // Optionally update the proposal document in Firestore with the Drive Link
    if (body.proposalId) {
      await adminDb.collection('proposals').doc(body.proposalId).update({
        driveUrl: result.webViewLink,
        driveFileId: result.fileId,
        updatedAt: new Date().toISOString()
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Proposal exported to Google Drive successfully',
      driveLink: result.webViewLink
    });

  } catch (error: any) {
    console.error('Proposal export error:', error);
    return NextResponse.json({ error: error.message || 'Failed to export proposal' }, { status: 500 });
  }
});
