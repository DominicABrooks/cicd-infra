import { Verifier } from '@pact-foundation/pact';
import path from 'path';
import { describe, it, beforeAll, afterAll } from 'vitest';
import { server } from './index.js';

describe('Pact Verification', () => {
  const port = 8081;

  beforeAll(async () => {
    return new Promise<void>((resolve) => {
      server.listen(port, () => {
        console.log(`Test server running on port ${port}`);
        // Wait a moment for server to be ready
        setTimeout(resolve, 100);
      });
    });
  });

  afterAll(async () => {
    return new Promise<void>((resolve) => {
      server.close(() => resolve());
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
