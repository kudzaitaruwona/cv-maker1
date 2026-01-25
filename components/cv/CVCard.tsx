"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"
import type { CVWithDetails } from "@/app/types/database"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"

interface CVCardProps {
  cv: CVWithDetails
  onDelete?: (id: string) => void
}

export function CVCard({ cv, onDelete }: CVCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(cv.id)
    }
    setDeleteDialogOpen(false)
  }

  return (
    <>
      <Card className="rounded-xl border-2 shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">
                <Link 
                  href={`/cvs/${cv.id}`}
                  className="hover:underline"
                >
                  {cv.title}
                </Link>
              </CardTitle>
              {cv.target_position && (
                <CardDescription>
                  {cv.target_position.title}
                  {cv.target_position.company && ` at ${cv.target_position.company}`}
                </CardDescription>
              )}
            </div>
            {cv.ats_score?.score !== null && cv.ats_score?.score !== undefined && (
              <Badge variant="outline" className="text-sm">
                ATS: {cv.ats_score.score}%
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-4">
          <div className="text-xs text-muted-foreground">
            Created {formatDate(cv.created_at)}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" asChild>
              <Link href={`/cvs/${cv.id}`}>Edit</Link>
            </Button>
            {onDelete && (
              <Button
                variant="destructive"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  setDeleteDialogOpen(true)
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the CV{" "}
              <span className="font-medium">"{cv.title}"</span> and all its content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
