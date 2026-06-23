import { fetchUpcomingSalesMeetings } from '../src/lib/google-calendar';
import { adminDb } from '../src/lib/firebase-admin';

// Mock the googleapis module
jest.mock('googleapis', () => ({
  google: {
    auth: {
      OAuth2: jest.fn().mockImplementation(() => ({
        setCredentials: jest.fn(),
        on: jest.fn(),
      })),
    },
    calendar: jest.fn().mockReturnValue({
      events: {
        list: jest.fn().mockResolvedValue({
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
        patch: jest.fn().mockResolvedValue({ data: {} }),
        get: jest.fn().mockResolvedValue({ data: { description: '' } })
      }
    })
  }
}));

// Mock firebase-admin
jest.mock('../src/lib/firebase-admin', () => ({
  adminDb: {
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    get: jest.fn().mockResolvedValue({
      exists: true,
      data: () => ({
        googleOAuthToken: {
          access_token: 'mock_token',
          refresh_token: 'mock_refresh',
          expiry_date: Date.now() + 3600000,
        }
      })
    }),
    update: jest.fn().mockResolvedValue({})
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
