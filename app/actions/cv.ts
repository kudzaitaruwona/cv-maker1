"use server";

import { createClient } from "@/lib/supabase/server";
import { CVSectionType } from "@/app/types/cv";

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



// Get job description for a specific CV
export async function getJobDescription(cvId: string) {
  const { supabase, user } = await getAuthedContext();

  // First verify the CV belongs to the user
  const { data: cv, error: cvError } = await supabase
    .from("target_jobs")
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

// Get all target jobs for the current user
export async function getTargetJobs() {
  const { supabase, user } = await getAuthedContext();
  
  const { data, error } = await supabase
    .from("target_jobs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return data || [];
}

// Get a single CV by ID
export async function getCV(cvId: string) {
  const { supabase, user } = await getAuthedContext();
  
  const { data, error } = await supabase
    .from("cv")
    .select("*")
    .eq("id", cvId)
    .eq("user_id", user.id)
    .single();
  
  if (error) throw error;
  return data;
}

// Get all sections for a CV
export async function getCVSections(cvId: string) {
  const { supabase, user } = await getAuthedContext();
  
  // Verify CV belongs to user first
  const { data: cv, error: cvError } = await supabase
    .from("cv")
    .select("id")
    .eq("id", cvId)
    .eq("user_id", user.id)
    .single();
  
  if (cvError || !cv) throw new Error("CV not found or access denied");
  
  const { data, error } = await supabase
    .from("cv_sections")
    .select("*")
    .eq("cv_id", cvId)
    .order("sort_order", { ascending: true });
  
  if (error) throw error;
  return data || [];
}

// Create a new CV
export async function createCV(data: { title: string; target_job_id: string | null }) {
  const { supabase, user } = await getAuthedContext();
  
  const { data: cv, error } = await supabase
    .from("cv")
    .insert({
      user_id: user.id,
      title: data.title,
      target_job_id: data.target_job_id,
    })
    .select()
    .single();
  
  if (error) throw error;
  return cv;
}

// Update a CV
export async function updateCV(cvId: string, updates: { title?: string; target_job_id?: string | null }) {
  const { supabase, user } = await getAuthedContext();
  
  // Verify CV belongs to user first
  const { data: cv, error: cvError } = await supabase
    .from("cv")
    .select("id")
    .eq("id", cvId)
    .eq("user_id", user.id)
    .single();
  
  if (cvError || !cv) throw new Error("CV not found or access denied");
  
  const { data, error } = await supabase
    .from("cv")
    .update(updates)
    .eq("id", cvId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Delete a CV
export async function deleteCV(cvId: string) {
  const { supabase, user } = await getAuthedContext();
  
  // Verify CV belongs to user first
  const { data: cv, error: cvError } = await supabase
    .from("cv")
    .select("id")
    .eq("id", cvId)
    .eq("user_id", user.id)
    .single();
  
  if (cvError || !cv) throw new Error("CV not found or access denied");
  
  const { error } = await supabase
    .from("cv")
    .delete()
    .eq("id", cvId);
  
  if (error) throw error;
}

// Create a new CV section
export async function createCVSection(cvId: string, data: { type: string; title: string; sort_order: number; content?: string }) {
  const { supabase, user } = await getAuthedContext();
  
  // Verify CV belongs to user first
  const { data: cv, error: cvError } = await supabase
    .from("cv")
    .select("id")
    .eq("id", cvId)
    .eq("user_id", user.id)
    .single();
  
  if (cvError || !cv) throw new Error("CV not found or access denied");
  
  const { data: section, error } = await supabase
    .from("cv_sections")
    .insert({
      cv_id: cvId,
      type: data.type,
      title: data.title,
      sort_order: data.sort_order,
      content: data.content || null,
    })
    .select()
    .single();
  
  if (error) throw error;
  return section;
}

// Update a CV section
export async function updateCVSection(sectionId: string, updates: { title?: string; content?: string; sort_order?: number }) {
  const { supabase, user } = await getAuthedContext();
  
  // Get the section to find its CV
  const { data: section, error: sectionError } = await supabase
    .from("cv_sections")
    .select("cv_id")
    .eq("id", sectionId)
    .single();
  
  if (sectionError || !section) {
    throw new Error("Section not found");
  }
  
  // Verify the CV belongs to the user
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
    .eq("id", sectionId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Delete a CV section
export async function deleteCVSection(sectionId: string) {
  const { supabase, user } = await getAuthedContext();
  
  // Get the section to find its CV
  const { data: section, error: sectionError } = await supabase
    .from("cv_sections")
    .select("cv_id")
    .eq("id", sectionId)
    .single();
  
  if (sectionError || !section) {
    throw new Error("Section not found");
  }
  
  // Verify the CV belongs to the user
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
    .eq("id", sectionId);
  
  if (error) throw error;
}

// Reorder CV sections
export async function reorderCVSections(cvId: string, sectionOrders: { id: string; sort_order: number }[]) {
  const { supabase, user } = await getAuthedContext();
  
  // Verify CV belongs to user first
  const { data: cv, error: cvError } = await supabase
    .from("cv")
    .select("id")
    .eq("id", cvId)
    .eq("user_id", user.id)
    .single();
  
  if (cvError || !cv) throw new Error("CV not found or access denied");
  
  // Update each section's sort_order
  for (const { id, sort_order } of sectionOrders) {
    const { error } = await supabase
      .from("cv_sections")
      .update({ sort_order })
      .eq("id", id)
      .eq("cv_id", cvId);
    
    if (error) throw error;
  }
}

// Create dummy CVs with sections for testing
export async function createDummyCVs(count: number = 3) {
  const { supabase, user } = await getAuthedContext();
  
  const cvTitles = [
    "Software Engineer CV",
    "Data Scientist CV",
    "Product Manager CV",
    "Full Stack Developer CV",
    "DevOps Engineer CV",
    "UX Designer CV",
    "Marketing Manager CV",
    "Sales Representative CV",
  ];
  
  const sectionTypes = [
    CVSectionType.Experience,
    CVSectionType.Education,
    CVSectionType.Skills,
    CVSectionType.Projects,
    CVSectionType.Certifications,
  ];
  
  const sectionTitles: Record<string, string[]> = {
    [CVSectionType.Experience]: [
      "Professional Experience",
      "Work History",
      "Employment",
    ],
    [CVSectionType.Education]: [
      "Education",
      "Academic Background",
      "Qualifications",
    ],
    [CVSectionType.Skills]: [
      "Technical Skills",
      "Core Competencies",
      "Skills & Expertise",
    ],
    [CVSectionType.Projects]: [
      "Projects",
      "Notable Projects",
      "Portfolio",
    ],
    [CVSectionType.Certifications]: [
      "Certifications",
      "Professional Certifications",
      "Credentials",
    ],
  };
  
  const sectionContent: Record<string, string> = {
    [CVSectionType.Experience]: "• Led development of scalable web applications\n• Collaborated with cross-functional teams\n• Improved system performance by 40%",
    [CVSectionType.Education]: "• Bachelor of Science in Computer Science\n• Relevant coursework: Data Structures, Algorithms\n• GPA: 3.8/4.0",
    [CVSectionType.Skills]: "• Programming Languages: JavaScript, TypeScript, Python\n• Frameworks: React, Next.js, Node.js\n• Tools: Git, Docker, AWS",
    [CVSectionType.Projects]: "• Built a task management app with real-time collaboration\n• Developed an e-commerce platform with payment integration\n• Created a data visualization dashboard",
    [CVSectionType.Certifications]: "• AWS Certified Solutions Architect\n• Google Cloud Professional Cloud Architect\n• Certified Kubernetes Administrator",
  };
  
  const createdCVs = [];
  
  for (let i = 0; i < count; i++) {
    const title = cvTitles[i % cvTitles.length] + (i > cvTitles.length - 1 ? ` ${Math.floor(i / cvTitles.length) + 1}` : "");
    
    // Create CV
    const { data: cv, error: cvError } = await supabase
      .from("cv")
      .insert({
        user_id: user.id,
        title,
        target_job_id: null, // Can be linked later
      })
      .select()
      .single();
    
    if (cvError) throw cvError;
    
    // Create sections for this CV
    const sectionsToCreate = sectionTypes.slice(0, Math.min(3 + (i % 3), sectionTypes.length));
    
    for (let j = 0; j < sectionsToCreate.length; j++) {
      const sectionType = sectionsToCreate[j];
      const titles = sectionTitles[sectionType] || [sectionType];
      const sectionTitle = titles[j % titles.length];
      
      const { error: sectionError } = await supabase
        .from("cv_sections")
        .insert({
          cv_id: cv.id,
          type: sectionType,
          title: sectionTitle,
          sort_order: j,
          content: sectionContent[sectionType] || "Sample content",
        });
      
      if (sectionError) throw sectionError;
    }
    
    createdCVs.push(cv);
  }
  
  return {
    success: true,
    count: createdCVs.length,
    message: `Successfully created ${createdCVs.length} dummy CVs with sections`,
  };
}

// Create dummy target jobs for testing
export async function createDummyTargetJobs(count: number = 5) {
  const { supabase, user } = await getAuthedContext();
  
  const jobTitles = [
    "Software Engineer",
    "Senior Software Engineer",
    "Full Stack Developer",
    "Data Scientist",
    "Product Manager",
    "DevOps Engineer",
    "UX Designer",
    "Frontend Developer",
    "Backend Developer",
    "Mobile Developer",
  ];
  
  const companies = [
    "Tech Corp",
    "Innovation Labs",
    "Digital Solutions Inc",
    "Cloud Services LLC",
    "StartupHub",
    "Enterprise Systems",
    "Creative Agency",
    "Global Tech",
    "Future Innovations",
    "Smart Solutions",
  ];
  
  const jobDescriptions = [
    "We are looking for a skilled software engineer to join our dynamic team. You will be responsible for developing and maintaining web applications, collaborating with cross-functional teams, and contributing to our product roadmap.",
    "Join our team as a Senior Software Engineer and lead the development of cutting-edge solutions. You'll work on challenging problems, mentor junior developers, and help shape our technical direction.",
    "We're seeking a Full Stack Developer to build end-to-end features for our platform. You'll work with modern technologies and have the opportunity to make a significant impact on our product.",
    "As a Data Scientist, you'll analyze complex datasets, build predictive models, and help drive data-driven decision making across the organisation.",
    "We need a Product Manager to own product strategy and execution. You'll work closely with engineering, design, and stakeholders to deliver exceptional user experiences.",
  ];
  
  const createdJobs = [];
  
  for (let i = 0; i < count; i++) {
    const title = jobTitles[i % jobTitles.length];
    const company = companies[i % companies.length];
    const description = jobDescriptions[i % jobDescriptions.length];
    
    const { data: job, error } = await supabase
      .from("target_jobs")
      .insert({
        user_id: user.id,
        title,
        company,
        description,
      })
      .select()
      .single();
    
    if (error) throw error;
    createdJobs.push(job);
  }
  
  return {
    success: true,
    count: createdJobs.length,
    message: `Successfully created ${createdJobs.length} dummy target jobs`,
  };
}
