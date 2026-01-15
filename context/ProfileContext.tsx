"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "./AuthContext"

const supabase = createClient()

const ProfileContext = createContext<{ profile: any | null }>({
  profile: null,
})

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any | null>(null)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      return
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("Profile")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (!error) {
        setProfile(data)
      }
    }

    fetchProfile()
  }, [user])

  return (
    <ProfileContext.Provider value={{ profile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export const useProfile = () => useContext(ProfileContext)
