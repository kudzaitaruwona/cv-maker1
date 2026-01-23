"use client"

import { createContext, useContext, useEffect, useState, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "./AuthContext"

interface ProfileContextType {
  profile: any | null
  updateProfile: (updates: Record<string, any>) => Promise<{ error: any }>
  refreshProfile: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  updateProfile: async () => ({ error: null }),
  refreshProfile: async () => {},
})

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any | null>(null)

  // Create client lazily inside the component to avoid module-level initialization
  // This ensures env vars are available when the component mounts
  const supabase = useMemo(() => {
    try {
      return createClient()
    } catch (error) {
      // If env vars are missing, log error but don't crash the app
      console.error("Failed to create Supabase client:", error)
      return null
    }
  }, [])

  const fetchProfile = async () => {
    if (!user || !supabase) {
      return
    }

    try {
      const { data, error } = await supabase
        .from("Profile")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (!error) {
        setProfile(data)
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [user, supabase])

  const updateProfile = async (updates: Record<string, any>) => {
    if (!user || !supabase) {
      return { error: { message: "User not authenticated or Supabase not configured" } }
    }

    try {
      const { data, error } = await supabase
        .from("Profile")
        .update(updates)
        .eq("user_id", user.id)
        .select()
        .single()

      if (!error && data) {
        setProfile(data)
      }

      return { error }
    } catch (error) {
      console.error("Failed to update profile:", error)
      return { error }
    }
  }

  const refreshProfile = async () => {
    await fetchProfile()
  }

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export const useProfile = () => useContext(ProfileContext)
