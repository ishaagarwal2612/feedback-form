import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hbhucihkvwrvcdjfjipu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiaHVjaWhrdndydmNkamZqaXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2Njc5NzMsImV4cCI6MjA2NTI0Mzk3M30.Q8XSzGFrVgx2BU3SnnJNHIztwbtC78ombGFFPINlPZg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
