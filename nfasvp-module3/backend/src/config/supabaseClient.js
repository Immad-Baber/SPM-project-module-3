'use strict';

/**
 * supabaseClient.js — Data Access Layer singleton
 *
 * This is the ONLY file that imports and instantiates the Supabase client.
 * Rule: Only repositories (dataAccess layer) may import from this file.
 *       Services in the application layer MUST NOT import this directly.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      // Disable auto-refresh — this is a server-side client using service role key
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
);

module.exports = supabase;
