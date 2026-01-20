"use server";

import { createClient } from "@/lib/supabase/server";

async function getAuthedContext() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  return { supabase, user };
}

// Get all CVs for the current user
export async function getCVs() {
  const { supabase, user } = await getAuthedContext();

  const { data, error } = await supabase
    .from("cv")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

// Get experiences (bullets) for a specific CV
export async function getCVExperiences(cvId: string) {
  const { supabase, user } = await getAuthedContext();

  // First verify the CV belongs to the user
  const { data: cv, error: cvError } = await supabase
    .from("cv_sections")
    .select("id")
    .eq("id", cvId)
    .eq("user_id", user.id)
    .single();

  if (cvError || !cv) throw new Error("CV not found or access denied");

  // Get experiences linked to this CV
  // Assuming a junction table "CV_Bullets" or similar
  const { data: cvBullets, error: cvBulletsError } = await supabase
    .from("CV_Bullets")
    .select("bullet_id")
    .eq("cv_id", cvId);

  if (cvBulletsError) throw cvBulletsError;

  if (!cvBullets || cvBullets.length === 0) {
    return [];
  }

  // Get the actual bullet data
  const bulletIds = cvBullets.map((cb) => cb.bullet_id);
  const { data: bullets, error: bulletsError } = await supabase
    .from("Bullets")
    .select("*")
    .in("id", bulletIds)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (bulletsError) throw bulletsError;
  return bullets || [];
}

// Get job description for a specific CV
export async function getJobDescription(cvId: string) {
  const { supabase, user } = await getAuthedContext();

  // First verify the CV belongs to the user
  const { data: cv, error: cvError } = await supabase
    .from("CVs")
    .select("id")
    .eq("id", cvId)
    .eq("user_id", user.id)
    .single();

  if (cvError || !cv) throw new Error("CV not found or access denied");

  // Get job description from JobDescriptions table
  const { data, error } = await supabase
    .from("JobDescriptions")
    .select("job_description, created_at")
    .eq("cv_id", cvId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// TODO: Implement getTargetJobs - Fetch all target jobs for the current user
export async function getTargetJobs() {
  // TODO: Replace with actual database call
  // const { supabase, user } = await getAuthedContext();
  // const { data, error } = await supabase
  //   .from("TargetJobs")
  //   .select("*")
  //   .eq("user_id", user.id)
  //   .order("created_at", { ascending: false });
  // if (error) throw error;
  // return data || [];
  
  // Placeholder: Return mock data
  return [
    {
      id: "1",
      created_at: new Date().toISOString(),
      user_id: "user-1",
      title: "Software Engineer",
      company: "Tech Corp",
      description: "Looking for a skilled software engineer...",
    },
  ];
}

// TODO: Implement getCV - Fetch a single CV by ID
export async function getCV(cvId: string) {
  // TODO: Replace with actual database call
  // const { supabase, user } = await getAuthedContext();
  // const { data, error } = await supabase
  //   .from("CVs")
  //   .select("*")
  //   .eq("id", cvId)
  //   .eq("user_id", user.id)
  //   .single();
  // if (error) throw error;
  // return data;
  
  // Placeholder: Return mock data
  return {
    id: cvId,
    created_at: new Date().toISOString(),
    user_id: "user-1",
    title: "Sample CV",
    target_job_id: "1",
  };
}

// TODO: Implement getCVSections - Fetch all sections for a CV
export async function getCVSections(cvId: string) {
  // TODO: Replace with actual database call
  // const { supabase, user } = await getAuthedContext();
  // // Verify CV belongs to user first
  // const { data: cv, error: cvError } = await supabase
  //   .from("CVs")
  //   .select("id")
  //   .eq("id", cvId)
  //   .eq("user_id", user.id)
  //   .single();
  // if (cvError || !cv) throw new Error("CV not found or access denied");
  // const { data, error } = await supabase
  //   .from("CVSections")
  //   .select("*")
  //   .eq("cv_id", cvId)
  //   .order("sort_order", { ascending: true });
  // if (error) throw error;
  // return data || [];
  
  // Placeholder: Return mock data
  return [];
}

// TODO: Implement createCV - Create a new CV
export async function createCV(data: { title: string; target_job_id: string | null }) {
  // TODO: Replace with actual database call
  // const { supabase, user } = await getAuthedContext();
  // const { data: cv, error } = await supabase
  //   .from("CVs")
  //   .insert({
  //     user_id: user.id,
  //     title: data.title,
  //     target_job_id: data.target_job_id,
  //   })
  //   .select()
  //   .single();
  // if (error) throw error;
  // return cv;
  
  // Placeholder: Return mock data
  return {
    id: `cv-${Date.now()}`,
    created_at: new Date().toISOString(),
    user_id: "user-1",
    title: data.title,
    target_job_id: data.target_job_id,
  };
}

// TODO: Implement updateCV - Update a CV
export async function updateCV(cvId: string, updates: { title?: string; target_job_id?: string | null }) {
  // TODO: Replace with actual database call
  // const { supabase, user } = await getAuthedContext();
  // // Verify CV belongs to user first
  // const { data: cv, error: cvError } = await supabase
  //   .from("CVs")
  //   .select("id")
  //   .eq("id", cvId)
  //   .eq("user_id", user.id)
  //   .single();
  // if (cvError || !cv) throw new Error("CV not found or access denied");
  // const { data, error } = await supabase
  //   .from("CVs")
  //   .update(updates)
  //   .eq("id", cvId)
  //   .select()
  //   .single();
  // if (error) throw error;
  // return data;
  
  // Placeholder: Return mock data
  return {
    id: cvId,
    created_at: new Date().toISOString(),
    user_id: "user-1",
    title: updates.title || "Updated CV",
    target_job_id: updates.target_job_id || null,
  };
}

// TODO: Implement deleteCV - Delete a CV
export async function deleteCV(cvId: string) {
  // TODO: Replace with actual database call
  // const { supabase, user } = await getAuthedContext();
  // // Verify CV belongs to user first
  // const { data: cv, error: cvError } = await supabase
  //   .from("CVs")
  //   .select("id")
  //   .eq("id", cvId)
  //   .eq("user_id", user.id)
  //   .single();
  // if (cvError || !cv) throw new Error("CV not found or access denied");
  // const { error } = await supabase
  //   .from("CVs")
  //   .delete()
  //   .eq("id", cvId);
  // if (error) throw error;
  
  // Placeholder: No return value needed
  return;
}

// TODO: Implement createCVSection - Create a new CV section
export async function createCVSection(cvId: string, data: { type: string; title: string; sort_order: number; content?: string }) {
  // TODO: Replace with actual database call
  // const { supabase, user } = await getAuthedContext();
  // // Verify CV belongs to user first
  // const { data: cv, error: cvError } = await supabase
  //   .from("CVs")
  //   .select("id")
  //   .eq("id", cvId)
  //   .eq("user_id", user.id)
  //   .single();
  // if (cvError || !cv) throw new Error("CV not found or access denied");
  // const { data: section, error } = await supabase
  //   .from("CVSections")
  //   .insert({
  //     cv_id: cvId,
  //     type: data.type,
  //     title: data.title,
  //     sort_order: data.sort_order,
  //     content: data.content,
  //   })
  //   .select()
  //   .single();
  // if (error) throw error;
  // return section;
  
  // Placeholder: Return mock data
  return {
    id: `section-${Date.now()}`,
    created_at: new Date().toISOString(),
    cv_id: cvId,
    type: data.type,
    title: data.title,
    sort_order: data.sort_order,
    content: data.content || null,
  };
}

// TODO: Implement updateCVSection - Update a CV section
export async function updateCVSection(sectionId: string, updates: { title?: string; content?: string; sort_order?: number }) {
  // TODO: Replace with actual database call
  // const { supabase, user } = await getAuthedContext();
  // // Verify section's CV belongs to user first
  // const { data: section, error: sectionError } = await supabase
  //   .from("CVSections")
  //   .select("cv_id, CVs!inner(user_id)")
  //   .eq("id", sectionId)
  //   .single();
  // if (sectionError || !section || section.CVs.user_id !== user.id) {
  //   throw new Error("Section not found or access denied");
  // }
  // const { data, error } = await supabase
  //   .from("CVSections")
  //   .update(updates)
  //   .eq("id", sectionId)
  //   .select()
  //   .single();
  // if (error) throw error;
  // return data;
  
  // Placeholder: Return mock data
  return {
    id: sectionId,
    created_at: new Date().toISOString(),
    cv_id: "cv-1",
    type: "Experience",
    title: updates.title || "Updated Section",
    sort_order: updates.sort_order || 0,
    content: updates.content || null,
  };
}

// TODO: Implement deleteCVSection - Delete a CV section
export async function deleteCVSection(sectionId: string) {
  // TODO: Replace with actual database call
  // const { supabase, user } = await getAuthedContext();
  // // Verify section's CV belongs to user first
  // const { data: section, error: sectionError } = await supabase
  //   .from("CVSections")
  //   .select("cv_id, CVs!inner(user_id)")
  //   .eq("id", sectionId)
  //   .single();
  // if (sectionError || !section || section.CVs.user_id !== user.id) {
  //   throw new Error("Section not found or access denied");
  // }
  // const { error } = await supabase
  //   .from("CVSections")
  //   .delete()
  //   .eq("id", sectionId);
  // if (error) throw error;
  
  // Placeholder: No return value needed
  return;
}

// TODO: Implement reorderCVSections - Reorder CV sections
export async function reorderCVSections(cvId: string, sectionOrders: { id: string; sort_order: number }[]) {
  // TODO: Replace with actual database call
  // const { supabase, user } = await getAuthedContext();
  // // Verify CV belongs to user first
  // const { data: cv, error: cvError } = await supabase
  //   .from("CVs")
  //   .select("id")
  //   .eq("id", cvId)
  //   .eq("user_id", user.id)
  //   .single();
  // if (cvError || !cv) throw new Error("CV not found or access denied");
  // // Update each section's sort_order
  // for (const { id, sort_order } of sectionOrders) {
  //   const { error } = await supabase
  //     .from("CVSections")
  //     .update({ sort_order })
  //     .eq("id", id)
  //     .eq("cv_id", cvId);
  //   if (error) throw error;
  // }
  
  // Placeholder: No return value needed
  return;
}

// TODO: Implement createDummyCVs - Create dummy CVs with sections for testing
export async function createDummyCVs(count: number = 3) {
  // TODO: Replace with actual database calls
  // const { supabase, user } = await getAuthedContext();
  
  // TODO: Generate dummy CVs with:
  // - Random titles (e.g., "Software Engineer CV", "Data Scientist CV", etc.)
  // - Random target job assignments (some with, some without)
  // - Multiple sections per CV (Experience, Education, Skills, etc.)
  // - Sample content for each section
  
  // Placeholder: Return mock response
  return {
    success: true,
    count: count,
    message: `Created ${count} dummy CVs (placeholder - implement database logic)`,
  };
}

// TODO: Implement createDummyTargetJobs - Create dummy target jobs for testing
export async function createDummyTargetJobs(count: number = 5) {
  // TODO: Replace with actual database calls
  // const { supabase, user } = await getAuthedContext();
  
  // TODO: Generate dummy target jobs with:
  // - Various job titles (Software Engineer, Data Scientist, Product Manager, etc.)
  // - Random company names
  // - Sample job descriptions
  
  // Placeholder: Return mock response
  return {
    success: true,
    count: count,
    message: `Created ${count} dummy target jobs (placeholder - implement database logic)`,
  };
}
