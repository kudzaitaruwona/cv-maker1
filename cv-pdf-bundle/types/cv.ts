export interface CVData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string[];
  }>;
  education: Array<{
    degree: string;
    school: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa?: string;
    details?: string;
  }>;
  skills: {
    languages?: string[];
    frameworks?: string[];
    tools?: string[];
    other?: string[];
  };
  certifications?: Array<{
    name: string;
    issuer?: string;
    date?: string;
  }>;
}

export const defaultCVData: CVData = {
  personalInfo: {
    name: "John Doe",
    title: "Senior Software Engineer",
    email: "john.doe@email.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/johndoe",
    github: "github.com/johndoe",
  },
  summary: "Experienced software engineer with expertise in full-stack development, cloud architecture, and team leadership.",
  experience: [
    {
      title: "Senior Software Engineer",
      company: "Tech Company Inc.",
      location: "San Francisco, CA",
      startDate: "2020",
      endDate: "Present",
      description: [
        "Led development of microservices architecture serving 1M+ users",
        "Implemented CI/CD pipelines reducing deployment time by 60%",
        "Mentored team of 5 junior developers",
      ],
    },
  ],
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      school: "State University",
      location: "City, State",
      startDate: "2014",
      endDate: "2018",
      gpa: "3.8/4.0",
    },
  ],
  skills: {
    languages: ["JavaScript", "TypeScript", "Python"],
    frameworks: ["React", "Node.js"],
    tools: ["AWS", "Docker", "Git"],
  },
  certifications: [
    {
      name: "AWS Certified Solutions Architect",
      date: "2021",
    },
  ],
};
