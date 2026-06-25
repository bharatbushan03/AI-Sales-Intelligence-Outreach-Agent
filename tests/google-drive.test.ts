import { exportProposalToDrive } from '../src/lib/google-drive';
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
    drive: vi.fn().mockReturnValue({
      files: {
        list: vi.fn().mockResolvedValue({
          data: {
            files: [{ id: 'mock_folder_id', name: 'Sales Proposals' }]
          }
        }),
        create: vi.fn().mockResolvedValue({
          data: {
            id: 'mock_file_id',
            webViewLink: 'https://docs.google.com/document/d/mock_file_id/edit',
            webContentLink: 'https://docs.google.com/uc?id=mock_file_id&export=download'
          }
        })
      },
      permissions: {
        create: vi.fn().mockResolvedValue({ data: {} })
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
