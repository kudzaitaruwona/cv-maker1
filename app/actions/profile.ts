"use server";

import { createClient } from "@/lib/supabase/server";



export async function getProfile() {
  const supabase = await createClient(); // reads session from cookies automatically
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (!user) throw new Error("User not signed in");

  const { data, error } = await supabase
    .from("Profile")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) throw error;
  return data;
}


// UPDATE: update profile fields
export async function updateProfile(userId: string, updates: Record<string, any>) {
    const supabase = await createClient(); // reads session from cookies automatically
    const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (!user) throw new Error("User not signed in");
  
  const { data, error } = await supabase
    .from("Profile")
    .update(updates)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}