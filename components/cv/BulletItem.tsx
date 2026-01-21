"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ChevronUp, ChevronDown, Trash2, Edit2, Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { MasterBullet, CVBullet } from "@/app/types/database"
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

interface BulletItemProps {
  bullet: MasterBullet | CVBullet
  isEditing?: boolean
  onEdit?: (id: string, content: string) => void
  onDelete?: (id: string) => void
  onMoveUp?: (id: string) => void
  onMoveDown?: (id: string) => void
  showMoveButtons?: boolean
  showEditButtons?: boolean
  isEdited?: boolean // For CV bullets that differ from master
}

export function BulletItem({
  bullet,
  isEditing: initialEditing = false,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  showMoveButtons = false,
  showEditButtons = true,
  isEdited = false,
}: BulletItemProps) {
  const [isEditing, setIsEditing] = useState(initialEditing)
  const [content, setContent] = useState(bullet.content)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleSave = () => {
    if (onEdit && content.trim() !== bullet.content) {
      onEdit(bullet.id, content.trim())
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setContent(bullet.content)
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(bullet.id)
    }
    setDeleteDialogOpen(false)
  }

  if (isEditing) {
    return (
      <div className="space-y-2 p-3 rounded-md border border-input bg-card">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[80px]"
          autoFocus
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave}>
            <Check className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-start gap-3 p-3 rounded-md border border-input bg-card group">
        <div className="flex-1">
          {isEdited && (
            <Badge variant="secondary" className="mb-1 text-xs">
              Edited
            </Badge>
          )}
          <p className="text-sm leading-relaxed">{bullet.content}</p>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {showMoveButtons && onMoveUp && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onMoveUp(bullet.id)}
            >
              <ChevronUp className="h-4 w-4" />
              <span className="sr-only">Move up</span>
            </Button>
          )}
          {showMoveButtons && onMoveDown && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onMoveDown(bullet.id)}
            >
              <ChevronDown className="h-4 w-4" />
              <span className="sr-only">Move down</span>
            </Button>
          )}
          {showEditButtons && onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          )}
          {showEditButtons && onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          )}
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this bullet.
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
