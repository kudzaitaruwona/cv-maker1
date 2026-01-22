"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { BulletCategories } from "@/app/types/database"

const experienceSchema = z.object({
  type: z.nativeEnum(BulletCategories),
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  organisation: z.string().max(200, "organisation must be less than 200 characters").optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  is_present: z.boolean().default(false),
  location: z.string().max(200, "Location must be less than 200 characters").optional().nullable(),
  link: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
}).refine((data) => {
  if (data.start_date && data.end_date && !data.is_present) {
    return new Date(data.end_date) >= new Date(data.start_date)
  }
  return true
}, {
  message: "End date must be after start date",
  path: ["end_date"],
})

type ExperienceFormValues = z.infer<typeof experienceSchema>

interface ExperienceFormProps {
  onSubmit: (data: {
    type: BulletCategories
    title: string
    organisation?: string | null
    start_date?: string | null
    end_date?: string | null
    location?: string | null
    link?: string | null
  }) => void | Promise<void>
  onCancel?: () => void
  defaultValues?: Partial<ExperienceFormValues>
}

export function ExperienceForm({ onSubmit, onCancel, defaultValues }: ExperienceFormProps) {
  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      type: BulletCategories.Experience,
      title: "",
      organisation: null,
      start_date: null,
      end_date: null,
      is_present: false,
      location: null,
      link: null,
      ...defaultValues,
    },
  })

  const type = form.watch("type")
  const isPresent = form.watch("is_present")

  // Categories that only need a single date (award/completion date)
  const singleDateCategories = [
    BulletCategories.Projects,
    BulletCategories.Certifications,
    BulletCategories.Skills,
  ]
  const isSingleDateCategory = singleDateCategories.includes(type)
  
  // Categories that typically have links
  const linkCategories = [
    BulletCategories.Projects,
    BulletCategories.Certifications,
  ]
  const showLinkField = linkCategories.includes(type)

  const handleSubmit = (values: ExperienceFormValues) => {
    if (isSingleDateCategory) {
      // For single date categories, use end_date as the award/completion date
      // If end_date is not provided, use start_date
      const dateValue = values.end_date || values.start_date || null
      onSubmit({
        type: values.type,
        title: values.title,
        organisation: values.organisation || null,
        start_date: null,
        end_date: dateValue,
        location: values.location || null,
        link: values.link || null,
      })
    } else {
      onSubmit({
        type: values.type,
        title: values.title,
        organisation: values.organisation || null,
        start_date: values.start_date || null,
        end_date: values.is_present ? null : (values.end_date || null),
        location: values.location || null,
        link: values.link || null,
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(BulletCategories).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Software Engineer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="organisation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>organisation</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Google"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isSingleDateCategory ? (
          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date Awarded / Completion Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={field.value || form.watch("start_date") || ""}
                    onChange={(e) => {
                      field.onChange(e.target.value || null)
                      // Also update start_date for consistency
                      form.setValue("start_date", null)
                    }}
                  />
                </FormControl>
                <FormDescription>
                  The date this was awarded or completed
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        disabled={isPresent}
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_present"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Currently working here</FormLabel>
                    <FormDescription>
                      Check this if you are still in this role
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., San Francisco, CA"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showLinkField && (
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://example.com/project"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormDescription>
                  Link to the project, certification, or related resource
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex gap-3 justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">Create Entry</Button>
        </div>
      </form>
    </Form>
  )
}
