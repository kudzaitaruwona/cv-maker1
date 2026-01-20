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
