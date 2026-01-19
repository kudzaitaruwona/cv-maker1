"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { getProfile, updateProfile, createProfile, checkUsername } from "@/app/actions/profile"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { 
  User, 
  Bell, 
  Lock, 
  Trash2,
  Save,
  Shield,
  Pencil,
  X,
  Loader2
} from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm({
    defaultValues: {} as Record<string, any>,
  })

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      try {
        const data = await getProfile()
        setProfile(data)
        if (data) {
          form.reset(data)
        } else {
          // Set default form values for profile creation
          form.reset({
            first_name: "",
            last_name: "",
            username: "",
          })
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error)
        toast.error("Failed to load profile")
        setProfile(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [user, form])

  useEffect(() => {
    if (profile && !isEditing) {
      form.reset(profile)
    }
  }, [profile, isEditing, form])

  const handleEdit = () => {
    if (profile) {
      form.reset(profile)
      setIsEditing(true)
    }
  }

  const handleCancel = () => {
    form.reset(profile || {})
    setIsEditing(false)
  }

  const onSubmit = async (data: Record<string, any>) => {
    if (!user?.id) return

    setIsSaving(true)
    try {
      // Filter out system fields
      const cleanData: Record<string, any> = {}
      Object.keys(data).forEach((key) => {
        if (
          key !== "user_id" && 
          key !== "id" && 
          key !== "created_at" && 
          key !== "updated_at" && 
          key !== "avatar_url" &&
          data[key] !== null &&
          data[key] !== undefined &&
          data[key] !== ""
        ) {
          cleanData[key] = data[key]
        }
      })

      if (profile) {
        // Update existing profile
        const updates: Record<string, any> = {}
        Object.keys(cleanData).forEach((key) => {
          if (cleanData[key] !== profile[key]) {
            updates[key] = cleanData[key]
          }
        })

        if (Object.keys(updates).length === 0) {
          toast.info("No changes to save")
          setIsEditing(false)
          setIsSaving(false)
          return
        }

        // Check username if it's being updated
        if (updates.username && updates.username !== profile.username) {
          const isAvailable = await checkUsername(updates.username)
          if (!isAvailable) {
            toast.error("Username already taken")
            setIsSaving(false)
            return
          }
        }

        const updatedProfile = await updateProfile(user.id, updates)
        setProfile(updatedProfile)
        form.reset(updatedProfile)
        toast.success("Profile updated successfully")
        setIsEditing(false)
      } else {
        // Create new profile - only send first_name, last_name, and username
        const profileData: Record<string, any> = {}
        if (cleanData.first_name) profileData.first_name = cleanData.first_name
        if (cleanData.last_name) profileData.last_name = cleanData.last_name
        if (cleanData.username) profileData.username = cleanData.username.trim()

        // Ensure at least one required field is provided
        if (!profileData.first_name && !profileData.last_name && !profileData.username) {
          toast.error("Please fill in at least one field (First Name, Last Name, or Username)")
          setIsSaving(false)
          return
        }

        // Check username if provided
        if (profileData.username) {
          const isAvailable = await checkUsername(profileData.username)
          if (!isAvailable) {
            toast.error("Username already taken")
            setIsSaving(false)
            return
          }
        }

        const newProfile = await createProfile(profileData)
        setProfile(newProfile)
        form.reset(newProfile)
        toast.success("Profile created successfully")
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred"
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const profileFields = profile ? Object.keys(profile).filter(
    (key) => key !== "id" && key !== "user_id" && key !== "created_at" && key !== "updated_at" && key !== "avatar_url"
  ) : []

  return (
    <div className="max-w-5xl mx-auto px-5 py-8">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Account Settings */}
        <Card className="rounded-xl border-2 shadow">
          <CardHeader className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <CardTitle className="text-2xl font-semibold">Account</CardTitle>
              </div>
              {!isEditing && profile && (
                <Button onClick={handleEdit} variant="outline" size="sm">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>
            <CardDescription className="text-sm text-muted-foreground">
              {profile ? "Update your account information" : "Complete your profile setup"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">Loading profile...</span>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {user?.email && (
                    <div className="space-y-2">
                      <Label htmlFor="user-email" className="text-sm font-medium">Email</Label>
                      <Input
                        id="user-email"
                        type="email"
                        value={user.email}
                        disabled
                        className="h-9"
                      />
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed
                      </p>
                    </div>
                  )}
                  
                  {profile ? (
                    // Show existing profile fields
                    profileFields.map((fieldName) => {
                    const fieldValue = profile[fieldName]
                    const displayName = fieldName
                      .split("_")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")

                    return (
                      <FormField
                        key={fieldName}
                        control={form.control}
                        name={fieldName}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">{displayName}</FormLabel>
                            <FormControl>
                              {isEditing ? (
                                <Input
                                  {...field}
                                  type={
                                    fieldName.includes("email")
                                      ? "email"
                                      : fieldName.includes("phone")
                                      ? "tel"
                                      : fieldName.includes("date")
                                      ? "date"
                                      : "text"
                                  }
                                  disabled={isSaving}
                                  className="h-9"
                                />
                              ) : (
                                <div className="flex h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm">
                                  {fieldValue !== null && fieldValue !== undefined
                                    ? String(fieldValue)
                                    : "Not set"}
                                </div>
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )
                  })
                  ) : (
                    // Show profile creation form with first_name, last_name, and username
                    <>
                      <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">First Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter your first name"
                                disabled={isSaving}
                                className="h-9"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Last Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter your last name"
                                disabled={isSaving}
                                className="h-9"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Username</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter your username"
                                disabled={isSaving}
                                className="h-9"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {(isEditing || !profile) && (
                    <CardFooter className="px-0 pt-4 flex gap-3">
                      <Button
                        type="submit"
                        disabled={isSaving}
                        className="flex-1"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                      {profile && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancel}
                          disabled={isSaving}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                      )}
                    </CardFooter>
                  )}
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="rounded-xl border-2 shadow">
          <CardHeader className="p-6">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle className="text-2xl font-semibold">Notifications</CardTitle>
            </div>
            <CardDescription className="text-sm text-muted-foreground">
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email updates about your account
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications in your browser
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="rounded-xl border-2 shadow">
          <CardHeader className="p-6">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              <CardTitle className="text-2xl font-semibold">Security</CardTitle>
            </div>
            <CardDescription className="text-sm text-muted-foreground">
              Manage your password and security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-sm font-medium">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="Enter current password"
                className="h-9"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-sm font-medium">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                className="h-9"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                className="h-9"
                disabled
              />
            </div>
            <Button disabled>
              <Shield className="mr-2 h-4 w-4" />
              Update Password
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="rounded-xl border-2 border-destructive shadow">
          <CardHeader className="p-6">
            <div className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              <CardTitle className="text-2xl font-semibold text-destructive">Danger Zone</CardTitle>
            </div>
            <CardDescription className="text-sm text-muted-foreground">
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Delete Account</Label>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button variant="destructive" size="sm" disabled>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
