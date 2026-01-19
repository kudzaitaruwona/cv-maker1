"use client"

import { useState, useEffect } from "react"
import { useProfile } from "@/context/ProfileContext"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, List, PlusCircle, User } from "lucide-react"

interface DashboardStats {
  totalCVs: number
  totalBullets: number
  bulletsByCategory: {
    education: number
    experience: number
    projects: number
    certifications: number
  }
}

export default function DashboardPage() {
  const { profile } = useProfile()
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalCVs: 0,
    totalBullets: 0,
    bulletsByCategory: {
      education: 0,
      experience: 0,
      projects: 0,
      certifications: 0
    }
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        setStats({
          totalCVs: 0,
          totalBullets: 0,
          bulletsByCategory: {
            education: 0,
            experience: 0,
            projects: 0,
            certifications: 0
          }
        })
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  const greeting = profile?.first_name ? `Hi ${profile.first_name}` : "Dashboard"

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold mb-2">
          {greeting}
        </h1>
        <p className="text-muted-foreground">
          Manage your CVs and achievements
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New CV</CardTitle>
          <CardDescription>
            Start building a new curriculum vitae
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/cvs/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New CV
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total CVs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {isLoading ? "—" : stats.totalCVs}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bullets</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {isLoading ? "—" : stats.totalBullets}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Education</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {isLoading ? "—" : stats.bulletsByCategory.education}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {isLoading ? "—" : stats.bulletsByCategory.experience}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Manage Bullets</CardTitle>
            <CardDescription>
              Add or view your achievement bullets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/bullets/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Bullet
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/bullets">View All Bullets</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Your profile information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!profile ? (
              <p className="text-sm text-muted-foreground">Loading profile...</p>
            ) : (
              <div className="space-y-2">
                {user?.email && (
                  <div>
                    <div className="text-xs text-muted-foreground">Email</div>
                    <div className="text-sm font-medium">{user.email}</div>
                  </div>
                )}
              </div>
            )}
            <Button asChild variant="ghost" className="w-full mt-4">
              <Link href="/settings">View Settings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
