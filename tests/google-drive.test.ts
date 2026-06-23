import { exportProposalToDrive } from '../src/lib/google-drive';

// Mock the googleapis module
jest.mock('googleapis', () => ({
  google: {
    auth: {
      OAuth2: jest.fn().mockImplementation(() => ({
        setCredentials: jest.fn(),
        on: jest.fn(),
      })),
    },
    drive: jest.fn().mockReturnValue({
      files: {
        list: jest.fn().mockResolvedValue({
          data: {
            files: [{ id: 'mock_folder_id', name: 'Sales Proposals' }]
          }
        }),
        create: jest.fn().mockResolvedValue({
          data: {
            id: 'mock_file_id',
            webViewLink: 'https://docs.google.com/document/d/mock_file_id/edit',
            webContentLink: 'https://docs.google.com/uc?id=mock_file_id&export=download'
          }
        })
      },
      permissions: {
        create: jest.fn().mockResolvedValue({ data: {} })
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

describe('Google Drive Integration', () => {
  it('should export a proposal and return a shareable link', async () => {
    const result = await exportProposalToDrive(
      'mock_user_id', 
      'Test Proposal', 
      '# Test Content'
    );
    
    expect(result).toBeDefined();
    expect(result.fileId).toBe('mock_file_id');
    expect(result.webViewLink).toContain('docs.google.com/document');
  });
});
