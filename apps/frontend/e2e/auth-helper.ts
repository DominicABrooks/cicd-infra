import { Page } from '@playwright/test';

/**
 * Mocks the Supabase Auth API calls to bypass real authentication in E2E tests.
 */
export async function mockSupabaseAuth(page: Page) {
  const mockSession = {
    access_token: 'mock-token',
    token_type: 'bearer',
    expires_in: 3600,
    refresh_token: 'mock-refresh',
    user: {
      id: '00000000-0000-0000-0000-000000000000',
      email: 'test@example.com',
      role: 'authenticated',
      aud: 'authenticated',
      app_metadata: { provider: 'email' },
      user_metadata: {},
      created_at: new Date().toISOString(),
    },
    expires_at: Math.floor(Date.now() / 1000) + 3600,
  };

  // 1. Inject into LocalStorage BEFORE any scripts run
  await page.addInitScript((session) => {
    // Try multiple possible keys used by different Supabase versions
    window.localStorage.setItem('supabase.auth.token', JSON.stringify(session));
    window.localStorage.setItem('sb-example-auth-token', JSON.stringify(session));
    window.localStorage.setItem('sb-qqavfbkfnolehfdorxte-auth-token', JSON.stringify(session));
  }, mockSession);

  // 2. Mock all potential Auth API endpoints
  
  // Session / Token endpoint
  await page.route('**/auth/v1/session**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: { session: mockSession }, error: null }),
    });
  });

  // User endpoint
  await page.route('**/auth/v1/user**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockSession.user),
    });
  });

  // Handle any other auth calls (recover, etc.)
  await page.route('**/auth/v1/**', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { session: mockSession }, error: null }),
      });
    } else {
      await route.continue();
    }
  });
}
