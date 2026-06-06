import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://dwjghqslnrkcjhaoaneq.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3amdocXNsbnJrY2poYW9hbmVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NDM1NTgsImV4cCI6MjA5NjMxOTU1OH0.Q-q70ee0ViQpcPSTgRIe_-T6GorXrEo4uuc2dvb5UJE'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

export type Profile = {
  id: string
  email: string
  full_name: string | null
  created_at: string
}

export type Entry = {
  id: number
  user_id: string
  pool_id: number
  tickets: number
  amount_paid: number
  created_at: string
}
