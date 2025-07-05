import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { AuthUser, SignUpData, SignInData, AuthContextType } from '@/types/auth'
import { toast } from 'sonner'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user as AuthUser)
        }
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user as AuthUser)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (data: SignUpData) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.first_name,
            last_name: data.last_name,
          },
        },
      })

      if (error) {
        throw error
      }

      toast.success('Sign up successful! Please check your email to verify your account.')
    } catch (error: any) {
      console.error('Sign up error:', error)
      toast.error(error.message || 'Sign up failed')
      throw error
    }
  }

  const signIn = async (data: SignInData) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        throw error
      }

      toast.success('Sign in successful!')
    } catch (error: any) {
      console.error('Sign in error:', error)
      toast.error(error.message || 'Sign in failed')
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
      toast.success('Signed out successfully!')
    } catch (error: any) {
      console.error('Sign out error:', error)
      toast.error(error.message || 'Sign out failed')
      throw error
    }
  }

  const updateProfile = async (data: { first_name: string; last_name: string }) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
        },
      })

      if (error) {
        throw error
      }

      toast.success('Profile updated successfully!')
    } catch (error: any) {
      console.error('Update profile error:', error)
      toast.error(error.message || 'Profile update failed')
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
} 