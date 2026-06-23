import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../lib/firebase-admin';
import { fetchUpcomingSalesMeetings, updateEventWithMeetingBrief } from '../../../../lib/google-calendar';
import { ManagerAgent } from '../../../../agents/manager-agent';
import { verifyAuth } from '../../../../lib/auth-middleware';

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.uid;
    const body = await req.json().catch(() => ({}));
    const userDomain = body.userDomain || 'example.com';

    // 1. Fetch upcoming meetings
    const meetings = await fetchUpcomingSalesMeetings(userId, userDomain);

    if (!meetings || meetings.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No upcoming external sales meetings found.',
        meetingsCount: 0 
      });
    }

    const manager = new ManagerAgent();
    let briefsGenerated = 0;

    // 2. Process each meeting
    for (const meeting of meetings) {
      // Find the external attendee's domain to use for research
      const externalAttendees = meeting.attendees?.filter(a => {
        if (!a.email) return false;
        const domain = a.email.split('@')[1];
        return domain !== userDomain && !['gmail.com', 'yahoo.com', 'hotmail.com'].includes(domain);
      });

      if (!externalAttendees || externalAttendees.length === 0) continue;

      const targetDomain = externalAttendees[0].email!.split('@')[1];

      // Check if we've already added a brief
      if (meeting.description && meeting.description.includes('--- AI SALES BRIEF ---')) {
        continue; // Skip already briefed meetings
      }

      // 3. Trigger a background research workflow for the target company
      // In a full implementation, we'd wait for this to finish or use cached results
      // For MVP, we will invoke the workflow and use the resulting Research and CRM context.
      const workflowResult = await manager.executeWorkflow({
        userId: userId,
        organizationId: 'default',
        workspaceId: 'default',
        goal: `Research company ${targetDomain} and generate a meeting brief for the upcoming call.`,
      });

      // 4. Extract the synthesized brief from the CRM agent's output or generate a new text block
      const researchData = workflowResult.sharedMemory?.research;
      const opportunityData = workflowResult.sharedMemory?.opportunityAnalysis;

      const briefContent = `
**Company**: ${researchData?.company?.name || targetDomain}
**Summary**: ${researchData?.company?.description || 'No description found.'}
**Industry**: ${researchData?.company?.industry || 'Unknown'}

**Pain Points Identified**:
${(opportunityData?.analysis?.painPoints || ['No specific pain points identified.']).map((p: string) => `- ${p}`).join('\n')}

**Value Propositions**:
${(opportunityData?.analysis?.valuePropositions || ['No value propositions identified.']).map((v: string) => `- ${v}`).join('\n')}

**Suggested Icebreakers**:
- "I noticed your recent news about..."
- "How are you handling [Pain Point] currently?"
      `;

      // 5. Update the Calendar Event
      if (meeting.id) {
        await updateEventWithMeetingBrief(userId, meeting.id, briefContent);
        briefsGenerated++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully synchronized calendar and generated ${briefsGenerated} meeting briefs.`,
      meetingsProcessed: meetings.length,
      briefsGenerated
    });

  } catch (error: any) {
    console.error('Calendar sync error:', error);
    return NextResponse.json({ error: error.message || 'Failed to sync calendar' }, { status: 500 });
  }
}
