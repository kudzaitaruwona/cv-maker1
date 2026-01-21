"use client"

import Link from "next/link"
import { Button, buttonVariants } from "../ui/button"
import { ThemeSwitcher } from "../theme-switcher"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useProfile } from "@/context/ProfileContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu, User, LogOut, Settings } from "lucide-react"

const supabase = createClient()

export function Navbar() {
  const { user } = useAuth()
  const { profile } = useProfile()
  const router = useRouter()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success("Logged out successfully")
    router.push("/")
    router.refresh()
  }

  const navLinks = user ? (
    <>
      <Link className={buttonVariants({ variant: "ghost" })} href="/dashboard">
        Dashboard
      </Link>
      <Link className={buttonVariants({ variant: "ghost" })} href="/experiences">
        Experiences
      </Link>
      <Link className={buttonVariants({ variant: "ghost" })} href="/bullets">
        Bullets
      </Link>
      <Link className={buttonVariants({ variant: "ghost" })} href="/cvs">
        CVs
      </Link>
    </>
  ) : null

  return (
    <nav className="w-full border-b bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-semibold">
            Resumaide
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden md:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9">
                        <User className="h-4 w-4" />
                        <span className="sr-only">User menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>
                        {profile?.first_name || profile?.username || user.email}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="flex items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden">
                      <Menu className="h-4 w-4" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <SheetHeader>
                      <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <div className="mt-8 flex flex-col gap-4">
                      <Link href="/dashboard" className="text-sm font-medium">
                        Dashboard
                      </Link>
                      <Link href="/experiences" className="text-sm font-medium">
                        Experiences
                      </Link>
                      <Link href="/bullets" className="text-sm font-medium">
                        Bullets
                      </Link>
                      <Link href="/cvs" className="text-sm font-medium">
                        CVs
                      </Link>
                      <Link href="/settings" className="text-sm font-medium">
                        Settings
                      </Link>
                      <Button onClick={handleLogout} variant="outline" className="mt-4">
                        Logout
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            ) : (
              <>
                <div className="hidden md:flex items-center gap-2">
                  <Link className={buttonVariants({ variant: "ghost" })} href="/auth/login">
                    Log in
                  </Link>
                  <Link className={buttonVariants()} href="/auth/sign-up">
                    Sign Up
                  </Link>
                </div>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden">
                      <Menu className="h-4 w-4" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <SheetHeader>
                      <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <div className="mt-8 flex flex-col gap-4">
                      <Link href="/auth/login" className="text-sm font-medium">
                        Log in
                      </Link>
                      <Link href="/auth/sign-up" className="text-sm font-medium">
                        Sign Up
                      </Link>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            )}
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </nav>
  )
}
