"use client"

import { useState } from "react";
import { BlobProvider, PDFDownloadLink } from "../pdf";
import { templates } from "../templates/ats";
import { sampleCVShort, sampleCVData, sampleCVLong } from "../lib/sample-cv-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type CvLengthOption = "short" | "standard" | "long";

const cvOptions: { id: CvLengthOption; label: string; description: string; data: any }[] = [
  { id: "short", label: "Short (1 page)", description: "Minimal experience and sections", data: sampleCVShort },
  { id: "standard", label: "Standard", description: "Typical 1–2 page resume", data: sampleCVData },
  { id: "long", label: "Long (2–3+ pages)", description: "Extended experience and projects", data: sampleCVLong },
];

export default function TemplatesPage() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("1");
  const [selectedCvLength, setSelectedCvLength] = useState<CvLengthOption>("standard");
  const [showPreview, setShowPreview] = useState(true);

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
  const SelectedComponent = selectedTemplate?.component;
  const currentCvOption = cvOptions.find(o => o.id === selectedCvLength) ?? cvOptions[1];
  const currentCvData = currentCvOption.data;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Resume Templates</h1>
          <p className="text-gray-600">Select a template to preview with sample data</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>CV Length</CardTitle>
                <CardDescription>Select different CV sizes to test layouts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {cvOptions.map((opt) => (
                    <Button
                      key={opt.id}
                      size="sm"
                      variant={selectedCvLength === opt.id ? "default" : "outline"}
                      onClick={() => setSelectedCvLength(opt.id)}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">{currentCvOption.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Choose Template</CardTitle>
                <CardDescription>{templates.length} ATS-optimized templates available</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {templates.map((template) => (
                  <Button
                    key={template.id}
                    variant={selectedTemplateId === template.id ? "default" : "outline"}
                    className="w-full justify-start text-left h-auto py-3"
                    onClick={() => {
                      setSelectedTemplateId(template.id);
                      setShowPreview(true);
                    }}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-semibold">{template.name}</span>
                      <span className="text-xs opacity-70 mt-1">{template.idealFor}</span>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {selectedTemplate && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">{selectedTemplate.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{selectedTemplate.description}</p>
                  <div className="text-xs text-gray-500">
                    <strong>Ideal for:</strong> {selectedTemplate.idealFor}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <CardTitle>{selectedTemplate?.name || "Select a Template"}</CardTitle>
                    <CardDescription>Preview with sample CV data (viewer toolbar hidden)</CardDescription>
                  </div>
                  {SelectedComponent && (
                    <div className="flex gap-2">
                      <PDFDownloadLink
                        document={<SelectedComponent data={currentCvData} />}
                        fileName={`resume-${selectedTemplate?.name ?? "template"}.pdf`}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {({ loading }) => (loading ? "Preparing…" : "Download PDF")}
                      </PDFDownloadLink>
                      <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
                        {showPreview ? "Hide Preview" : "Show Preview"}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {SelectedComponent && showPreview ? (
                  <div className="w-full border rounded-lg overflow-hidden bg-gray-50" style={{ height: "900px" }}>
                    <BlobProvider document={<SelectedComponent data={currentCvData} />}>
                      {({ url }) =>
                        url ? (
                          <iframe
                            src={`${url}#toolbar=0`}
                            title="Resume preview"
                            className="w-full h-full border-0"
                            style={{ minHeight: "900px" }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            Loading preview…
                          </div>
                        )
                      }
                    </BlobProvider>
                  </div>
                ) : (
                  <div className="w-full border rounded-lg bg-gray-50 flex items-center justify-center" style={{ height: "900px" }}>
                    <div className="text-center text-gray-400">
                      <p className="text-lg mb-2">No template selected</p>
                      <p className="text-sm">Choose a template from the sidebar to preview</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Sample Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>Name:</strong> {currentCvData.header.full_name}
              </p>
              <p>
                <strong>Experience:</strong> {currentCvData.sections.experience.length} entries
              </p>
              <p>
                <strong>Projects:</strong> {currentCvData.sections.projects.length} entries
              </p>
              <p>
                <strong>Education:</strong> {currentCvData.sections.education.length} entry
              </p>
              <p>
                <strong>Skills:</strong> {currentCvData.sections.skills.length} categories
              </p>
              <p>
                <strong>Certifications:</strong> {currentCvData.sections.certifications.length} entries
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
