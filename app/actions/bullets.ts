"use server";

import { createClient } from "@/lib/supabase/server";

async function getAuthedContext() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  return { supabase, user };
}

enum bulletCategories {
  Experience = "Experience",
  Projects = "Projects",
  Education = "Education",
  Skills = "Skills",
  Certifications = "Certifications",
  Other = "Other",
}




export async function getBullets() {
    const { supabase, user } = await getAuthedContext();

  const { data, error } = await supabase
    .from("Bullets")
    .select("*")
    .eq("user_id", user.id)

    if (error) throw error;
    return data;

}
export async function updateBullets(bullet_id: string, updates: Record<string, any>) {
    const { supabase, user } = await getAuthedContext();

  const { data, error } = await supabase
    .from("Bullets")
    .update(updates)
    .eq("id", bullet_id)

    if (error) throw error;
    return data;

}
export async function createBullets(Category: bulletCategories, content: string, title: string) {
    const { supabase, user } = await getAuthedContext();

    const { data, error } = await supabase
  .from("Bullets")
  .insert({
    title: title,
    content: content,
    category: Category,
  })
  .select()
  .single();

if (error) throw error;
    return data;

}
export async function deleteBullets(bullet_id: string) {
    const { supabase, user } = await getAuthedContext();

  const { data, error } = await supabase
    .from("Bullets")
    .delete()
    .eq("id", bullet_id)

    if (error) throw error;
    return data;

}

