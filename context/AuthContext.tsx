// context/AuthContext.tsx
"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"

const supabase = createClient()
const AuthContext = createContext<{ user: User | null }>({ user: null })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
  // fetch the user once
  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }
  fetchUser()

  // listen for login/logout
  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null)
  })

  // unsubscribe correctly
  return () => listener.subscription.unsubscribe()
}, [])


  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
