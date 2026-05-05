import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    }
  }
}))

describe('App', () => {
  it('renders the welcome screen when unauthenticated', async () => {
    render(<App />)
    const heading = await screen.findByRole('heading', { level: 1 })
    expect(heading.textContent).toBe('Welcome back')
  })
})