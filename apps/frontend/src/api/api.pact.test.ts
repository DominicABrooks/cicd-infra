import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import path from 'path';
import { describe, it, expect } from 'vitest';
import { fetchHello } from './api';

const provider = new PactV3({
  consumer: 'FrontendApp',
  provider: 'BackendAPI',
  dir: path.resolve(process.cwd(), 'pacts'),
});

describe('API Pact test', () => {
  it('fetchHello returns a message', async () => {
    // Arrange
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

    // Act & Assert
    await provider.executeTest(async (mockServer) => {
      // Overwrite the global fetch or use a base URL configuration
      // In this basic example, we will just patch global fetch for this specific call
      const originalFetch = global.fetch;
      global.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
        // Redirect /api/hello to the mock server
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
});
