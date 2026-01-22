// Database Schema Types
// DO NOT implement these - they already exist
// Reference only for understanding data relationships

export enum BulletCategories {
  Experience = "Experience",
  Projects = "Projects",
  Education = "Education",
  Skills = "Skills",
  Certifications = "Certifications",
  Other = "Other",
}

export type MasterExperience = {
  id: string;
  user_id: string;
  type: BulletCategories;
  title: string;
  organisation: string | null;
  start_date: string | null; // date
  end_date: string | null; // date
  location: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type MasterBullet = {
  id: string;
  master_experience_id: string;
  user_id: string;
  content: string;
  sort_order: number;
  created_at: string;
}

export type TargetPosition = {
  id: string;
  user_id: string;
  title: string;
  company: string;
  description: string | null;
  created_at: string;
}

export type CV = {
  id: string;
  user_id: string;
  target_position_id: string | null;
  title: string;
  created_at: string;
  updated_at: string;
}

export type CVSection = {
  id: string;
  cv_id: string;
  master_experience_id: string | null;
  type: string;
  title: string;
  organisation: string | null;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  sort_order: number;
  created_at: string;
}

export type CVBullet = {
  id: string;
  cv_section_id: string;
  master_bullet_id: string | null;
  content: string;
  previous_content: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type ATSScore = {
  id: string;
  cv_id: string;
  score: number | null;
  feedback: any; // jsonb
  created_at: string;
}

// Extended types for UI
export type MasterExperienceWithBullets = MasterExperience & {
  bullets?: MasterBullet[];
}

export type CVSectionWithBullets = CVSection & {
  bullets?: CVBullet[];
}

export type CVWithDetails = CV & {
  target_position?: TargetPosition | null;
  ats_score?: ATSScore | null;
}
