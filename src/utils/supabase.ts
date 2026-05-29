import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tqdodnxxqzdixgqnfaws.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxZG9kbnh4cXpkaXhncW5mYXdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MDk4NzQsImV4cCI6MjA5NTM4NTg3NH0.O-2DGX46nvAk7Wq-SvL8i6AozLb5qRd6KnK3MPpIyQQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
