/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabaseUrl = envUrl.startsWith('http') ? envUrl : 'https://tqdodnxxqzdixgqnfaws.supabase.co';
const supabaseAnonKey = envKey.length > 10 ? envKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxZG9kbnh4cXpkaXhncW5mYXdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MDk4NzQsImV4cCI6MjA5NTM4NTg3NH0.O-2DGX46nvAk7Wq-SvL8i6AozLb5qRd6KnK3MPpIyQQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
