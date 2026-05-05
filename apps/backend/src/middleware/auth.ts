import { Request, Response, NextFunction } from 'express';
import supabaseAdmin from '../config/supabase.js';

// Extend Express Request to include the authenticated user
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

/**
 * Middleware that verifies the Supabase JWT from the Authorization header.
 * Attaches the decoded user to `req.user` if valid.
 */
export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!supabaseAdmin) {
    res.status(503).json({ error: 'Auth service not configured' });
    return;
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];

  // E2E Test Bypass: Allow 'mock-token' if ALLOW_MOCK_AUTH is set
  if (process.env.ALLOW_MOCK_AUTH === 'true' && token === 'mock-token') {
    req.user = {
      id: '00000000-0000-0000-0000-000000000000', // Consistent mock UUID
      email: 'e2e-test@example.com',
    };
    next();
    return;
  }

  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    req.user = {
      id: data.user.id,
      email: data.user.email,
    };

    next();
  } catch {
    res.status(500).json({ error: 'Authentication service error' });
  }
}
