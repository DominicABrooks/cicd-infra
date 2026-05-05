import { Verifier } from '@pact-foundation/pact';
import path from 'path';
import { describe, it, beforeAll, afterAll, vi } from 'vitest';
import http from 'http';

// Mock Supabase and DB before importing app
vi.mock('./config/supabase.js', () => ({
  supabaseAdmin: {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'mock-user-id', email: 'test@example.com' } },
        error: null
      })
    }
  },
  default: {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'mock-user-id', email: 'test@example.com' } },
        error: null
      })
    }
  }
}));

vi.mock('./config/db.js', () => ({
  default: {
    query: vi.fn().mockResolvedValue({
      rows: [{
        id: '00000000-0000-0000-0000-000000000000',
        name: 'Sample Item',
        description: 'Description',
        user_id: '00000000-0000-0000-0000-000000000000',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]
    })
  }
}));

// Now import app
import { app } from './index.js';

describe('Pact Verification', () => {
  const port = 8081;
  let server: http.Server;

  beforeAll(async () => {
    return new Promise<void>((resolve) => {
      server = app.listen(port, () => {
        console.log(`Test server running on port ${port}`);
        resolve();
      });
    });
  });

  afterAll(async () => {
    return new Promise<void>((resolve) => {
      if (server) {
        server.close(() => resolve());
      } else {
        resolve();
      }
    });
  });

  it('validates the expectations of FrontendApp', async () => {
    const opts = {
      provider: 'BackendAPI',
      providerBaseUrl: `http://localhost:${port}`,
      pactUrls: [
        path.resolve(process.cwd(), '../frontend/pacts/FrontendApp-BackendAPI.json'),
      ],
    };

    const verifier = new Verifier(opts);
    await verifier.verifyProvider();
  });
});