export async function createDummyBullets(count: number = 20) {
  const { supabase, user } = await getAuthedContext();

  const dummyBullets = [
    // Experience
    { category: bulletCategories.Experience, title: "Software Engineer", content: "Developed and maintained web applications using React and TypeScript, improving user experience by 30%" },
    { category: bulletCategories.Experience, title: "Senior Developer", content: "Led a team of 5 developers to deliver major product features on time and within budget" },
    { category: bulletCategories.Experience, title: "Full Stack Developer", content: "Built scalable REST APIs using Node.js and Express, handling over 10,000 requests per day" },
    { category: bulletCategories.Experience, title: "Frontend Engineer", content: "Implemented responsive design patterns using Tailwind CSS, improving mobile experience across all devices" },
    { category: bulletCategories.Experience, title: "DevOps Engineer", content: "Set up CI/CD pipelines using GitHub Actions, reducing deployment time by 40%" },
    { category: bulletCategories.Experience, title: "Tech Lead", content: "Architected microservices architecture, improving system scalability and maintainability" },
    { category: bulletCategories.Experience, title: "Backend Developer", content: "Optimized database queries reducing response time from 2s to 200ms" },
    { category: bulletCategories.Experience, title: "Product Manager", content: "Managed product roadmap and collaborated with cross-functional teams to deliver features on schedule" },

    // Projects
    { category: bulletCategories.Projects, title: "Task Management App", content: "Built a real-time collaboration task management app with React, Node.js, and WebSockets" },
    { category: bulletCategories.Projects, title: "E-commerce Platform", content: "Developed a full-stack e-commerce platform with payment integration using Stripe API" },
    { category: bulletCategories.Projects, title: "Data Visualization Dashboard", content: "Created an interactive data visualization dashboard using D3.js and React" },
    { category: bulletCategories.Projects, title: "Mobile App", content: "Built a cross-platform mobile app using React Native with offline capabilities" },
    { category: bulletCategories.Projects, title: "API Gateway", content: "Designed and implemented a microservices API gateway with rate limiting and authentication" },
    { category: bulletCategories.Projects, title: "Social Media Platform", content: "Developed a social media platform with real-time messaging and content feed algorithms" },
    { category: bulletCategories.Projects, title: "Analytics Tool", content: "Created an analytics tool that processes millions of events per day using Python and PostgreSQL" },
    { category: bulletCategories.Projects, title: "Content Management System", content: "Built a headless CMS with custom content types and workflow management" },

    // Education
    { category: bulletCategories.Education, title: "Bachelor of Science in Computer Science", content: "University of Technology, 2020-2024. Relevant coursework: Data Structures, Algorithms, Software Engineering" },
    { category: bulletCategories.Education, title: "Master of Science in Software Engineering", content: "Tech Institute, 2021-2023. Focused on distributed systems and cloud computing" },
    { category: bulletCategories.Education, title: "Relevant Coursework", content: "Data Structures, Algorithms, Software Engineering, Database Systems, Operating Systems" },
    { category: bulletCategories.Education, title: "Thesis Project", content: "Research on machine learning algorithms for predictive analytics in large datasets" },
    { category: bulletCategories.Education, title: "Academic Excellence", content: "Dean's List for academic excellence, maintaining 3.8+ GPA throughout studies" },
    { category: bulletCategories.Education, title: "Online Certifications", content: "Completed multiple online courses in web development, cloud computing, and DevOps" },

    // Skills
    { category: bulletCategories.Skills, title: "Programming Languages", content: "JavaScript, TypeScript, Python, Java, Go, Rust" },
    { category: bulletCategories.Skills, title: "Frameworks & Libraries", content: "React, Next.js, Node.js, Express, Django, Spring Boot" },
    { category: bulletCategories.Skills, title: "Tools & Technologies", content: "Git, Docker, Kubernetes, AWS, PostgreSQL, MongoDB, Redis" },
    { category: bulletCategories.Skills, title: "Development Practices", content: "Agile methodologies, Test-Driven Development, CI/CD, Code Review" },
    { category: bulletCategories.Skills, title: "Cloud Platforms", content: "AWS (EC2, S3, Lambda, RDS), Google Cloud Platform, Azure" },
    { category: bulletCategories.Skills, title: "Design Patterns", content: "MVC, RESTful API design, Microservices architecture, Event-driven architecture" },
    { category: bulletCategories.Skills, title: "Testing", content: "Jest, React Testing Library, Cypress, pytest, unit and integration testing" },
    { category: bulletCategories.Skills, title: "Version Control", content: "Git, GitHub, GitLab, branching strategies, code collaboration workflows" },

    // Certifications
    { category: bulletCategories.Certifications, title: "AWS Certified Solutions Architect", content: "AWS Certified Solutions Architect - Associate, 2023" },
    { category: bulletCategories.Certifications, title: "Google Cloud Professional", content: "Google Cloud Professional Cloud Architect, 2024" },
    { category: bulletCategories.Certifications, title: "Certified Kubernetes Administrator", content: "Certified Kubernetes Administrator (CKA), 2023" },
    { category: bulletCategories.Certifications, title: "React Developer Certification", content: "React Developer Certification from Meta, 2022" },
    { category: bulletCategories.Certifications, title: "MongoDB Certified Developer", content: "MongoDB Certified Developer Associate, 2023" },
    { category: bulletCategories.Certifications, title: "Docker Certified Associate", content: "Docker Certified Associate (DCA), 2022" },
    { category: bulletCategories.Certifications, title: "Scrum Master Certification", content: "Certified ScrumMaster (CSM), 2023" },
    { category: bulletCategories.Certifications, title: "Azure Fundamentals", content: "Microsoft Azure Fundamentals (AZ-900), 2022" },

    // Other
    { category: bulletCategories.Other, title: "Open Source Contributor", content: "Contributed to multiple open source projects including React, Next.js, and various Node.js libraries" },
    { category: bulletCategories.Other, title: "Technical Blogging", content: "Published technical blog posts on software architecture, web development, and best practices" },
    { category: bulletCategories.Other, title: "Mentoring", content: "Volunteer mentor for coding bootcamp students, helping them transition into tech careers" },
    { category: bulletCategories.Other, title: "Tech Talks", content: "Presented at local tech meetups on topics including microservices and cloud architecture" },
    { category: bulletCategories.Other, title: "Hackathon Winner", content: "Won first place at a 48-hour hackathon with a mobile app for disaster relief coordination" },
    { category: bulletCategories.Other, title: "Community Organizer", content: "Organized local developer meetups, fostering community engagement and knowledge sharing" },
    { category: bulletCategories.Other, title: "Side Projects", content: "Built multiple side projects including a personal finance tracker and a habit tracking app" },
    { category: bulletCategories.Other, title: "Freelance Work", content: "Completed freelance projects for startups, building MVPs and web applications" },
  ];

  // Select random bullets up to the requested count
  const selectedBullets = dummyBullets.slice(0, Math.min(count, dummyBullets.length));
  
  // If count is larger than available bullets, duplicate and randomize
  const bulletsToCreate = [];
  for (let i = 0; i < count; i++) {
    const bullet = dummyBullets[i % dummyBullets.length];
    bulletsToCreate.push({
      ...bullet,
      title: bullet.title + (i >= dummyBullets.length ? ` ${Math.floor(i / dummyBullets.length) + 1}` : ""),
    });
  }

  try {
    const insertData = bulletsToCreate.map(bullet => ({
      title: bullet.title,
      content: bullet.content,
      category: bullet.category,
    }));

    const { data, error } = await supabase
      .from("Bullets")
      .insert(insertData)
      .select();

    if (error) throw error;
    return { success: true, count: data?.length || 0 };
  } catch (error) {
    console.error("Failed to create dummy bullets:", error);
    throw error;
  }
}
