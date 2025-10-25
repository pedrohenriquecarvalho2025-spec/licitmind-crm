import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { Database } from '../lib/database.types'

type UserProfile = Database['public']['Tables']['user_profiles']['Row']

interface AuthState {
  user: User | null
  profile: UserProfile | null
  loading: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  })

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setAuthState(prev => ({ ...prev, user: session.user }))
        fetchProfile(session.user.id)
      } else {
        setAuthState({ user: null, profile: null, loading: false })
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setAuthState(prev => ({ ...prev, user: session.user }))
        await fetchProfile(session.user.id)
      } else {
        setAuthState({ user: null, profile: null, loading: false })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error

      setAuthState(prev => ({ ...prev, profile, loading: false }))
    } catch (error) {
      console.error('Error fetching profile:', error)
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (data.user && !error) {
      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: data.user.id,
          email,
          full_name: fullName,
          organization_id: null, // Will be set by admin later
        })

      if (profileError) {
        console.error('Error creating profile:', profileError)
      }
    }

    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const hasPermission = (requiredRole: 'admin' | 'gestor' | 'analista' | 'cliente') => {
    if (!authState.profile) return false

    const roleHierarchy = {
      admin: 4,
      gestor: 3,
      analista: 2,
      cliente: 1,
    }

    return roleHierarchy[authState.profile.role] >= roleHierarchy[requiredRole]
  }

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    hasPermission,
  }
}