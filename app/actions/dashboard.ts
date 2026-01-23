"use server"

import { createClient } from "@/lib/supabase/server"
import type { CVWithDetails, MasterExperience } from "@/app/types/database"

// Shared auth helper so all dashboard queries are scoped to the current user.
async function getAuthedContext() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) throw error
  if (!user) throw new Error("Not authenticated")

  return { supabase, user }
}

export type DashboardSummary = {
  totalCVs: number
  totalEntries: number
  totalLibraryBullets: number
  totalBullets: number
  recentCVs: Array<Pick<CVWithDetails, "id" | "title" | "created_at" | "updated_at">>
  recentEntries: Array<Pick<MasterExperience, "id" | "title" | "type" | "created_at">>
}

// Aggregates the key metrics needed for the dashboard in one place.
export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { supabase, user } = await getAuthedContext()

  // Use count + head queries for efficient aggregates.
  const [
    cvCountRes,
    entryCountRes,
    libBulletCountRes,
    bulletCountRes,
    recentCVsRes,
    recentEntriesRes,
  ] = await Promise.all([
    supabase.from("cv").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase
      .from("master_experiences")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("master_bullets")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase.from("Bullets").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    // Some deployments may not have an updated_at column on cv yet, so we
    // order by created_at which is guaranteed to exist.
    supabase
      .from("cv")
      .select("id, title, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("master_experiences")
      .select("id, title, type, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ])

  if (cvCountRes.error) throw cvCountRes.error
  if (entryCountRes.error) throw entryCountRes.error
  if (libBulletCountRes.error) throw libBulletCountRes.error
  if (bulletCountRes.error) throw bulletCountRes.error
  if (recentCVsRes.error) throw recentCVsRes.error
  if (recentEntriesRes.error) throw recentEntriesRes.error

  return {
    totalCVs: cvCountRes.count ?? 0,
    totalEntries: entryCountRes.count ?? 0,
    totalLibraryBullets: libBulletCountRes.count ?? 0,
    totalBullets: bulletCountRes.count ?? 0,
    recentCVs: (recentCVsRes.data ?? []) as any,
    recentEntries: (recentEntriesRes.data ?? []) as any,
  }
}

