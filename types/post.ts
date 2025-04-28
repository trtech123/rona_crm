import { z } from "zod"

export const WritingStyleSchema = z.enum([
  "professional",
  "friendly",
  "storytelling",
  "persuasive",
  "other",
])

export const PostTypeSchema = z.enum([
  "property-marketing",
  "rental-marketing",
  "market-update",
  "real-estate-tip",
  "event-promotion",
  "client-testimonial",
  "holiday-greeting",
  "personal-story",
  "question-to-audience",
  "other",
])

export const SocialNetworkSchema = z.enum([
  "facebook",
  "instagram",
  "linkedin",
  "twitter",
  "whatsapp",
  "other",
])

export const PostProblemSchema = z.enum([
  "selling-process",
  "finding-property",
  "market-understanding",
  "financing-mortgage",
  "investment-strategy",
  "legal-bureaucracy",
  "no-specific-problem",
  "other",
])

export const CTATypeSchema = z.enum(["link", "call", "whatsapp", "message"])

export const PostFormSchema = z.object({
  step: z.number().min(1).max(4),
  socialNetwork: SocialNetworkSchema,
  contentGoal: z.string().min(1, "Please specify a content goal"),
  content: z.string().optional(),
  postType: PostTypeSchema,
  postProblem: PostProblemSchema,
  customPostProblem: z.string().optional(),
  useTemplate: z.boolean(),
  selectedTemplate: z.any().nullable(), // We'll type this properly once we know the template structure
  targetAudience: z.string().min(1, "Please specify target audience"),
  hasSpecificProperty: z.enum(["yes", "no"]),
  useExternalArticles: z.enum(["yes", "no"]),
  externalArticleLink: z.string().url().optional(),
  writingStyles: z.record(WritingStyleSchema, z.boolean()),
  customWritingStyle: z.string().optional(),
  includeCTA: z.enum(["yes", "no"]),
  ctaType: CTATypeSchema.optional(),
  ctaText: z.string().optional(),
  ctaLink: z.string().url().optional(),
  ctaPhone: z.string().regex(/^\+?[\d\s-]+$/).optional(),
  ctaWhatsappMessage: z.string().optional(),
  mediaType: z.enum(["none", "image", "video"]).default("none"),
  images: z.array(z.string()).default([]),
  videoFile: z.string().nullable().default(null),
  videoLink: z.string().url().optional(),
})

export type WritingStyle = z.infer<typeof WritingStyleSchema>
export type PostType = z.infer<typeof PostTypeSchema>
export type SocialNetwork = z.infer<typeof SocialNetworkSchema>
export type PostProblem = z.infer<typeof PostProblemSchema>
export type CTAType = z.infer<typeof CTATypeSchema>
export type PostFormData = z.infer<typeof PostFormSchema>

export const FormDataSchema = z.object({
  step: z.number(),
  postType: PostTypeSchema,
  problem: PostProblemSchema,
  socialNetwork: SocialNetworkSchema,
  goals: z.array(z.string()),
  audience: z.array(z.string()),
  template: z.string(),
  property: z.string(),
  title: z.string(),
  description: z.string(),
  content: z.string(),
  images: z.array(z.any()), // File type
  videoFile: z.any().nullable(), // File type
  videoLink: z.string(),
  ctaText: z.string(),
  ctaLink: z.string(),
})

export type FormData = z.infer<typeof FormDataSchema>

export const PostSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  authorId: z.string(),
  // CTA fields
  includeCTA: z.enum(["yes", "no"]),
  ctaType: CTATypeSchema.optional(),
  ctaText: z.string().optional(),
  ctaLink: z.string().url().optional(),
  ctaPhone: z.string().regex(/^\+?[\d\s-]+$/).optional(),
  ctaWhatsappMessage: z.string().optional(),
})

export type Post = z.infer<typeof PostSchema>

// Interface for displaying posts in the dashboard
// Combines DB fields with UI helper fields
export interface PostDisplayData extends Post {
  id: string; // uuid from posts table (already in Post type)
  user_id?: string; // uuid from posts table (add if needed, not in base Post type)
  content: string; // text (already in Post type)
  platform?: string; // text
  created_at: string; // timestamptz (use createdAt from base Post type)
  updated_at?: string; // timestamptz (use updatedAt from base Post type)
  scheduled_at?: string; // timestamptz
  published?: boolean;
  published_at?: string;
  hashtags?: string[]; // array
  suggested_image_prompt?: string; // text
  suggested_cta?: string; // text
  // Helper properties
  platformColor?: string;
  icon?: React.ElementType;
} 