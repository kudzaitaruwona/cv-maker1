"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  CV,
  CVSection,
  CVBullet,
  TargetPosition,
  CVWithDetails,
  CVSectionWithBullets,
  ATSScore,
} from "@/app/types/database";
import type { MasterExperience, MasterBullet } from "@/app/types/database";

async function getAuthedContext() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  return { supabase, user };
}

// Get all CVs for the current user
export async function getCVs(): Promise<CVWithDetails[]> {
  // TODO: Implement Supabase query
  const { supabase, user } = await getAuthedContext();

  const { data, error } = await supabase
    .from("cv")
    .select(`
      *,
      target_position:target_positions(*),
      ats_score:ats_scores(*)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
  
}

// Get a single CV by ID
export async function getCV(id: string): Promise<CVWithDetails> {
  // TODO: Implement Supabase query
  const { supabase, user } = await getAuthedContext();
  const { data, error } = await supabase
    .from("cv")
    .select(`
      *,
      target_position:target_positions(*),
      ats_score:ats_scores(*)
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (error) throw error;
  return data;
  

}

// Create a target position
export async function createTargetPosition(data: {
  title: string;
  company: string;
  description?: string | null;
}): Promise<TargetPosition> {
  // TODO: Implement Supabase query
  const { supabase, user } = await getAuthedContext();
  const { data: position, error } = await supabase
    .from("target_positions")
    .insert({
      user_id: user.id,
      title: data.title,
      company: data.company,
      description: data.description || null,
    })
    .select()
    .single();
  if (error) throw error;
  return position;
  
}

// Update a target position
export async function updateTargetPosition(
  id: string,
  updates: Partial<{
    title: string;
    company: string;
    description: string | null;
  }>
): Promise<TargetPosition> {
  // TODO: Implement Supabase query
  const { supabase, user } = await getAuthedContext();
  
  
  const { data, error } = await supabase
    .from("target_positions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;

}

// Create a new CV
export async function createCV(data: {
  title: string;
  target_position_id: string | null;
}): Promise<CV> {
  // TODO: Implement Supabase query
  const { supabase, user } = await getAuthedContext();
  const { data: cv, error } = await supabase
    .from("cv")
    .insert({
      user_id: user.id,
      title: data.title,
      target_position_id: data.target_position_id,
    })
    .select()
    .single();
  if (error) throw error;
  return cv;
  
}

// Update a CV
export async function updateCV(
  id: string,
  updates: Partial<{
    title: string;
    target_position_id: string | null;
  }>
): Promise<CV> {
  // TODO: Implement Supabase query
  const { supabase, user } = await getAuthedContext();
  
  const { data, error } = await supabase
    .from("cv")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
  
}

// Delete a CV
export async function deleteCV(id: string): Promise<void> {
  // TODO: Implement Supabase query
  const { supabase, user } = await getAuthedContext();
  
  const { error } = await supabase
    .from("cv")
    .delete()
    .eq("id", id);
  if (error) throw error;
  
}

// Get all sections for a CV with bullets
export async function getCVSections(cvId: string): Promise<CVSectionWithBullets[]> {
  // TODO: Implement Supabase query
  const { supabase, user } = await getAuthedContext();
  
  const { data, error } = await supabase
    .from("cv_sections")
    .select(`
      *,
      bullets:cv_bullets(*)
    `)
    .eq("cv_id", cvId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data || [];
  
}

// Bulk create CV sections from master experiences
export async function createCVSections(
  cvId: string,
  selections: Array<{
    master_experience_id: string;
    master_experience: MasterExperience;
  }>
): Promise<CVSection[]> {
  // TODO: Implement Supabase query
  const { supabase, user } = await getAuthedContext();
  
  // Get max sort_order
  const { data: existing } = await supabase
    .from("cv_sections")
    .select("sort_order")
    .eq("cv_id", cvId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();
  
  let sortOrder = existing ? (existing.sort_order || 0) + 1 : 0;
  
   // Bulk insert sections
   const sectionsToInsert = selections.map((sel) => ({
     user_id: user.id,
     cv_id: cvId,
     master_experience_id: sel.master_experience_id,
     type: sel.master_experience.type,
     title: sel.master_experience.title,
     organisation: sel.master_experience.organisation,
     start_date: sel.master_experience.start_date,
     end_date: sel.master_experience.end_date,
     location: sel.master_experience.location,
     link: sel.master_experience.link,
     sort_order: sortOrder++,
   }));
  
  const { data, error } = await supabase
    .from("cv_sections")
    .insert(sectionsToInsert)
    .select();
  if (error) throw error;
  return data || [];
  
}

// Bulk create CV bullets from master bullets
export async function createCVBullets(
  cvSectionId: string,
  bulletSelections: Array<{
    master_bullet_id: string;
    master_bullet: MasterBullet;
  }>
): Promise<CVBullet[]> {
  // TODO: Implement Supabase query
  const { supabase, user } = await getAuthedContext();
  
  // Verify section ownership via CV
  const { data: section, error: sectionError } = await supabase
    .from("cv_sections")
    .select("cv_id")
    .eq("id", cvSectionId)
    .single();
  
  if (sectionError || !section) {
    throw new Error("CV section not found");
  }
  
  const { data: cv, error: cvError } = await supabase
    .from("cv")
    .select("id")
    .eq("id", section.cv_id)
    .eq("user_id", user.id)
    .single();
  
  if (cvError || !cv) {
    throw new Error("Access denied");
  }
  
  // Get max sort_order
  const { data: existing } = await supabase
    .from("cv_bullets")
    .select("sort_order")
    .eq("cv_section_id", cvSectionId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();
  
  let sortOrder = existing ? (existing.sort_order || 0) + 1 : 0;
  
  // Bulk insert bullets
  const bulletsToInsert = bulletSelections.map((sel) => ({
    cv_section_id: cvSectionId,
    master_bullet_id: sel.master_bullet_id,
    content: sel.master_bullet.content,
    previous_content: null,
    sort_order: sortOrder++,
  }));
  
  const { data, error } = await supabase
    .from("cv_bullets")
    .insert(bulletsToInsert)
    .select();
  if (error) throw error;
  return data || [];

}

// Update a CV section
export async function updateCVSection(
  id: string,
  updates: Partial<{
    title: string;
    organisation: string | null;
    start_date: string | null;
    end_date: string | null;
    location: string | null;
    link: string | null;
  }>
): Promise<CVSection> {
  // TODO: Implement Supabase query
  const { supabase, user } = await getAuthedContext();
  
  // Verify ownership via CV
  const { data: section, error: sectionError } = await supabase
    .from("cv_sections")
    .select("cv_id")
    .eq("id", id)
    .single();
  
  if (sectionError || !section) {
    throw new Error("CV section not found");
  }
  
  const { data: cv, error: cvError } = await supabase
    .from("cv")
    .select("id")
    .eq("id", section.cv_id)
    .eq("user_id", user.id)
    .single();
  
  if (cvError || !cv) {
    throw new Error("Access denied");
  }
  
  const { data, error } = await supabase
    .from("cv_sections")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
  
}

// Bulk update CV bullets in a section
export async function updateCVBullets(
  sectionId: string,
  bullets: Array<{
    id: string;
    content: string;
  }>
): Promise<CVBullet[]> {
  // TODO: Implement Supabase query
  const { supabase, user } = await getAuthedContext();
  
  // Verify section ownership via CV
  const { data: section, error: sectionError } = await supabase
    .from("cv_sections")
    .select("cv_id")
    .eq("id", sectionId)
    .single();
  
  if (sectionError || !section) {
    throw new Error("CV section not found");
  }
  
  const { data: cv, error: cvError } = await supabase
    .from("cv")
    .select("id")
    .eq("id", section.cv_id)
    .eq("user_id", user.id)
    .single();
  
  if (cvError || !cv) {
    throw new Error("Access denied");
  }
  
  // Update each bullet
  // Store previous_content before updating
  for (const bullet of bullets) {
    const { data: existing } = await supabase
      .from("cv_bullets")
      .select("content")
      .eq("id", bullet.id)
      .eq("cv_section_id", sectionId)
      .single();
    
    const previousContent = existing?.content || null;
    
    const { error } = await supabase
      .from("cv_bullets")
      .update({
        content: bullet.content,
        previous_content: previousContent,
      })
      .eq("id", bullet.id)
      .eq("cv_section_id", sectionId);
    
    if (error) throw error;
  }
  
  // Fetch updated bullets
  const { data, error } = await supabase
    .from("cv_bullets")
    .select("*")
    .eq("cv_section_id", sectionId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data || [];
  
}

// Delete a CV section
export async function deleteCVSection(id: string): Promise<void> {
  // TODO: Implement Supabase query
  const { supabase, user } = await getAuthedContext();
  
  // Verify ownership via CV
  const { data: section, error: sectionError } = await supabase
    .from("cv_sections")
    .select("cv_id")
    .eq("id", id)
    .single();
  
  if (sectionError || !section) {
    throw new Error("CV section not found");
  }
  
  const { data: cv, error: cvError } = await supabase
    .from("cv")
    .select("id")
    .eq("id", section.cv_id)
    .eq("user_id", user.id)
    .single();
  
  if (cvError || !cv) {
    throw new Error("Access denied");
  }
  
  const { error } = await supabase
    .from("cv_sections")
    .delete()
    .eq("id", id);
  if (error) throw error;
  

}

// Delete a CV bullet
export async function deleteCVBullet(id: string): Promise<void> {
  // TODO: Implement Supabase query
  const { supabase, user } = await getAuthedContext();
  
  // Verify ownership via section -> CV
  const { data: bullet, error: bulletError } = await supabase
    .from("cv_bullets")
    .select("cv_section_id")
    .eq("id", id)
    .single();
  
  if (bulletError || !bullet) {
    throw new Error("CV bullet not found");
  }
  
  const { data: section, error: sectionError } = await supabase
    .from("cv_sections")
    .select("cv_id")
    .eq("id", bullet.cv_section_id)
    .single();
  
  if (sectionError || !section) {
    throw new Error("CV section not found");
  }
  
  const { data: cv, error: cvError } = await supabase
    .from("cv")
    .select("id")
    .eq("id", section.cv_id)
    .eq("user_id", user.id)
    .single();
  
  if (cvError || !cv) {
    throw new Error("Access denied");
  }
  
  const { error } = await supabase
    .from("cv_bullets")
    .delete()
    .eq("id", id);
  if (error) throw error;
  
}

// Add more CV sections (when adding experiences in edit mode)
export async function addCVSections(
  cvId: string,
  selections: Array<{
    master_experience_id: string;
    master_experience: MasterExperience;
  }>
): Promise<CVSection[]> {
  // Reuse createCVSections logic
  return createCVSections(cvId, selections);
}

// Add more CV bullets (when adding bullets in edit mode)
export async function addCVBullets(
  cvSectionId: string,
  bulletSelections: Array<{
    master_bullet_id: string;
    master_bullet: MasterBullet;
  }>
): Promise<CVBullet[]> {
  // Reuse createCVBullets logic
  return createCVBullets(cvSectionId, bulletSelections);
}

// Run ATS score analysis (placeholder)
export async function runATSScore(cvId: string): Promise<ATSScore> {
  // TODO: Implement ATS scoring logic
  // This would:
  // 1. Fetch CV with sections and bullets
  // 2. Fetch target_position description
  // 3. Run analysis (AI/ML model)
  // 4. Store result in ats_score table
  // 5. Return score and feedback
  
  // Placeholder
  throw new Error("Not implemented - placeholder function");
}

// Export PDF (placeholder)
export async function exportPDF(cvId: string): Promise<Blob> {
  // TODO: Implement PDF generation
  // This would:
  // 1. Fetch CV with sections and bullets
  // 2. Format for PDF
  // 3. Generate PDF using library (e.g., jsPDF, pdf-lib)
  // 4. Return Blob for download
  
  // Placeholder
  throw new Error("Not implemented - placeholder function");
}
