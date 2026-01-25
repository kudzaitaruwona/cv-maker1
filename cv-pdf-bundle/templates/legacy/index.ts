import React from "react";
import TabTemplate from "./TabTemplate";
import ProfessionalTemplate from "./ProfessionalTemplate";
import ModernTemplate from "./ModernTemplate";
import ClassicTemplate from "./ClassicTemplate";
import CreativeTemplate from "./CreativeTemplate";
import MinimalistTemplate from "./MinimalistTemplate";
import ExecutiveTemplate from "./ExecutiveTemplate";
import ATSTemplate from "./ATSTemplate";
import type { CVData } from "../../types/cv";

export type TemplateType = "tab" | "professional" | "modern" | "classic" | "creative" | "minimalist" | "executive" | "ats";

export const legacyTemplates: { id: TemplateType; name: string; component: React.ComponentType<{ data: CVData }> }[] = [
  { id: "tab", name: "Tab", component: TabTemplate },
  { id: "professional", name: "Professional", component: ProfessionalTemplate },
  { id: "modern", name: "Modern", component: ModernTemplate },
  { id: "classic", name: "Classic", component: ClassicTemplate },
  { id: "creative", name: "Creative", component: CreativeTemplate },
  { id: "minimalist", name: "Minimalist", component: MinimalistTemplate },
  { id: "executive", name: "Executive", component: ExecutiveTemplate },
  { id: "ats", name: "ATS Friendly", component: ATSTemplate },
];

export {
  TabTemplate,
  ProfessionalTemplate,
  ModernTemplate,
  ClassicTemplate,
  CreativeTemplate,
  MinimalistTemplate,
  ExecutiveTemplate,
  ATSTemplate,
};
