import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase credentials missing! Check .env file');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

