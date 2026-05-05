# Testing Strategy

Our testing strategy is designed to provide maximum confidence with minimum flakiness. We rely on a testing pyramid that favors fast, isolated tests and utilizes contract testing to prevent heavy E2E reliance.

## 1. Unit Testing (Vitest)

We use **Vitest** for all unit tests across the frontend and backend.

- **Why Vitest?** It is a drop-in replacement for Jest but natively understands ES Modules and Vite configurations. It is significantly faster than Jest, especially in a monorepo setting.
- **Where:** Co-located next to the source files (e.g., `App.test.tsx` next to `App.tsx`).

## 2. Contract Testing (Pact)

We use **Pact** to ensure the frontend and backend are speaking the same API language. 

- **Why Pact?** Rather than spinning up the entire backend and database to test a frontend component (which is slow and flaky), Pact allows the frontend to define a "Contract" (Consumer). The backend then runs a test to "Prove" it satisfies that contract (Provider).
- **Workflow:** 
  1. Frontend runs tests and generates a `pacts/` JSON file.
  2. Backend tests spin up the API and verify their responses match the JSON file.
- **Benefit:** It fails builds *before* an incompatible API reaches production, entirely without relying on heavy E2E mocks.

## 3. End-to-End Testing (Playwright)

We use **Playwright** for browser automation and critical user journey testing.

- **Why Playwright?** Chosen over Cypress because it runs natively in WebKit/Firefox/Chrome, handles multiple tabs, and manages async network calls much more reliably.
- **Where it runs:** In CI, Playwright runs against the *actual Docker container* we built, not a static local dev server. This guarantees we are testing the exact artifact that will go to production.

## 4. Security Scanning (OWASP ZAP)

We use **OWASP ZAP (Zed Attack Proxy)** as our baseline security scanner.

- **Why ZAP?** It automatically detects common vulnerabilities (XSS, SQL injection, missing security headers).
- **Where it runs:** Like Playwright, ZAP runs in CI against the live Docker container, simulating a real-world attack before the image is approved for deployment.
