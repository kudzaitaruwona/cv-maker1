# ![Highlights Logo](https://via.placeholder.com/40) Highlights – CV & Achievement Manager

[![License: MIT](https://img.shields.io/badge/License-MIT-green)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-13.5-black?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.3-blue?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-2bbc8a?logo=supabase)](https://supabase.com/)
[![jsPDF](https://img.shields.io/badge/jsPDF-2.5-yellow?logo=javascript)](https://github.com/parallax/jsPDF)
[![Shadcn UI](https://img.shields.io/badge/ShadcnUI-1.0-lightgrey?logo=tailwind-css)](https://shadcn.io/)

---

## 🚀 Overview

**Highlights** is a personal CV management tool that helps you **store, organize, and export your professional achievements**. Keep all your work experience, education, projects, certifications, and skills in one central place. Build multiple CV versions and export professional PDFs instantly.

Highlights is perfect for:
- Students preparing for applications  
- Freelancers showcasing projects  
- Professionals maintaining a central career record  

---

## ✨ Features

- ✅ User authentication (signup/login)  
- ✅ Centralized bullet bank with categories:
  - Education  
  - Experience  
  - Projects  
  - Certifications  
- ✅ Add, edit, and delete bullets  
- ✅ CV builder: select bullets per section  
- ✅ Preview CVs before export  
- ✅ PDF export of CVs  
- ✅ Search and filter bullets by category  
- ✅ Responsive dashboard  
- ✅ Minimalist, modern UI with Shadcn components  

---

## 🛠 Technology Stack

| Layer          | Technology                                |
|----------------|-------------------------------------------|
| Frontend       | Next.js, React, Shadcn UI, Tailwind CSS   |
| Backend / DB   | Supabase (PostgreSQL)                      |
| PDF Export     | jsPDF / pdf-lib                            |
| Deployment     | Vercel or VPS                              |

---

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/kudzaitaruwona/cv-maker
cd cv-maker

2. Install dependencies:

npm install
# or
yarn


3. Configure environment variables in .env.local:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key


4. Run the development server:

npm run dev
# or
yarn dev


5. Open http://localhost:3000
 in your browser.

## 🧩 Usage

- Sign up or log in to your account
- Add bullets under the appropriate category
- Build a CV by selecting bullets for each section
- Preview and export your CV as a PDF

---

## 📂 Project Structure

pages/
  dashboard.js
  bullets/
    index.js          → all bullets
    [category].js     → bullets per category
    new.js            → create bullet
    [id]/edit.js      → edit bullet
  cvs/
    index.js          → list CVs
    new.js            → create new CV
    [id]/preview.js   → preview CV
    [id]/export.js    → export CV to PDF
components/
  Navbar.js
  Sidebar.js
  BulletCard.js
  CVBuilder.js
  PDFExport.js
lib/
  supabaseClient.js


---

## 🌟 Future Features

- 🤖 AI-generated CV suggestions
- 📄 PDF analyzer for batch imports
- 👥 Multi-user / premium features
- 📑 Export to Word or other formats
- 📊 Analytics dashboard for CV metrics

---

## 📄 License

MIT License

---

## 🎨 Visuals & Badges

- Modern dashboard UI using Shadcn components
- Responsive for desktop and mobile
- Clean typography, cards, tables, and forms
- Ready to integrate analytics and AI features