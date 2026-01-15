"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "./AuthContext"

const supabase = createClient()

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

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null)
      return
    }

    const { data, error } = await supabase
      .from("Profile")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (!error) {
      setProfile(data)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [user])

  const updateProfile = async (updates: Record<string, any>) => {
    if (!user) {
      return { error: { message: "User not authenticated" } }
    }

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
