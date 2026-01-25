# CV PDF Bundle

Self-contained folder with everything needed for the resume/CV PDF system. Copy this folder into another Next.js project to reuse.

## Contents

- **types/** – `CompleteCVForPDF`, `CVData`, `defaultCVData`
- **lib/** – `pdf-utils`, `sample-cv-data` (sampleCVShort, sampleCVData, sampleCVLong)
- **pdf/** – `BlobProvider`, `PDFDownloadLink`, `PDFViewer` (viewer toolbar hidden via `#toolbar=0`)
- **templates/ats/** – 10 ATS-optimized templates + registry
- **templates/legacy/** – 8 legacy templates (Tab, Professional, etc.) + registry
- **pages/** – `TemplatesPage`, `CVBuilderPage`

## Host project requirements

- Next.js with App Router
- `@react-pdf/renderer` installed
- UI components at `@/components/ui`: `Button`, `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle`, `Input`, `Textarea`, `Label`
- `tsconfig` path alias: `@/*` → project root

## Usage

### Re-export pages

```ts
// app/page.tsx
export { default } from "@/cv-pdf-bundle/pages/CVBuilderPage";

// app/templates/page.tsx
export { default } from "@/cv-pdf-bundle/pages/TemplatesPage";
```

### Import from bundle

```ts
import { templates, sampleCVData, BlobProvider, PDFDownloadLink } from "@/cv-pdf-bundle";
import { CVBuilderPage, TemplatesPage } from "@/cv-pdf-bundle";
```

## Copy & export

Copy the entire `cv-pdf-bundle` folder into your project. Ensure the host has the UI components and `@/` alias, then re-export the pages as above.
