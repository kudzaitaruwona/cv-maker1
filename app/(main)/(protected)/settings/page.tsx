"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { getProfile, updateProfile, createProfile, checkUsername } from "@/app/actions/profile"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { 
  User, 
  Bell, 
  Lock, 
  Trash2,
  Save,
  Shield,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Image
} from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
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
            email: "",
            phone: "",
            location: "",
            linkedin_url: "",
            github_url: "",
            portfolio_url: "",
            avatar_url: "",
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


  const cleanFormData = (data: Record<string, any>) => {
    const cleanData: Record<string, any> = {}
    Object.keys(data).forEach((key) => {
      if (
        key !== "user_id" && 
        key !== "id" && 
        key !== "created_at" && 
        key !== "updated_at"
      ) {
        // For required fields, only include if not empty
        // For optional fields, include even if empty (to allow clearing)
        const isRequired = ["first_name", "last_name", "username"].includes(key)
        if (!isRequired || (data[key] !== null && data[key] !== undefined && data[key] !== "")) {
          cleanData[key] = data[key] === "" ? null : data[key]
        }
      }
    })
    return cleanData
  }

  const saveSection = async (sectionFields: string[]) => {
    if (!user?.id) return

    setIsSaving(true)
    try {
      const formData = form.getValues()
      const cleanData = cleanFormData(formData)
      
      // Filter to only include fields from this section
      const sectionData: Record<string, any> = {}
      sectionFields.forEach((field) => {
        if (cleanData[field] !== undefined) {
          sectionData[field] = cleanData[field]
        }
      })

      if (profile) {
        // Update existing profile
        const updates: Record<string, any> = {}
        Object.keys(sectionData).forEach((key) => {
          if (sectionData[key] !== profile[key]) {
            updates[key] = sectionData[key]
          }
        })

        if (Object.keys(updates).length === 0) {
          toast.info("No changes to save")
          setIsSaving(false)
          return
        }

        // Check username if it's being updated
        if (updates.username && updates.username !== profile.username) {
          const isAvailable = await checkUsername(updates.username, user.id)
          if (!isAvailable) {
            toast.error("Username already taken")
            setIsSaving(false)
            return
          }
        }

        const updatedProfile = await updateProfile(user.id, updates)
        setProfile(updatedProfile)
        form.reset(updatedProfile)
        toast.success("Section saved successfully")
      } else {
        // Create new profile - required fields: first_name, last_name, username
        if (!cleanData.first_name || !cleanData.last_name || !cleanData.username) {
          toast.error("First Name, Last Name, and Username are required")
          setIsSaving(false)
          return
        }

        // Check username availability
        const isAvailable = await checkUsername(cleanData.username.trim())
        if (!isAvailable) {
          toast.error("Username already taken")
          setIsSaving(false)
          return
        }

        // Build profile data with all fields
        const profileData: Record<string, any> = {
          first_name: cleanData.first_name,
          last_name: cleanData.last_name,
          username: cleanData.username.trim(),
        }

        // Add optional fields if provided
        if (cleanData.email) profileData.email = cleanData.email
        if (cleanData.phone) profileData.phone = cleanData.phone
        if (cleanData.location) profileData.location = cleanData.location
        if (cleanData.linkedin_url) profileData.linkedin_url = cleanData.linkedin_url
        if (cleanData.github_url) profileData.github_url = cleanData.github_url
        if (cleanData.portfolio_url) profileData.portfolio_url = cleanData.portfolio_url
        if (cleanData.avatar_url) profileData.avatar_url = cleanData.avatar_url

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

  const onSubmit = async (data: Record<string, any>) => {
    // This is now handled by individual section saves
    // Keeping for form validation purposes
  }

  // Define field groups for better organisation
  const basicFields = ["first_name", "last_name", "username"]
  const contactFields = ["email", "phone", "location"]
  const socialFields = ["linkedin_url", "github_url", "portfolio_url"]
  const avatarField = "avatar_url"
  
  const getFieldLabel = (fieldName: string) => {
    const labels: Record<string, string> = {
      first_name: "First Name",
      last_name: "Last Name",
      username: "Username",
      email: "Email",
      phone: "Phone",
      location: "Location",
      linkedin_url: "LinkedIn URL",
      github_url: "GitHub URL",
      portfolio_url: "Portfolio URL",
      avatar_url: "Avatar URL",
    }
    return labels[fieldName] || fieldName
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const getFieldIcon = (fieldName: string) => {
    const icons: Record<string, any> = {
      email: Mail,
      phone: Phone,
      location: MapPin,
      linkedin_url: Linkedin,
      github_url: Github,
      portfolio_url: Globe,
      avatar_url: Image,
    }
    return icons[fieldName] || null
  }

  return (
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
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <CardTitle className="text-2xl font-semibold">Account Settings</CardTitle>
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
                    <div className="space-y-2 mb-6">
                      <Label htmlFor="user-email" className="text-sm font-medium">Account Email</Label>
                      <Input
                        id="user-email"
                        type="email"
                        value={user.email}
                        disabled
                        className="h-9"
                      />
                      <p className="text-xs text-muted-foreground">
                        This is your authentication email and cannot be changed here
                      </p>
                    </div>
                  )}

                  <Accordion type="multiple" className="w-full">
                    {/* Basic Information */}
                    <AccordionItem value="basic" className="border rounded-lg px-4 mb-4">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span className="text-lg font-semibold">Basic Information</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4 space-y-4">
                        {basicFields.map((fieldName) => {
                          const isRequired = !profile && ["first_name", "last_name", "username"].includes(fieldName)
                          
                          return (
                            <FormField
                              key={fieldName}
                              control={form.control}
                              name={fieldName}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium">
                                    {getFieldLabel(fieldName)}
                                    {isRequired && <span className="text-destructive ml-1">*</span>}
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder={`Enter your ${getFieldLabel(fieldName).toLowerCase()}`}
                                      disabled={isSaving}
                                      className="h-9"
                                      required={isRequired}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )
                        })}
                        <div className="flex justify-end pt-2">
                          <Button
                            type="button"
                            onClick={() => saveSection(basicFields)}
                            disabled={isSaving}
                            size="sm"
                          >
                            {isSaving ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Basic Information
                              </>
                            )}
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Contact Information */}
                    <AccordionItem value="contact" className="border rounded-lg px-4 mb-4">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span className="text-lg font-semibold">Contact Information</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4 space-y-4">
                        {contactFields.map((fieldName) => {
                          const Icon = getFieldIcon(fieldName)
                          
                          return (
                            <FormField
                              key={fieldName}
                              control={form.control}
                              name={fieldName}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium flex items-center gap-2">
                                    {Icon && <Icon className="h-4 w-4" />}
                                    {getFieldLabel(fieldName)}
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type={
                                        fieldName.includes("email")
                                          ? "email"
                                          : fieldName.includes("phone")
                                          ? "tel"
                                          : "text"
                                      }
                                      placeholder={`Enter your ${getFieldLabel(fieldName).toLowerCase()}`}
                                      disabled={isSaving}
                                      className="h-9"
                                      value={field.value || ""}
                                      onChange={(e) => field.onChange(e.target.value || null)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )
                        })}
                        <div className="flex justify-end pt-2">
                          <Button
                            type="button"
                            onClick={() => saveSection(contactFields)}
                            disabled={isSaving}
                            size="sm"
                          >
                            {isSaving ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Contact Information
                              </>
                            )}
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Social Links */}
                    <AccordionItem value="social" className="border rounded-lg px-4 mb-4">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          <span className="text-lg font-semibold">Social Links</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4 space-y-4">
                        {socialFields.map((fieldName) => {
                          const Icon = getFieldIcon(fieldName)
                          
                          return (
                            <FormField
                              key={fieldName}
                              control={form.control}
                              name={fieldName}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium flex items-center gap-2">
                                    {Icon && <Icon className="h-4 w-4" />}
                                    {getFieldLabel(fieldName)}
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type="url"
                                      placeholder={`https://${fieldName.replace("_url", "")}.com/yourprofile`}
                                      disabled={isSaving}
                                      className="h-9"
                                      value={field.value || ""}
                                      onChange={(e) => field.onChange(e.target.value || null)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )
                        })}
                        <div className="flex justify-end pt-2">
                          <Button
                            type="button"
                            onClick={() => saveSection(socialFields)}
                            disabled={isSaving}
                            size="sm"
                          >
                            {isSaving ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Social Links
                              </>
                            )}
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Avatar URL */}
                    <AccordionItem value="avatar" className="border rounded-lg px-4 mb-4">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Image className="h-4 w-4" />
                          <span className="text-lg font-semibold">Profile Picture</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4 space-y-4">
                        <FormField
                          control={form.control}
                          name={avatarField}
                          render={({ field }) => {
                            const fieldValue = form.watch(avatarField) || profile?.[avatarField]
                            
                            return (
                              <FormItem>
                                <FormLabel className="text-sm font-medium flex items-center gap-2">
                                  <Image className="h-4 w-4" />
                                  {getFieldLabel(avatarField)}
                                </FormLabel>
                                <FormControl>
                                  <div className="space-y-4">
                                    <Input
                                      {...field}
                                      type="url"
                                      placeholder="https://example.com/avatar.jpg"
                                      disabled={isSaving}
                                      className="h-9"
                                      value={field.value || ""}
                                      onChange={(e) => field.onChange(e.target.value || null)}
                                    />
                                    {fieldValue && (
                                      <div className="flex items-center gap-4">
                                        <img
                                          src={String(fieldValue)}
                                          alt="Avatar preview"
                                          className="h-16 w-16 rounded-full object-cover border-2"
                                          onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = "none"
                                          }}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                          Preview will appear here
                                        </p>
                                      </div>
                                    )}
                                    {!fieldValue && (
                                      <div className="flex h-16 w-16 rounded-full border-2 border-dashed items-center justify-center text-muted-foreground">
                                        <User className="h-8 w-8" />
                                      </div>
                                    )}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )
                          }}
                        />
                        <div className="flex justify-end pt-2">
                          <Button
                            type="button"
                            onClick={() => saveSection([avatarField])}
                            disabled={isSaving}
                            size="sm"
                          >
                            {isSaving ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Profile Picture
                              </>
                            )}
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
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
  )
}
