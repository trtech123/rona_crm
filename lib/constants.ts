export type PostType = 'text' | 'image' | 'video' | 'carousel';

export const POST_TYPE_OPTIONS = [
  { value: 'text' as PostType, label: 'Text Post' },
  { value: 'image' as PostType, label: 'Image Post' },
  { value: 'video' as PostType, label: 'Video Post' },
  { value: 'carousel' as PostType, label: 'Carousel Post' },
] as const;

export const FORM_STEPS = {
  POST_TYPE: 1,
  CONTENT: 2,
  MEDIA: 3,
  CTA: 4,
  REVIEW: 5,
} as const;

export const SOCIAL_NETWORKS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'linkedin', label: 'LinkedIn' },
] as const;

export const CONTENT_GOALS = [
  { value: 'engagement', label: 'Increase Engagement' },
  { value: 'awareness', label: 'Brand Awareness' },
  { value: 'conversion', label: 'Drive Conversions' },
  { value: 'education', label: 'Educate Audience' },
] as const;

export const WRITING_STYLES = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'humorous', label: 'Humorous' },
  { value: 'informative', label: 'Informative' },
] as const;

export const CTA_TYPES = [
  { value: 'link', label: 'External Link' },
  { value: 'button', label: 'Button' },
  { value: 'form', label: 'Form' },
] as const; 