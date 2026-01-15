"use client"

import { useState, useEffect } from "react"
import { useProfile } from "@/context/ProfileContext"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Pencil, Save, X } from "lucide-react"

export default function ProfilePage() {
  const { profile, updateProfile } = useProfile()
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
        if (key !== "user_id" && key !== "id" && data[key] !== profile[key]) {
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
    } catch (error: any) {
      toast.error(error.message || "An error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  if (!profile) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">Loading profile...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const profileFields = Object.keys(profile).filter(
    (key) => key !== "id" && key !== "user_id" && key !== "created_at" && key !== "updated_at"
  )

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                View and manage your profile information
              </CardDescription>
            </div>
            {!isEditing && (
              <Button onClick={handleEdit} variant="outline" size="sm">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        </CardContent>
      </Card>
    </div>
  )
}
