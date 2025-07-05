import { User as SupabaseUser } from '@supabase/supabase-js'

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  created_at: string
  updated_at: string
}

export interface AuthUser extends SupabaseUser {
  user_metadata?: {
    first_name?: string
    last_name?: string
  }
}

export interface SignUpData {
  email: string
  password: string
  first_name: string
  last_name: string
}

export interface SignInData {
  email: string
  password: string
}

export interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signUp: (data: SignUpData) => Promise<void>
  signIn: (data: SignInData) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: { first_name: string; last_name: string }) => Promise<void>
} 