import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import path from 'path';
import { describe, it, expect, vi } from 'vitest';
import { fetchHello, fetchItems } from './api';

// Mock Supabase to return a dummy session
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: { access_token: 'mock-token' } },
        error: null
      })
    }
  }
}));

const provider = new PactV3({
  consumer: 'FrontendApp',
  provider: 'BackendAPI',
  dir: path.resolve(process.cwd(), 'pacts'),
});

describe('API Pact test', () => {
  it('fetchHello returns a message', async () => {
    provider
      .uponReceiving('a request for hello')
      .withRequest({
        method: 'GET',
        path: '/api/hello',
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          message: MatchersV3.string('Hello from Backend'),
        },
      });

    await provider.executeTest(async (mockServer) => {
      const originalFetch = global.fetch;
      global.fetch = (input: any, init?: any) => {
        if (typeof input === 'string' && input === '/api/hello') {
          return originalFetch(`${mockServer.url}/api/hello`, init);
        }
        return originalFetch(input, init);
      };

      try {
        const response = await fetchHello();
        expect(response.message).toBe('Hello from Backend');
      } finally {
        global.fetch = originalFetch;
      }
    });
  });

  it('fetchItems returns a list of items', async () => {
    provider
      .uponReceiving('a request for items')
      .withRequest({
        method: 'GET',
        path: '/api/items',
        headers: {
          'Authorization': 'Bearer mock-token',
        },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: MatchersV3.eachLike({
          id: MatchersV3.uuid(),
          name: MatchersV3.string('Sample Item'),
          description: MatchersV3.string('Description'),
          user_id: MatchersV3.uuid(),
          created_at: MatchersV3.string('2024-05-05T00:00:00Z'),
          updated_at: MatchersV3.string('2024-05-05T00:00:00Z'),
        }),
      });

    await provider.executeTest(async (mockServer) => {
      const originalFetch = global.fetch;
      global.fetch = (input: any, init?: any) => {
        if (typeof input === 'string' && input === '/api/items') {
          return originalFetch(`${mockServer.url}/api/items`, init);
        }
        return originalFetch(input, init);
      };

      try {
        const response = await fetchItems();
        expect(response.length).toBeGreaterThan(0);
        expect(response[0].name).toBe('Sample Item');
      } finally {
        global.fetch = originalFetch;
      }
    });
  });
});
