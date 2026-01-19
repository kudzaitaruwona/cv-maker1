"use server";

import { createClient } from "@/lib/supabase/server";


async function getAuthedContext() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  return { supabase, user };
}

export async function getProfile() {
    const { supabase, user } = await getAuthedContext();


  const { data, error } = await supabase
    .from("Profile")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}


// UPDATE: update profile fields
export async function updateProfile(userId: string, updates: Record<string, any>) {
    const { supabase, user } = await getAuthedContext();

  
  const { data, error } = await supabase
    .from("Profile")
    .update(updates)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function checkUsername(username:string){
const { supabase, user } = await getAuthedContext();


  const { data, error } = await supabase
    .from("Profile")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (error) throw error;

  if(data){
    return false;
} else{
    return true
}
}

export async function createProfile(profileData: Record<string, any>) {
  const { supabase, user } = await getAuthedContext();

  const { data, error } = await supabase
    .from("Profile")
    .insert({
      user_id: user.id,
      ...profileData,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}
