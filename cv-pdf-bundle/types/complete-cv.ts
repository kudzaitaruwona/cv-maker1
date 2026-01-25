export interface CompleteCVForPDF {
  header: {
    full_name: string;
    email: string | null;
    phone: string | null;
    location: string | null;
    linkedin_url: string | null;
    github_url: string | null;
    portfolio_url: string | null;
  };

  summary: string | null;

  sections: {
    experience: Array<{
      id: string;
      title: string;
      organization: string | null;
      start_date: string | null;
      end_date: string | null;
      location: string | null;
      link: string | null;
      bullets: Array<{
        id: string;
        content: string;
        sort_order: number;
      }>;
      sort_order: number;
    }>;

    projects: Array<{
      id: string;
      title: string;
      organization: string | null;
      start_date: string | null;
      end_date: string | null;
      location: string | null;
      link: string | null;
      bullets: Array<{
        id: string;
        content: string;
        sort_order: number;
      }>;
      sort_order: number;
    }>;

    education: Array<{
      id: string;
      title: string;
      organization: string | null;
      start_date: string | null;
      end_date: string | null;
      location: string | null;
      link: string | null;
      bullets: Array<{
        id: string;
        content: string;
        sort_order: number;
      }>;
      sort_order: number;
    }>;

    skills: Array<{
      id: string;
      title: string;
      organization: string | null;
      start_date: string | null;
      end_date: string | null;
      location: string | null;
      link: string | null;
      bullets: Array<{
        id: string;
        content: string;
        sort_order: number;
      }>;
      sort_order: number;
    }>;

    certifications: Array<{
      id: string;
      title: string;
      organization: string | null;
      start_date: string | null;
      end_date: string | null;
      location: string | null;
      link: string | null;
      bullets: Array<{
        id: string;
        content: string;
        sort_order: number;
      }>;
      sort_order: number;
    }>;

    other: Array<{
      id: string;
      title: string;
      organization: string | null;
      start_date: string | null;
      end_date: string | null;
      location: string | null;
      link: string | null;
      bullets: Array<{
        id: string;
        content: string;
        sort_order: number;
      }>;
      sort_order: number;
    }>;
  };

  metadata: {
    cv_title: string;
    target_job_title: string | null;
    target_company: string | null;
    generated_date: string;
  };
}
