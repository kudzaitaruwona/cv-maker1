/**
 * ATS-Optimized Resume Templates Registry
 * 
 * All 10 templates are registered here for easy import and selection
 */

import React from 'react';
import ResumeTemplate1 from './Template1-ClassicProfessional';
import ResumeTemplate2 from './Template2-ModernMinimal';
import ResumeTemplate3 from './Template3-BoldHeaders';
import ResumeTemplate4 from './Template4-CompactEfficient';
import ResumeTemplate5 from './Template5-LeftSidebar';
import ResumeTemplate6 from './Template6-TimelineStyle';
import ResumeTemplate7 from './Template7-SkillsFirst';
import ResumeTemplate8 from './Template8-TwoTone';
import ResumeTemplate9 from './Template9-Executive';
import ResumeTemplate10 from './Template10-TechFocus';
import type { CompleteCVForPDF } from '../../types/complete-cv';

export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  idealFor: string;
  component: React.ComponentType<{ data: CompleteCVForPDF }>;
}

export const templates: TemplateInfo[] = [
  {
    id: '1',
    name: 'Classic Professional',
    description: 'Traditional, conservative layout with minimal styling.',
    idealFor: 'Corporate roles, traditional industries, entry-level positions',
    component: ResumeTemplate1,
  },
  {
    id: '2',
    name: 'Modern Minimal',
    description: 'Clean lines, generous white space with one subtle accent color.',
    idealFor: 'Tech roles, startups, creative industries',
    component: ResumeTemplate2,
  },
  {
    id: '3',
    name: 'Bold Headers',
    description: 'Emphasized section dividers with stronger typography.',
    idealFor: 'Mid-level professionals, marketing roles, standout applications',
    component: ResumeTemplate3,
  },
  {
    id: '4',
    name: 'Compact Efficient',
    description: 'Maximizes content while maintaining readability.',
    idealFor: 'Extensive experience, 2-page resumes, detailed backgrounds',
    component: ResumeTemplate4,
  },
  {
    id: '5',
    name: 'Left Sidebar',
    description: 'Contact info and skills in narrow left column, main content on right.',
    idealFor: 'Tech professionals, designers, roles emphasizing skills',
    component: ResumeTemplate5,
  },
  {
    id: '6',
    name: 'Timeline Style',
    description: 'Dates prominently displayed on left, visual flow emphasizing career progression.',
    idealFor: 'Career changers, professionals with clear progression, chronological emphasis',
    component: ResumeTemplate6,
  },
  {
    id: '7',
    name: 'Skills-First',
    description: 'Skills section near top (after summary, before experience).',
    idealFor: 'Technical roles, developers, engineers',
    component: ResumeTemplate7,
  },
  {
    id: '8',
    name: 'Two-Tone',
    description: 'Subtle light gray background shading to separate sections.',
    idealFor: 'Professional roles, clear section separation',
    component: ResumeTemplate8,
  },
  {
    id: '9',
    name: 'Executive',
    description: 'Refined, spacious layout for senior positions.',
    idealFor: 'C-level, VP, Director roles, senior executives',
    component: ResumeTemplate9,
  },
  {
    id: '10',
    name: 'Tech Focus',
    description: 'Optimized for technical roles with projects prominently displayed.',
    idealFor: 'Software engineers, developers, technical roles',
    component: ResumeTemplate10,
  },
];

export const getTemplateById = (id: string): TemplateInfo | undefined => {
  return templates.find(template => template.id === id);
};

export {
  ResumeTemplate1,
  ResumeTemplate2,
  ResumeTemplate3,
  ResumeTemplate4,
  ResumeTemplate5,
  ResumeTemplate6,
  ResumeTemplate7,
  ResumeTemplate8,
  ResumeTemplate9,
  ResumeTemplate10,
};
