"use client"

import Link from "next/link"
import { Button, buttonVariants } from "../ui/button"
import { ThemeSwitcher } from "../theme-switcher"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

const supabase = createClient()

export function Navbar() {
  const { user } = useAuth()
  const router = useRouter()

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
            Hey, {user.email}!
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
