"use client"

import Link from "next/link"
import { Button, buttonVariants } from "../ui/button"
import { ThemeSwitcher } from "../theme-switcher"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useEffect, useState } from "react"
import { useProfile } from "@/context/ProfileContext"


const supabase = createClient()

export function Navbar() {
  const { user } = useAuth();
  const { profile } = useProfile()
  const userId = user?.id;
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

      useEffect(() => {
          if (!userId) return;
  
          const fetchProfile = async () => {
              const { data, error } = await supabase
                  .from('Profile')
                  .select()
                  .eq("user_id", userId)
                  .single();
                  
              if (error) {
                  toast.error(error.message);
                  return;
              }
              
              setData(data);
          };
          
          // Call the async function
          fetchProfile();
      }, [userId]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success("Logged out successfully")
    router.push("/")
  }

  return (
    <nav className="w-full py-5 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/">
          <h1 className="text-3xl font-bold">
            CV<span className="text-blue-500">Maker</span>
          </h1>
        </Link>

        <div className="flex items-center gap-2">
          <Link className={buttonVariants({ variant: "ghost" })} href="/dashboard">
            Dashboard
          </Link>
          <Link className={buttonVariants({ variant: "ghost" })} href="/bullets">
            Bullets
          </Link>
          <Link className={buttonVariants({ variant: "ghost" })} href="/cvs">
            CVs
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2">
       {user ? (
          <div className="flex items-center gap-4">
            {!profile ? (
              <span>Loading...</span>
            ) :
              (<span>Hey, {profile?.username}!</span>
            ) }
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        ) : (
          <>
            <Link className={buttonVariants()} href="/auth/sign-up">
              Sign Up
            </Link>
            <Link
              className={buttonVariants({ variant: "secondary" })}
              href="/auth/login"
            >
              Log in
            </Link>
          </>
        )}
        <ThemeSwitcher />
      </div>
    </nav>
  )
}
