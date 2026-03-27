// src/config/databaseConfig.js

import { createClient } from 'supabase-js';
import 'dotenv';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabaseClient;

// Make sure to add these environment variables to your .env file:
/*
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_KEY=your-supabase-key
*/