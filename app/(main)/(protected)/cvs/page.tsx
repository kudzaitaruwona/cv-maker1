"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CVCard } from "@/components/cv/CVCard"
import { getCVs, deleteCV } from "@/app/actions/cvs"
import type { CVWithDetails } from "@/app/types/database"
import { Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function CVsPage() {
  const router = useRouter()
  const [cvs, setCVs] = useState<CVWithDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCVs()
  }, [])

  const loadCVs = async () => {
    try {
      setLoading(true)
      const data = await getCVs()
      setCVs(data)
    } catch (error) {
      toast.error("Failed to load CVs")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteCV(id)
      toast.success("CV deleted successfully")
      loadCVs()
    } catch (error) {
      toast.error("Failed to delete CV")
      console.error(error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My CVs</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage your tailored CVs
          </p>
        </div>
        <Button asChild>
          <Link href="/cvs/new">
            <Plus className="mr-2 h-4 w-4" />
            Create New CV
          </Link>
        </Button>
      </div>

      {cvs.length === 0 ? (
        <div className="rounded-xl border-2 p-12 text-center">
          <p className="text-muted-foreground mb-4">
            No CVs yet. Create your first CV to get started.
          </p>
          <Button asChild>
            <Link href="/cvs/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First CV
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cvs.map((cv) => (
            <CVCard key={cv.id} cv={cv} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
