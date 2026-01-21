"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  stepLabels?: string[]
}

export function StepIndicator({
  currentStep,
  totalSteps,
  stepLabels,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
        const isCompleted = step < currentStep
        const isCurrent = step === currentStep
        const stepLabel = stepLabels?.[step - 1] || `Step ${step}`

        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                  isCompleted &&
                    "bg-primary text-primary-foreground border-primary",
                  isCurrent &&
                    "bg-primary text-primary-foreground border-primary",
                  !isCompleted &&
                    !isCurrent &&
                    "bg-background border-muted-foreground text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="font-semibold">{step}</span>
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs text-center",
                  isCurrent && "font-medium text-foreground",
                  !isCurrent && "text-muted-foreground"
                )}
              >
                {stepLabel}
              </span>
            </div>
            {step < totalSteps && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2 transition-colors",
                  isCompleted ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
