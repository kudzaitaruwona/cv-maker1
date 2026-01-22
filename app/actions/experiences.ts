"use server";

import { createClient } from "@/lib/supabase/server";
import type { MasterExperience, MasterBullet } from "@/app/types/database";

async function getAuthedContext() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  return { supabase, user };
}

export async function verifyOwnership(id: string){

    const { supabase, user } = await getAuthedContext();
    const { data: existing, error: checkError } = await supabase
    .from("master_experience")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  
  if (checkError || !existing) {
    throw new Error("Experience not found or access denied");
  } else {
    return true;
  }
    
}

// Get all experiences for the current user
export async function getExperiences() {
  // TODO: Implement Supabase query
const { supabase, user } = await getAuthedContext();
const { data, error } = await supabase
       .from("master_experiences")
       .select("*")
       .eq("user_id", user.id)
       .order("type", { ascending: true })
       .order("sort_order", { ascending: true });

   if (error) throw error;
     return data || [];
  
  // Placeholder: Return mock data
  return [] as MasterExperience[];
}

// Get a single experience by ID
export async function getExperience(id: string): Promise<MasterExperience> {

    const { supabase, user } = await getAuthedContext();
    const { data, error } = await supabase
      .from("master_experiences")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) throw error;
    return data;
  
}

// Create a new experience
export async function createExperience(data: {
  type: MasterExperience["type"];
  title: string;
  organisation?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  location?: string | null;
}): Promise<MasterExperience> {
  // TODO: Implement Supabase query
  const { supabase, user } = await getAuthedContext();
  
  // Get max sort_order for this type
  const { data: existing } = await supabase
    .from("master_experiences")
    .select("sort_order")
    .eq("user_id", user.id)
    .eq("type", data.type)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();
  
  const sortOrder = existing ? (existing.sort_order || 0) + 1 : 0;
  
  const { data: experience, error } = await supabase
    .from("master_experiences")
    .insert({
      user_id: user.id,
      type: data.type,
      title: data.title,
      organisation: data.organisation || null,
      start_date: data.start_date || null,
      end_date: data.end_date || null,
      location: data.location || null,
      sort_order: sortOrder,
    })
    .select()
    .single();
  if (error) throw error;
  return experience;
  
}

// Update an experience
export async function updateExperience(
  id: string,
  updates: Partial<{
    type: MasterExperience["type"];
    title: string;
    organisation: string | null;
    start_date: string | null;
    end_date: string | null;
    location: string | null;
    sort_order: number;
  }>
): Promise<MasterExperience> {

  const { supabase, user } = await getAuthedContext();

  const { data, error } = await supabase
    .from("master_experiences")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
  

}

// Delete an experience
export async function deleteExperience(id: string): Promise<string> {

  const { supabase, user } = await getAuthedContext();
  
  const { error } = await supabase
    .from("master_experiences")
    .delete()
    .eq("id", id);

  if (error) throw error;

  return("delted succesfully")
  

}

// Get all bullets for an experience
export async function getBullets(experienceId: string): Promise<MasterBullet[]> {
  // TODO: Implement Supabase query
  const { supabase, user } = await getAuthedContext();
  
  const { data, error } = await supabase
    .from("master_bullets")
    .select("*")
    .eq("master_experience_id", experienceId)
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data || [];
  

}

// Create a new bullet
export async function createBullet(
  experienceId: string,
  content: string
): Promise<MasterBullet> {
  // TODO: Implement Supabase query
  const { supabase, user } = await getAuthedContext();
  
  // Get max sort_order
  const { data: existing } = await supabase
    .from("master_bullets")
    .select("sort_order")
    .eq("master_experience_id", experienceId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();
  
  const sortOrder = existing ? (existing.sort_order || 0) + 1 : 0;
  
  const { data: bullet, error } = await supabase
    .from("master_bullets")
    .insert({
      master_experience_id: experienceId,
      user_id: user.id,
      content,
      sort_order: sortOrder,
    })
    .select()
    .single();
  if (error) throw error;
  return bullet;
  
}

// Update a bullet
export async function updateBullet(
  id: string,
  content: string
): Promise<MasterBullet> {
  // TODO: Implement Supabase query
  const { supabase, user } = await getAuthedContext();
  
  const { data, error } = await supabase
    .from("master_bullets")
    .update({ content })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
  
}

// Delete a bullet
export async function deleteBullet(id: string): Promise<void> {
  // TODO: Implement Supabase query
  const { supabase, user } = await getAuthedContext();
  
  const { error } = await supabase
    .from("master_bullets")
    .delete()
    .eq("id", id);
  if (error) throw error;
  

}

// Reorder bullets
export async function reorderBullets(
  experienceId: string,
  bulletIds: string[]
): Promise<void> {
  // TODO: Implement Supabase query
  const { supabase, user } = await getAuthedContext();
  
  // Update sort_order for each bullet
  for (let i = 0; i < bulletIds.length; i++) {
    const { error } = await supabase
      .from("master_bullets")
      .update({ sort_order: i })
      .eq("id", bulletIds[i])
      .eq("master_experience_id", experienceId)
      .eq("user_id", user.id);
    
    if (error) throw error;
  }
  

}
