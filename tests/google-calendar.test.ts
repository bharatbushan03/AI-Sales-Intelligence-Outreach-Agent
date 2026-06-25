import { fetchUpcomingSalesMeetings } from '../src/lib/google-calendar';
import { describe, expect, it, vi } from 'vitest';

// Mock the googleapis module
vi.mock('googleapis', () => ({
  google: {
    auth: {
      OAuth2: vi.fn().mockImplementation(function OAuth2() {
        return {
        setCredentials: vi.fn(),
        on: vi.fn(),
        };
      }),
    },
    calendar: vi.fn().mockReturnValue({
      events: {
        list: vi.fn().mockResolvedValue({
          data: {
            items: [
              {
                id: 'evt_1',
                summary: 'Sales Sync: Acme Corp',
                attendees: [
                  { email: 'user@mycompany.com' },
                  { email: 'buyer@acmecorp.com' }
                ]
              },
              {
                id: 'evt_2',
                summary: 'Internal Team Meeting',
                attendees: [
                  { email: 'user@mycompany.com' },
                  { email: 'colleague@mycompany.com' }
                ]
              }
            ]
          }
        }),
        patch: vi.fn().mockResolvedValue({ data: {} }),
        get: vi.fn().mockResolvedValue({ data: { description: '' } })
      }
    })
  }
}));

// Mock firebase-admin
vi.mock('../src/lib/firebase-admin', () => ({
  adminDb: {
    collection: vi.fn().mockReturnThis(),
    doc: vi.fn().mockReturnThis(),
    get: vi.fn().mockResolvedValue({
      exists: true,
      data: () => ({
        googleOAuthToken: {
          access_token: 'mock_token',
          refresh_token: 'mock_refresh',
          expiry_date: Date.now() + 3600000,
        }
      })
    }),
    update: vi.fn().mockResolvedValue({})
  }
}));

describe('Google Calendar Integration', () => {
  it('should fetch and filter external sales meetings', async () => {
    const meetings = await fetchUpcomingSalesMeetings('mock_user_id', 'mycompany.com');
    
    // Should filter out the internal meeting (evt_2)
    expect(meetings).toHaveLength(1);
    expect(meetings[0].id).toBe('evt_1');
    expect(meetings[0].attendees).toEqual([
      { email: 'user@mycompany.com' },
      { email: 'buyer@acmecorp.com' }
    ]);
  });
});
