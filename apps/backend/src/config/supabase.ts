import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Service-role client for server-side operations (token verification, admin tasks).
// Gracefully handles missing credentials so tests can run without Supabase configured.
let supabaseAdmin: SupabaseClient | null = null;

if (supabaseUrl && supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
} else {
  console.warn(
    'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set. Auth middleware will reject all requests.'
  );
}

export { supabaseAdmin };
export default supabaseAdmin;
