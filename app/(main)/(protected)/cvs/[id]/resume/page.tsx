"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { BlobProvider, PDFDownloadLink } from "@/cv-pdf-bundle/pdf"
import { templates } from "@/cv-pdf-bundle/templates/ats"
import { Button } from "@/components/ui/button"
import { exportCVData } from "@/app/actions/cvs"
import type { CompleteCVForPDF } from "@/cv-pdf-bundle/types/complete-cv"
import { Loader2, ArrowLeft, Download, Eye, EyeOff, FileText } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

// Filter to only show: Classic Professional, Bold Headers, Left Sidebar, Timeline Style, Tech Focus
const allowedTemplateIds = ["1", "3", "5", "6", "10"]
const filteredTemplates = templates.filter((t) => allowedTemplateIds.includes(t.id))

export default function ResumePage() {
  const params = useParams()
  const router = useRouter()
  const cvId = params.id as string

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("1")
  const [showPreview, setShowPreview] = useState(true)
  const [loading, setLoading] = useState(true)
  const [cvData, setCvData] = useState<CompleteCVForPDF | null>(null)
  const [cvTitle, setCvTitle] = useState<string>("")

  useEffect(() => {
    if (cvId) {
      loadCVData()
    }
  }, [cvId])

  const loadCVData = async () => {
    try {
      setLoading(true)
      const data = await exportCVData(cvId)
      setCvData(data)
      setCvTitle(data.metadata.cv_title)
    } catch (error) {
      toast.error("Failed to load CV data")
      console.error(error)
      router.push(`/cvs/${cvId}`)
    } finally {
      setLoading(false)
    }
  }

  const selectedTemplate = filteredTemplates.find((t) => t.id === selectedTemplateId)
  const SelectedComponent = selectedTemplate?.component

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">Loading CV data...</p>
        </div>
      </div>
    )
  }

  if (!cvData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="max-w-md text-center space-y-4">
          <p className="text-sm text-muted-foreground">Failed to load CV data</p>
          <Button asChild>
            <Link href={`/cvs/${cvId}`}>Back to Edit CV</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-5">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild className="rounded-md">
                <Link href={`/cvs/${cvId}`}>
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Resume Preview</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">{cvTitle}</p>
              </div>
            </div>
            {SelectedComponent && cvData && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  className="rounded-md"
                >
                  {showPreview ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Show
                    </>
                  )}
                </Button>
                <PDFDownloadLink
                  document={<SelectedComponent data={cvData} />}
                  fileName={`${cvTitle || "resume"}-${selectedTemplate?.name ?? "template"}.pdf`}
                  className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium shadow-lg hover:shadow-xl transition-shadow focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none"
                >
                  {({ loading }) => (
                    <>
                      {loading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      {loading ? "Preparing…" : "Download PDF"}
                    </>
                  )}
                </PDFDownloadLink>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - Template Selection */}
        <div className="w-64 border-r border-border/50 bg-muted/30 overflow-y-auto">
          <div className="p-5 space-y-1">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-foreground mb-1">Templates</h2>
              <p className="text-xs text-muted-foreground">{filteredTemplates.length} available</p>
            </div>
            {filteredTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  setSelectedTemplateId(template.id)
                  setShowPreview(true)
                }}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-all ${
                  selectedTemplateId === template.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-muted/50"
                }`}
              >
                <div className="font-medium">{template.name}</div>
                <div className={`text-xs mt-0.5 ${
                  selectedTemplateId === template.id
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
                }`}>
                  {template.idealFor}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content - Preview */}
        <div className="flex-1 overflow-auto bg-muted/20">
          <div className="max-w-4xl mx-auto p-8">
            {SelectedComponent && cvData && showPreview ? (
              <div className="bg-background rounded-xl border-2 border-border shadow-lg overflow-hidden">
                <div className="w-full" style={{ height: "1200px" }}>
                  <BlobProvider document={<SelectedComponent data={cvData} />}>
                    {({ url }) =>
                      url ? (
                        <iframe
                          src={`${url}#toolbar=0`}
                          title="Resume preview"
                          className="w-full h-full border-0"
                          style={{ minHeight: "1200px" }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <div className="text-center space-y-2">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                            <p className="text-sm">Generating preview...</p>
                          </div>
                        </div>
                      )
                    }
                  </BlobProvider>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[1200px] bg-background rounded-xl border-2 border-border/50">
                <div className="text-center space-y-3">
                  <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-foreground">No preview</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedTemplate
                        ? "Click 'Show' to preview your resume"
                        : "Select a template to preview"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
