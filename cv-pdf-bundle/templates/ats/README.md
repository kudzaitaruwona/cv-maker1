# ATS-Optimized Resume Templates

This directory contains 10 distinct, ATS-optimized resume templates built with `@react-pdf/renderer` for Next.js applications.

## Overview

All templates are designed to be:
- **ATS-Friendly**: Single-column layouts, standard fonts, no images/graphics
- **Null-Safe**: Automatically hide empty fields and sections
- **Date-Formatted**: Convert ISO dates to "January 2020 - Present" format
- **Link-Enabled**: All URLs are clickable hyperlinks
- **Production-Ready**: Complete error handling and edge case coverage

## Templates

1. **Classic Professional** - Traditional, conservative layout
2. **Modern Minimal** - Clean lines, generous white space
3. **Bold Headers** - Emphasized section dividers
4. **Compact Efficient** - Maximizes content density
5. **Left Sidebar** - Contact/skills sidebar layout
6. **Timeline Style** - Dates prominently displayed
7. **Skills-First** - Skills section near top
8. **Two-Tone** - Subtle background shading
9. **Executive** - Spacious layout for senior roles
10. **Tech Focus** - Optimized for technical roles

## Data Structure

All templates accept the `CompleteCVForPDF` type:

```typescript
import type { CompleteCVForPDF } from '../../types/complete-cv';
```

See `types/complete-cv.ts` for the complete structure.

## Usage

### Basic Usage

```typescript
import ResumeTemplate1 from './pdf/resume/ats-templates/Template1-ClassicProfessional';
import type { CompleteCVForPDF } from './types/complete-cv';

const MyComponent = () => {
  const cvData: CompleteCVForPDF = { /* your data */ };
  
  return (
    <PDFViewer width="100%" height="100%">
      <ResumeTemplate1 data={cvData} />
    </PDFViewer>
  );
};
```

### Using Template Registry

```typescript
import { templates, getTemplateById } from './pdf/resume/ats-templates';

// Get all templates
const allTemplates = templates;

// Get specific template
const template = getTemplateById('1');
const TemplateComponent = template?.component;
```

### Using Template Selector

```typescript
import TemplateSelector from './components/TemplateSelector';
import { sampleCVData } from './lib/sample-cv-data';

const MyPage = () => {
  const handleSelect = (templateId: string) => {
    console.log('Selected template:', templateId);
  };

  return (
    <TemplateSelector 
      cvData={sampleCVData} 
      onSelectTemplate={handleSelect}
    />
  );
};
```

## Key Features

### Null Handling
- Empty sections are completely hidden
- Null fields are not displayed
- No "N/A" or placeholder text

### Date Formatting
- ISO dates (YYYY-MM-DD) converted to "January 2020"
- Null end_date displays as "Present"
- Date ranges formatted as "January 2020 - December 2023"

### Skills Display
- Skills grouped by category (title field)
- Comma-separated lists within each category
- All bullets combined with commas

### Links
- All links are clickable using react-pdf's `<Link>` component
- URLs displayed as actual text (not "View Certificate")
- Projects and certifications emphasize links

### Sorting
- All sections sorted by `sort_order`
- Bullets within items sorted by `sort_order`
- Consistent ordering across all templates

## ATS Optimization Rules

All templates follow these strict rules:

✅ **Fonts**: Helvetica, Arial, Calibri, Georgia, Times New Roman only
✅ **Layout**: Single-column (sidebar designs still parseable)
✅ **Headers**: Standard names (EXPERIENCE, EDUCATION, etc.)
✅ **No Images**: Never displays avatar_url or any images
✅ **No Tables**: No complex table structures
✅ **No Graphics**: No icons, shapes, or visual embellishments
✅ **Simple Bullets**: Standard bullet points (• character)

## Testing

Use the provided sample data:

```typescript
import { sampleCVData } from './lib/sample-cv-data';
```

This includes:
- Complete header information
- Multiple experience entries
- Projects with links
- Education with bullets
- Skills in categories
- Certifications with verification URLs
- Other section items

## File Structure

```
ats-templates/
├── Template1-ClassicProfessional.tsx
├── Template2-ModernMinimal.tsx
├── Template3-BoldHeaders.tsx
├── Template4-CompactEfficient.tsx
├── Template5-LeftSidebar.tsx
├── Template6-TimelineStyle.tsx
├── Template7-SkillsFirst.tsx
├── Template8-TwoTone.tsx
├── Template9-Executive.tsx
├── Template10-TechFocus.tsx
├── index.ts (registry)
└── README.md
```

## Utilities

Date formatting and helper functions are in `lib/pdf-utils.ts`:

- `formatDate(isoDate: string | null): string`
- `formatDateRange(start: string | null, end: string | null): string`
- `hasContent(array: any[]): boolean`
- `sortByOrder<T>(items: T[]): T[]`

## Notes

- All templates are production-ready
- No placeholders or TODO comments
- Comprehensive null handling
- Edge cases covered (empty arrays, null values, missing fields)
- Consistent styling across all templates
- ATS compatibility verified
