// CV Management Types

export type CV = {
  id: string
  created_at: string
  user_id: string
  title: string
  target_job_id: string | null
}

export type TargetJob = {
  id: string
  created_at: string
  user_id: string
  title: string
  company: string | null
  description: string | null
}

export type CVSection = {
  id: string
  created_at: string
  cv_id: string
  type: CVSectionType
  title: string
  sort_order: number
  // Content fields - structure depends on section type
  content?: string | null
  // Add more content fields as needed based on section type
}

// CV Section Types - TODO: Populate with actual section types
export enum CVSectionType {
  // TODO: Add section types (e.g., Experience, Education, Skills, etc.)
  Experience = "Experience",
  Education = "Education",
  Skills = "Skills",
  Projects = "Projects",
  Certifications = "Certifications",
  Summary = "Summary",
  Other = "Other",
}



// new ones 

type MasterExperience = {
  id: string;
  user_id: string;
  type: 'Experience' | 'Projects' | 'Education' | 'Skills' | 'Certifications' | 'Other';
  title: string;
  organization: string | null;
  start_date: string | null; // date
  end_date: string | null; // date
  location: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

type MasterBullet = {
  id: string;
  master_experience_id: string;
  user_id: string;
  content: string;
  sort_order: number;
  created_at: string;
}

type TargetPosition = {
  id: string;
  user_id: string;
  title: string;
  company: string;
  description: string | null;
  created_at: string;
}

type CV1 = {
  id: string;
  user_id: string;
  target_position_id: string | null;
  title: string;
  created_at: string;
  updated_at: string;
}

type CVSection1 = {
  id: string;
  cv_id: string;
  master_experience_id: string | null;
  type: string;
  title: string;
  organization: string | null;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  sort_order: number;
  created_at: string;
}

type CVBullet = {
  id: string;
  cv_section_id: string;
  master_bullet_id: string | null;
  content: string;
  previous_content: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

type ATSScore = {
  id: string;
  cv_id: string;
  score: number | null;
  feedback: any; // jsonb
  created_at: string;
}