"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { saveWizardData } from "@/app/actions/setup-wizard"
import { BulletCategories } from "@/app/types/database"
import { Loader2, ArrowRight, ArrowLeft, Plus, X } from "lucide-react"
import { toast } from "sonner"

type ExperienceData = {
  type: BulletCategories
  title: string
  organisation: string
  start_date: string
  end_date: string | null
  is_ongoing: boolean
  points: string[]
}

type WizardData = {
  profile: {
    first_name: string
    last_name: string
    summary: string
  }
  experiences: ExperienceData[]
}

const EXAMPLE_POINTS = [
  "Led cross-functional team of 5 developers",
  "Increased user engagement by 40% through feature improvements",
  "Implemented CI/CD pipeline reducing deployment time by 60%",
  "Mentored junior developers and conducted code reviews",
]

export default function SetupWizardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSaving, setIsSaving] = useState(false)
  const [wizardData, setWizardData] = useState<WizardData>({
    profile: {
      first_name: "",
      last_name: "",
      summary: "",
    },
    experiences: [
      {
        title: "",
        organisation: "",
        start_date: "",
        end_date: null,
        is_ongoing: false,
        points: [],
      },
    ],
  })

  // Prefill profile data if it exists
  useEffect(() => {
    const loadExistingProfile = async () => {
      if (!user) return

      try {
        const { getProfile } = await import("@/app/actions/profile")
        const existingProfile = await getProfile()
        
        if (existingProfile) {
          setWizardData((prev) => ({
            ...prev,
            profile: {
              first_name: existingProfile.first_name || prev.profile.first_name || "",
              last_name: existingProfile.last_name || prev.profile.last_name || "",
              summary: existingProfile.summary || prev.profile.summary || "",
            },
          }))
        } else if (user?.email) {
          // If no profile exists, prefill from email
          const emailName = user.email.split("@")[0]
          setWizardData((prev) => ({
            ...prev,
            profile: {
              ...prev.profile,
              first_name: prev.profile.first_name || emailName.split(".")[0] || "",
              last_name: prev.profile.last_name || emailName.split(".")[1] || "",
            },
          }))
        }
      } catch (error) {
        // If profile fetch fails, just use email prefill
        if (user?.email) {
          const emailName = user.email.split("@")[0]
          setWizardData((prev) => ({
            ...prev,
            profile: {
              ...prev.profile,
              first_name: prev.profile.first_name || emailName.split(".")[0] || "",
              last_name: prev.profile.last_name || emailName.split(".")[1] || "",
            },
          }))
        }
      }
    }

    loadExistingProfile()
  }, [user])

  const updateProfile = (field: keyof WizardData["profile"], value: string) => {
    setWizardData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value,
      },
    }))
  }

  const addExperience = () => {
    setWizardData((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          type: BulletCategories.Experience,
          title: "",
          organisation: "",
          start_date: "",
          end_date: null,
          is_ongoing: false,
          points: [],
        },
      ],
    }))
  }

  const removeExperience = (index: number) => {
    setWizardData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }))
  }

  const updateExperience = (
    index: number,
    field: keyof ExperienceData,
    value: any
  ) => {
    setWizardData((prev) => {
      const updated = [...prev.experiences]
      updated[index] = {
        ...updated[index],
        [field]: value,
      }
      return {
        ...prev,
        experiences: updated,
      }
    })
  }

  const addPoint = (expIndex: number, point?: string) => {
    const pointText = point?.trim() || ""
    if (!pointText) {
      // Add empty point for user to fill
      setWizardData((prev) => {
        const updated = [...prev.experiences]
        updated[expIndex] = {
          ...updated[expIndex],
          points: [...updated[expIndex].points, ""],
        }
        return {
          ...prev,
          experiences: updated,
        }
      })
      return
    }
    
    setWizardData((prev) => {
      const updated = [...prev.experiences]
      updated[expIndex] = {
        ...updated[expIndex],
        points: [...updated[expIndex].points, pointText],
      }
      return {
        ...prev,
        experiences: updated,
      }
    })
  }

  const handlePointKeyDown = (
    expIndex: number,
    pointIndex: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      e.preventDefault()
      // Add new point after current one
      addPoint(expIndex, "")
      // Focus will move to next input
    }
  }

  const removePoint = (expIndex: number, pointIndex: number) => {
    setWizardData((prev) => {
      const updated = [...prev.experiences]
      updated[expIndex] = {
        ...updated[expIndex],
        points: updated[expIndex].points.filter((_, i) => i !== pointIndex),
      }
      return {
        ...prev,
        experiences: updated,
      }
    })
  }

  const useExamplePoints = (expIndex: number) => {
    setWizardData((prev) => {
      const updated = [...prev.experiences]
      updated[expIndex] = {
        ...updated[expIndex],
        points: [...EXAMPLE_POINTS],
      }
      return {
        ...prev,
        experiences: updated,
      }
    })
  }

  const canProceedFromStep2 = () => {
    return (
      wizardData.profile.first_name.trim() !== "" &&
      wizardData.profile.last_name.trim() !== ""
    )
  }

  const canProceedFromStep3 = () => {
    // Allow proceeding even with no experiences
    if (wizardData.experiences.length === 0) return true
    // If experiences exist, they must have at least a title
    // Organisation and dates are optional for some types
    return wizardData.experiences.every((exp) => {
      const hasTitle = exp.title.trim() !== ""
      // For Skills, only title is required
      if (exp.type === BulletCategories.Skills) {
        return hasTitle
      }
      // For other types, title is required, organisation and dates are optional
      return hasTitle
    })
  }

  const handleFinish = async (nextAction: "dashboard" | "create-cv") => {
    setIsSaving(true)
    try {
      await saveWizardData(wizardData)
      toast.success("Setup complete!")
      
      if (nextAction === "dashboard") {
        router.push("/dashboard")
      } else {
        router.push("/cvs/new")
      }
    } catch (error) {
      toast.error("Failed to save. Please try again.")
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleQuickAddExperience = (
    expIndex: number,
    field: "title" | "organisation",
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      const exp = wizardData.experiences[expIndex]
      // If both title and org are filled, allow Enter to add another experience
      if (exp.title.trim() && exp.organisation.trim()) {
        e.preventDefault()
        // Move focus to next field or add new experience
        if (field === "organisation") {
          addExperience()
        }
      }
    }
  }

  const totalSteps = 4

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round((currentStep / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <Card className="rounded-xl border-2 shadow-lg">
          <CardContent className="p-8">
            {/* Step 1: Welcome */}
            {currentStep === 1 && (
              <div className="space-y-6 text-center">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Welcome to ResuMe</h1>
                  <p className="text-muted-foreground">
                    Let's set up your profile and experiences quickly
                  </p>
                </div>
                <div className="pt-4">
                  <Button
                    onClick={() => setCurrentStep(2)}
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Profile Essentials */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Profile Essentials</h2>
                  <p className="text-muted-foreground">
                    Tell us a bit about yourself
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">
                        First Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="first_name"
                        value={wizardData.profile.first_name}
                        onChange={(e) => updateProfile("first_name", e.target.value)}
                        placeholder="John"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">
                        Last Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="last_name"
                        value={wizardData.profile.last_name}
                        onChange={(e) => updateProfile("last_name", e.target.value)}
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="summary">Profile Summary (Optional)</Label>
                    <Textarea
                      id="summary"
                      value={wizardData.profile.summary}
                      onChange={(e) => updateProfile("summary", e.target.value)}
                      placeholder="Brief professional summary highlighting your key qualifications and career objectives..."
                      className="min-h-[120px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      A well-written summary helps recruiters quickly understand your value proposition
                    </p>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentStep(3)}
                    >
                      Skip
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(3)}
                      disabled={!canProceedFromStep2()}
                    >
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Experiences */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Add Experiences</h2>
                  <p className="text-muted-foreground">
                    Add your work experiences, projects, education, and more (optional)
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Remember: You can always add, edit, or remove entries later in the{" "}
                    <span className="font-medium">Entries</span> tab
                  </p>
                </div>

                <div className="space-y-6">
                  {wizardData.experiences.map((exp, index) => (
                    <Card key={index} className="border-2">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            Entry {index + 1}
                          </CardTitle>
                          {wizardData.experiences.length > 0 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeExperience(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>
                            Type <span className="text-destructive">*</span>
                          </Label>
                          <select
                            value={exp.type}
                            onChange={(e) =>
                              updateExperience(index, "type", e.target.value as BulletCategories)
                            }
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value={BulletCategories.Experience}>Work Experience</option>
                            <option value={BulletCategories.Projects}>Projects</option>
                            <option value={BulletCategories.Education}>Education</option>
                            <option value={BulletCategories.Skills}>Skills</option>
                            <option value={BulletCategories.Certifications}>Certifications</option>
                            <option value={BulletCategories.Other}>Other</option>
                          </select>
                        </div>

                        <div
                          className={`grid gap-4 ${
                            exp.type === BulletCategories.Skills
                              ? "grid-cols-1"
                              : "grid-cols-2"
                          }`}
                        >
                          <div className="space-y-2">
                            <Label>
                              Title <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              value={exp.title}
                              onChange={(e) =>
                                updateExperience(index, "title", e.target.value)
                              }
                              onKeyDown={(e) => handleQuickAddExperience(index, "title", e)}
                              placeholder={
                                exp.type === BulletCategories.Experience
                                  ? "Software Engineer"
                                  : exp.type === BulletCategories.Projects
                                  ? "Project Name"
                                  : exp.type === BulletCategories.Education
                                  ? "Bachelor of Science"
                                  : exp.type === BulletCategories.Skills
                                  ? "JavaScript, Python, etc."
                                  : exp.type === BulletCategories.Certifications
                                  ? "Certification Name"
                                  : "Title"
                              }
                              required
                            />
                          </div>
                          {exp.type !== BulletCategories.Skills && (
                            <div className="space-y-2">
                              <Label>
                                {exp.type === BulletCategories.Certifications
                                  ? "Issuing Organization (Optional)"
                                  : "Organization (Optional)"}
                              </Label>
                              <Input
                                value={exp.organisation}
                                onChange={(e) =>
                                  updateExperience(index, "organisation", e.target.value)
                                }
                                onKeyDown={(e) =>
                                  handleQuickAddExperience(index, "organisation", e)
                                }
                                placeholder={
                                  exp.type === BulletCategories.Experience
                                    ? "Company Name"
                                    : exp.type === BulletCategories.Projects
                                    ? "Organization / Client"
                                    : exp.type === BulletCategories.Education
                                    ? "University Name"
                                    : exp.type === BulletCategories.Certifications
                                    ? "Issuing Organization"
                                    : "Organization"
                                }
                              />
                            </div>
                          )}
                        </div>

                        {/* Dates - hidden for Skills, simplified for Certifications */}
                        {exp.type !== BulletCategories.Skills && (
                          <div
                            className={`grid gap-4 ${
                              exp.type === BulletCategories.Certifications
                                ? "grid-cols-1"
                                : "grid-cols-2"
                            }`}
                          >
                            {exp.type === BulletCategories.Certifications ? (
                              // For certifications, only show award date (end_date)
                              <div className="space-y-2">
                                <Label>Award Date (Optional)</Label>
                                <Input
                                  type="date"
                                  value={exp.end_date || ""}
                                  onChange={(e) =>
                                    updateExperience(
                                      index,
                                      "end_date",
                                      e.target.value || null
                                    )
                                  }
                                />
                                <p className="text-xs text-muted-foreground">
                                  When the certification was awarded
                                </p>
                              </div>
                            ) : (
                              <>
                                <div className="space-y-2">
                                  <Label>Start Date (Optional)</Label>
                                  <Input
                                    type="date"
                                    value={exp.start_date}
                                    onChange={(e) =>
                                      updateExperience(index, "start_date", e.target.value)
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>End Date (Optional)</Label>
                                  <Input
                                    type="date"
                                    value={exp.end_date || ""}
                                    onChange={(e) =>
                                      updateExperience(
                                        index,
                                        "end_date",
                                        e.target.value || null
                                      )
                                    }
                                    disabled={exp.is_ongoing}
                                  />
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`ongoing-${index}`}
                                      checked={exp.is_ongoing}
                                      onCheckedChange={(checked) =>
                                        updateExperience(
                                          index,
                                          "is_ongoing",
                                          checked === true
                                        )
                                      }
                                    />
                                    <Label
                                      htmlFor={`ongoing-${index}`}
                                      className="text-sm font-normal cursor-pointer"
                                    >
                                      Ongoing
                                    </Label>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                        {exp.type === BulletCategories.Skills && (
                          <div className="text-xs text-muted-foreground">
                            Skills don't require dates
                          </div>
                        )}

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Points / Achievements (Optional)</Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => useExamplePoints(index)}
                            >
                              Use example points
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {exp.points.map((point, pointIndex) => (
                              <div
                                key={pointIndex}
                                className="flex items-center gap-2"
                              >
                                <Input
                                  value={point}
                                  onChange={(e) => {
                                    const updated = [...exp.points]
                                    updated[pointIndex] = e.target.value
                                    updateExperience(index, "points", updated)
                                  }}
                                  onKeyDown={(e) =>
                                    handlePointKeyDown(index, pointIndex, e)
                                  }
                                  placeholder="Achievement or responsibility..."
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removePoint(index, pointIndex)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addPoint(index)}
                              className="w-full"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add Point
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Button
                    variant="outline"
                    onClick={addExperience}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Another Entry (Optional)
                  </Button>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentStep(4)}
                    >
                      Skip
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(4)}
                      disabled={!canProceedFromStep3()}
                    >
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Finish */}
            {currentStep === 4 && (
              <div className="space-y-6 text-center">
                <div>
                  <h2 className="text-2xl font-bold mb-2">You're All Set!</h2>
                  <p className="text-muted-foreground">
                    Your profile has been saved.
                  </p>
                  {wizardData.experiences.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      You can add experiences later in the{" "}
                      <span className="font-medium">Entries</span> tab
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">
                    Remember: You can update your profile anytime in{" "}
                    <span className="font-medium">Settings</span> and manage all entries in the{" "}
                    <span className="font-medium">Entries</span> tab
                  </p>
                </div>

                <div className="space-y-4 pt-4">
                  <Button
                    onClick={() => handleFinish("dashboard")}
                    disabled={isSaving}
                    size="lg"
                    className="w-full"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Go to Dashboard"
                    )}
                  </Button>
                  <Button
                    onClick={() => handleFinish("create-cv")}
                    disabled={isSaving}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Create a CV"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
