// context/AuthContext.tsx
"use client"
import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"

const AuthContext = createContext<{ user: User | null }>({ user: null })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  
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

  useEffect(() => {
    // Only proceed if client was created successfully
    if (!supabase) {
      return
    }

    // fetch the user once
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error("Failed to fetch user:", error)
      }
    }
    fetchUser()

    // listen for login/logout
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    // unsubscribe correctly
    return () => listener.subscription.unsubscribe()
  }, [supabase])


  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
