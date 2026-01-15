"use client"

import { useState, useEffect } from "react"
import { useProfile } from "@/context/ProfileContext"
import { useAuth } from "@/context/AuthContext"
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
  X
} from "lucide-react"

export default function SettingsPage() {
  const { profile, updateProfile } = useProfile()
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm({
    defaultValues: profile || {},
  })

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
    if (!profile) return

    setIsSaving(true)
    try {
      const updates: Record<string, any> = {}
      
      Object.keys(data).forEach((key) => {
        if (key !== "user_id" && key !== "id" && key !== "created_at" && key !== "updated_at" && data[key] !== profile[key]) {
          updates[key] = data[key]
        }
      })

      if (Object.keys(updates).length === 0) {
        toast.info("No changes to save")
        setIsEditing(false)
        setIsSaving(false)
        return
      }

      const { error } = await updateProfile(updates)

      if (error) {
        toast.error(error.message || "Failed to update profile")
      } else {
        toast.success("Profile updated successfully")
        setIsEditing(false)
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
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <CardTitle>Account</CardTitle>
              </div>
              {!isEditing && profile && (
                <Button onClick={handleEdit} variant="outline" size="sm">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>
            <CardDescription>
              Update your account information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!profile ? (
              <div className="text-center text-muted-foreground py-8">
                Loading profile...
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {user?.email && (
                    <div className="grid gap-2">
                      <Label htmlFor="user-email">Email</Label>
                      <Input
                        id="user-email"
                        type="email"
                        value={user.email}
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed
                      </p>
                    </div>
                  )}
                  
                  {profileFields.map((fieldName) => {
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
                            <FormLabel>{displayName}</FormLabel>
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
                  })}

                  {isEditing && (
                    <CardFooter className="px-0 pt-4 flex gap-2">
                      <Button
                        type="submit"
                        disabled={isSaving}
                        className="flex-1"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSaving}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </CardFooter>
                  )}
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
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
                <Label>Push Notifications</Label>
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
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>
              Manage your password and security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="Enter current password"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
              />
            </div>
            <Button>
              <Shield className="mr-2 h-4 w-4" />
              Update Password
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </div>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Delete Account</Label>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button variant="destructive" size="sm">
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
