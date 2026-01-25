"use server"

import { createClient } from "@/lib/supabase/server"
import { getProfile, createProfile, updateProfile } from "./profile"
import { createExperience, createBullet } from "./experiences"
import { BulletCategories } from "@/app/types/database"

async function getAuthedUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  return user
}

type WizardData = {
  profile: {
    first_name: string
    last_name: string
    summary: string
  }
  experiences: Array<{
    type: BulletCategories
    title: string
    organisation: string
    start_date: string
    end_date: string | null
    is_ongoing: boolean
    points: string[]
  }>
}

export async function saveWizardData(data: WizardData) {
  const user = await getAuthedUser()

  try {
    // Check if profile exists using existing action
    const existingProfile = await getProfile()

    // Prepare profile data
    const profileData: Record<string, any> = {
      first_name: data.profile.first_name,
      last_name: data.profile.last_name,
    }

    // Only update summary if it was provided
    if (data.profile.summary?.trim()) {
      profileData.summary = data.profile.summary.trim()
    }

    // If profile exists, update it; otherwise create a new one
    if (existingProfile) {
      // Profile exists - update it with the wizard data
      await updateProfile(user.id, profileData)
    } else {
      // Profile doesn't exist - create a new one
      // Generate a username from name
      const username = `${data.profile.first_name.toLowerCase()}.${data.profile.last_name.toLowerCase()}`.replace(/\s+/g, ".")
      await createProfile({
        ...profileData,
        username: username,
        email: user.email || "",
      })
    }

    // Create experiences (only if any were added)
    for (const exp of data.experiences) {
      // Skip empty experiences - only title is required
      if (!exp.title.trim()) {
        continue
      }

      // For Skills, don't require organisation or dates
      // For Certifications, organisation and end_date (award date) are optional
      // For others, organisation and dates are optional
      const experience = await createExperience({
        type: exp.type, // Use the selected type from wizard
        title: exp.title,
        organisation: exp.organisation?.trim() || null,
        start_date: exp.type === BulletCategories.Skills ? null : (exp.start_date || null),
        end_date:
          exp.type === BulletCategories.Skills
            ? null
            : exp.is_ongoing
            ? null
            : exp.end_date || null,
        location: null,
        link: null,
      })

      // Create points for this experience
      for (const pointContent of exp.points) {
        if (pointContent.trim()) {
          await createBullet(experience.id, pointContent)
        }
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error saving wizard data:", error)
    throw error
  }
}
