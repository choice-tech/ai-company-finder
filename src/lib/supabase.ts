import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mkkbvjjjbtufsiyjpfpk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ra2J2ampqYnR1ZnNpeWpwZnBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2OTY2MzAsImV4cCI6MjA2NzI3MjYzMH0.EsG2HWl2EFhDW0Hs8C8C89eMAlxVfbp2RnVY2kfVDPg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 