export * from "./types/complete-cv";
export * from "./types/cv";
export * from "./lib/pdf-utils";
export { sampleCVShort, sampleCVData, sampleCVLong } from "./lib/sample-cv-data";
export { PDFViewer, PDFDownloadLink, BlobProvider } from "./pdf";
export { templates, getTemplateById, type TemplateInfo } from "./templates/ats";
export {
  legacyTemplates,
  type TemplateType,
  TabTemplate,
  ProfessionalTemplate,
  ModernTemplate,
  ClassicTemplate,
  CreativeTemplate,
  MinimalistTemplate,
  ExecutiveTemplate,
  ATSTemplate,
} from "./templates/legacy";

export { default as TemplatesPage } from "./pages/TemplatesPage";
export { default as CVBuilderPage } from "./pages/CVBuilderPage";
