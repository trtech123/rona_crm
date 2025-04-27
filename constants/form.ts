import { Layout, HelpCircle, Share2, Target, Users, Home } from "lucide-react"
import { CTAType, PostProblem, PostType } from "@/types/post"

export const FORM_STEPS = {
  QUESTIONNAIRE: 1,
  CONTENT_CREATION: 2,
  MEDIA_CREATION: 3,
  FINAL_POST: 4,
} as const

export const TABS = {
  POST_TYPE: "post-type",
  PROBLEM: "problem",
  SOCIAL_NETWORK: "social-network",
  GOALS: "goals",
  AUDIENCE: "audience",
  TEMPLATE: "template",
  PROPERTY: "property",
  CONTENT: "content",
  CTA: "cta",
} as const

export const TAB_TITLES = {
  [TABS.POST_TYPE]: "סוג הפוסט",
  [TABS.PROBLEM]: "בעיה",
  [TABS.SOCIAL_NETWORK]: "רשת חברתית",
  [TABS.GOALS]: "מטרות",
  [TABS.AUDIENCE]: "קהל יעד",
  [TABS.TEMPLATE]: "תבנית עיצוב",
  [TABS.PROPERTY]: "נכס ספציפי",
  [TABS.CONTENT]: "תוכן",
  [TABS.CTA]: "קריאה לפעולה",
} as const

export const CARD_COLORS = {
  [TABS.POST_TYPE]: "bg-blue-50",
  [TABS.PROBLEM]: "bg-purple-50",
  [TABS.SOCIAL_NETWORK]: "bg-green-50",
  [TABS.GOALS]: "bg-yellow-50",
  [TABS.AUDIENCE]: "bg-pink-50",
  [TABS.TEMPLATE]: "bg-orange-50",
  [TABS.PROPERTY]: "bg-teal-50",
} as const

export const CARD_TITLES = {
  [TABS.POST_TYPE]: "סוג הפוסט",
  [TABS.PROBLEM]: "בעיה או שאלה שהפוסט מתייחס אליה",
  [TABS.SOCIAL_NETWORK]: "רשת חברתית",
  [TABS.GOALS]: "מטרות הפוסט",
  [TABS.AUDIENCE]: "קהל יעד",
  [TABS.TEMPLATE]: "תבנית עיצוב",
  [TABS.PROPERTY]: "נכס ספציפי",
} as const

export const POST_TYPE_OPTIONS: Array<{ value: PostType; label: string }> = [
  {
    value: "property-marketing",
    label: "שיווק נכס חדש למכירה",
  },
  {
    value: "rental-marketing",
    label: "שיווק נכס להשכרה",
  },
  {
    value: "market-update",
    label: "עדכון שוק / ניתוח אזור",
  },
  {
    value: "real-estate-tip",
    label: 'טיפ בנושא נדל"ן',
  },
  {
    value: "event-promotion",
    label: "קידום אירוע (בית פתוח, וובינר)",
  },
  {
    value: "client-testimonial",
    label: "סיפור לקוח / המלצה",
  },
  {
    value: "holiday-greeting",
    label: "ברכה לחג / מועד",
  },
  {
    value: "personal-story",
    label: "סיפור אישי / היכרות",
  },
  {
    value: "question-to-audience",
    label: "שאלה לקהל",
  },
  {
    value: "other",
    label: "אחר (נא לפרט)",
  },
] as const

export const POST_PROBLEM_OPTIONS: Array<{ value: PostProblem; label: string }> = [
  {
    value: "selling-process",
    label: "קושי במכירת נכס קיים",
  },
  {
    value: "finding-property",
    label: "אתגר במציאת הנכס המתאים",
  },
  {
    value: "market-understanding",
    label: "חוסר הבנה של מצב השוק הנוכחי",
  },
  {
    value: "financing-mortgage",
    label: "התלבטות בנושאי מימון ומשכנתא",
  },
  {
    value: "investment-strategy",
    label: "שאלות לגבי אסטרטגיית השקעה",
  },
  {
    value: "legal-bureaucracy",
    label: "חשש מהבירוקרטיה וההיבטים המשפטיים",
  },
  {
    value: "no-specific-problem",
    label: "אין בעיה ספציפית, פוסט כללי / מידעי",
  },
  {
    value: "other",
    label: "אחר (נא לפרט)",
  },
] as const

export const CTA_OPTIONS: Array<{ value: CTAType; label: string }> = [
  {
    value: "link",
    label: "קישור",
  },
  {
    value: "call",
    label: "שיחת טלפון",
  },
  {
    value: "whatsapp",
    label: "WhatsApp",
  },
  {
    value: "message",
    label: "שלח הודעה",
  },
] as const 