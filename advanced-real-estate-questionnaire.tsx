"use client"

import { CardContent } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Mic, Check, ChevronDown, ChevronLeft, ChevronRight, Camera, X, Info, Sparkles, Save } from "lucide-react"

// Define form schema with Zod (same as before)
const formSchema = z.object({
  // All the same fields as before
  fullName: z.string().min(2, { message: "שם מלא נדרש" }),
  businessName: z.string().min(2, { message: "שם העסק נדרש" }),
  profession: z.string({ required_error: "תחום עיסוק נדרש" }),
  otherProfession: z.string().optional(),
  areas: z.array(z.string()).min(1, { message: "יש לבחור לפחות אזור אחד" }),
  specificCities: z.array(z.string()).optional(),
  otherArea: z.string().optional(),
  website: z.string().optional(),
  facebookUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  youtubeUrl: z.string().optional(),
  tiktokUrl: z.string().optional(),
  googleBusinessUrl: z.string().optional(),
  otherProfiles: z.string().optional(),
  logo: z.any().optional(),
  profilePicture: z.any().optional(),
  selfPresentation: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  otherSpecialty: z.string().optional(),
  differentiators: z.array(z.string()).optional(),
  otherDifferentiator: z.string().optional(),
  values: z.array(z.string()).optional(),
  otherValue: z.string().optional(),
  communicationStyle: z.string().optional(),
  otherCommunicationStyle: z.string().optional(),
  commonPhrases: z.string().optional(),
  dislikedPhrases: z.array(z.string()).optional(),
  otherDislikedPhrase: z.string().optional(),
  clientFeedback: z.string().optional(),
  unwantedAssociations: z.array(z.string()).optional(),
  otherUnwantedAssociation: z.string().optional(),
  brandPersonality: z.string().optional(),
  otherBrandPersonality: z.string().optional(),
  brandVibe: z.array(z.string()).optional(),
  otherBrandVibe: z.string().optional(),
  formalityLevel: z.number().optional(),
  idealClient: z.array(z.string()).optional(),
  otherIdealClient: z.string().optional(),
  clientConcerns: z.array(z.string()).optional(),
  otherClientConcern: z.string().optional(),
  contentGoals: z.array(z.string()).optional(),
  otherContentGoal: z.string().optional(),
  contentTypes: z.array(z.string()).optional(),
  otherContentType: z.string().optional(),
  faq: z.string().optional(),
  processSteps: z.string().optional(),
  clientAge: z.array(z.string()).optional(),
  otherClientAge: z.string().optional(),
  clientIncome: z.array(z.string()).optional(),
  otherClientIncome: z.string().optional(),
  clientMotivation: z.array(z.string()).optional(),
  otherClientMotivation: z.string().optional(),
  propertyTypes: z.array(z.string()).optional(),
  otherPropertyType: z.string().optional(),
  projectTypes: z.array(z.string()).optional(),
  otherProjectType: z.string().optional(),
  hasFixedProperties: z.boolean().optional(),
  fixedPropertiesDetails: z.string().optional(),
  preferredAreas: z.array(z.string()).optional(),
  otherPreferredArea: z.string().optional(),
  areaFeatures: z.array(z.string()).optional(),
  otherAreaFeature: z.string().optional(),
  hasLeadDatabase: z.boolean().optional(),
  propertyPriceRange: z.array(z.string()).optional(),
  otherPropertyPriceRange: z.string().optional(),
  propertyStyle: z.array(z.string()).optional(),
  otherPropertyStyle: z.string().optional(),
  professionalBackground: z.string().optional(),
  realEstateJourney: z.string().optional(),
  favoriteAspect: z.string().optional(),
  proudProject: z.string().optional(),
  learnedMistake: z.string().optional(),
  emotionalFeedback: z.string().optional(),
  hasReturningClients: z.boolean().optional(),
  returningClientsDetails: z.string().optional(),
  personalStyle: z.array(z.string()).optional(),
  otherPersonalStyle: z.string().optional(),
  successStory: z.string().optional(),
  digitalPresence: z.array(z.string()).optional(),
  otherDigitalPresence: z.string().optional(),
  publishingFrequency: z.string().optional(),
  otherPublishingFrequency: z.string().optional(),
  preferredContentStyle: z.array(z.string()).optional(),
  otherContentStyle: z.string().optional(),
  hasExistingContent: z.boolean().optional(),
  hasOwnDatabase: z.boolean().optional(),
  databaseDetails: z.string().optional(),
  externalSources: z.array(z.string()).optional(),
  otherExternalSource: z.string().optional(),
  collaborators: z.array(z.string()).optional(),
  otherCollaborator: z.string().optional(),
  successfulContent: z.string().optional(),
  desiredFeelings: z.array(z.string()).optional(),
  otherDesiredFeeling: z.string().optional(),
  unwantedContent: z.array(z.string()).optional(),
  otherUnwantedContent: z.string().optional(),
  contentTone: z.array(z.string()).optional(),
  otherContentTone: z.string().optional(),
  visualPreference: z.array(z.string()).optional(),
  otherVisualPreference: z.string().optional(),
  contentGoal: z.string().optional(),
  keyHighlights: z.string().optional(),
  additionalInfo: z.string().optional(),
})

// All the options arrays remain the same as in the original code
// professionOptions, areaOptions, allCities, etc.

// Define all the options arrays (same as before)
const professionOptions = [
  { value: "realEstateAgent", label: "סוכן נדל״ן", icon: "🏢", description: "תיווך וייעוץ בקניה ומכירה של נכסים" },
  { value: "developer", label: "יזם", icon: "🏗️", description: "ייזום ופיתוח פרויקטים בתחום הנדל״ן" },
  { value: "architect", label: "אדריכל", icon: "📐", description: "תכנון ועיצוב מבנים ומרחבים" },
  { value: "interiorDesigner", label: "מעצב פנים", icon: "🎨", description: "עיצוב חללים פנימיים ואסתטיקה" },
  { value: "realEstateLawyer", label: "עו״ד מקרקעין", icon: "⚖️", description: "ייעוץ משפטי בענייני נדל״ן" },
  { value: "propertyManager", label: "מנהל נכסים", icon: "🔑", description: "ניהול ותחזוקה של נכסים" },
  { value: "appraiser", label: "שמאי", icon: "📊", description: "הערכת שווי נכסים ומקרקעין" },
  { value: "taxConsultant", label: "יועץ מיסוי", icon: "💰", description: "ייעוץ בענייני מיסוי נדל״ן" },
  { value: "projectMarketer", label: "משווק פרויקטים", icon: "📢", description: "שיווק פרויקטים חדשים בתחום הנדל״ן" },
  { value: "other", label: "אחר", icon: "✨", description: "תחום אחר הקשור לנדל״ן" },
]

const areaOptions = [
  { value: "nationwide", label: "כל הארץ", icon: "🇮🇱", description: "פעילות בכל רחבי הארץ" },
  { value: "north", label: "צפון", icon: "🌲", description: "אזור הצפון" },
  { value: "haifa", label: "חיפה והסביבה", icon: "⛰️", description: "חיפה והקריות" },
  { value: "sharon", label: "השרון", icon: "🌳", description: "אזור השרון" },
  { value: "center", label: "מרכז", icon: "🏙️", description: "אזור המרכז" },
  { value: "telAviv", label: "תל אביב", icon: "🏙️", description: "תל אביב והסביבה" },
  { value: "jerusalem", label: "ירושלים", icon: "🕍", description: "ירושלים והסביבה" },
  { value: "south", label: "דרום", icon: "🏜️", description: "אזור הדרום" },
  { value: "other", label: "אחר", icon: "📍", description: "אזור אחר בישראל" },
]

// Combine all cities into one array for searchable dropdown
const allCities = [
  // North
  { value: "karmiel", label: "כרמיאל", area: "north" },
  { value: "nahariya", label: "נהריה", area: "north" },
  { value: "akko", label: "עכו", area: "north" },
  { value: "tzfat", label: "צפת", area: "north" },
  { value: "kiryatShmona", label: "קרית שמונה", area: "north" },
  { value: "tiberias", label: "טבריה", area: "north" },
  { value: "afula", label: "עפולה", area: "north" },
  { value: "nazareth", label: "נצרת", area: "north" },
  { value: "migdalHaemek", label: "מגדל העמק", area: "north" },
  { value: "yokneam", label: "יקנעם", area: "north" },
  { value: "maaalot", label: "מעלות-תרשיחא", area: "north" },
  { value: "beitShean", label: "בית שאן", area: "north" },
  { value: "roshPina", label: "ראש פינה", area: "north" },
  // Haifa
  { value: "haifa", label: "חיפה", area: "haifa" },
  { value: "kiryatAta", label: "קרית אתא", area: "haifa" },
  { value: "kiryatBialik", label: "קרית ביאליק", area: "haifa" },
  { value: "kiryatYam", label: "קרית ים", area: "haifa" },
  { value: "kiryatMoztkin", label: "קרית מוצקין", area: "haifa" },
  { value: "nesherZiona", label: "נשר", area: "haifa" },
  { value: "tiratCarmel", label: "טירת כרמל", area: "haifa" },
  { value: "daliyatAlCarmel", label: "דלית אל כרמל", area: "haifa" },
  { value: "isfiya", label: "עספיא", area: "haifa" },
  { value: "haifaBay", label: "מפרץ חיפה", area: "haifa" },
  // Sharon
  { value: "netanya", label: "נתניה", area: "sharon" },
  { value: "raanana", label: "רעננה", area: "sharon" },
  { value: "herzliya", label: "הרצליה", area: "sharon" },
  { value: "kfarSaba", label: "כפר סבא", area: "sharon" },
  { value: "hod", label: "הוד השרון", area: "sharon" },
  { value: "ramatHasharon", label: "רמת השרון", area: "sharon" },
  { value: "taibe", label: "טייבה", area: "sharon" },
  { value: "tira", label: "טירה", area: "sharon" },
  { value: "kfarYona", label: "כפר יונה", area: "sharon" },
  { value: "kadima", label: "קדימה-צורן", area: "sharon" },
  { value: "evenYehuda", label: "אבן יהודה", area: "sharon" },
  { value: "pardesHana", label: "פרדס חנה-כרכור", area: "sharon" },
  { value: "binyamina", label: "בנימינה-גבעת עדה", area: "sharon" },
  { value: "zichron", label: "זכרון יעקב", area: "sharon" },
  // Center
  { value: "petahTikva", label: "פתח תקווה", area: "center" },
  { value: "rishon", label: "ראשון לציון", area: "center" },
  { value: "rehovot", label: "רחובות", area: "center" },
  { value: "modiin", label: "מודיעין", area: "center" },
  { value: "lod", label: "לוד", area: "center" },
  { value: "ramla", label: "רמלה", area: "center" },
  { value: "ness", label: "נס ציונה", area: "center" },
  { value: "yavne", label: "יבנה", area: "center" },
  { value: "gedera", label: "גדרה", area: "center" },
  { value: "rosh", label: "ראש העין", area: "center" },
  { value: "elad", label: "אלעד", area: "center" },
  { value: "shoham", label: "שוהם", area: "center" },
  { value: "ganYavne", label: "גן יבנה", area: "center" },
  { value: "beerYaakov", label: "באר יעקב", area: "center" },
  { value: "mazkeret", label: "מזכרת בתיה", area: "center" },
  // Tel Aviv
  { value: "telAviv", label: "תל אביב", area: "telAviv" },
  { value: "ramatGan", label: "רמת גן", area: "telAviv" },
  { value: "givatayim", label: "גבעתיים", area: "telAviv" },
  { value: "holon", label: "חולון", area: "telAviv" },
  { value: "batYam", label: "בת ים", area: "telAviv" },
  { value: "bnei", label: "בני ברק", area: "telAviv" },
  { value: "azor", label: "אזור", area: "telAviv" },
  { value: "kiriatOno", label: "קרית אונו", area: "telAviv" },
  { value: "orYehuda", label: "אור יהודה", area: "telAviv" },
  { value: "yahud", label: "יהוד-מונוסון", area: "telAviv" },
  // Jerusalem
  { value: "jerusalem", label: "ירושלים", area: "jerusalem" },
  { value: "beitShemesh", label: "בית שמש", area: "jerusalem" },
  { value: "maalehAdumim", label: "מעלה אדומים", area: "jerusalem" },
  { value: "beitar", label: "ביתר עילית", area: "jerusalem" },
  { value: "givat", label: "גבעת זאב", area: "jerusalem" },
  { value: "efrat", label: "אפרת", area: "jerusalem" },
  { value: "mevasseret", label: "מבשרת ציון", area: "jerusalem" },
  { value: "tzurHadassah", label: "צור הדסה", area: "jerusalem" },
  { value: "abuGosh", label: "אבו גוש", area: "jerusalem" },
  { value: "motza", label: "מוצא עילית", area: "jerusalem" },
  // South
  { value: "beerSheva", label: "באר שבע", area: "south" },
  { value: "ashdod", label: "אשדוד", area: "south" },
  { value: "ashkelon", label: "אשקלון", area: "south" },
  { value: "eilat", label: "אילת", area: "south" },
  { value: "dimona", label: "דימונה", area: "south" },
  { value: "kiryatGat", label: "קרית גת", area: "south" },
  { value: "kiryatMalachi", label: "קרית מלאכי", area: "south" },
  { value: "sderot", label: "שדרות", area: "south" },
  { value: "netivot", label: "נתיבות", area: "south" },
  { value: "ofakim", label: "אופקים", area: "south" },
  { value: "arad", label: "ערד", area: "south" },
  { value: "yeruham", label: "ירוחם", area: "south" },
  { value: "mitzpeRamon", label: "מצפה רמון", area: "south" },
  { value: "rahat", label: "רהט", area: "south" },
]

const brandPersonalityOptions = [
  {
    value: "trustworthy",
    label: "אמין ומקצועי",
    icon: "🤝",
    description: "מעורר אמון ומשדר מקצועיות",
    color: "bg-blue-100 border-blue-300",
  },
  {
    value: "innovative",
    label: "חדשני ופורץ דרך",
    icon: "💡",
    description: "מוביל חדשנות ופתרונות מקוריים",
    color: "bg-purple-100 border-purple-300",
  },
  {
    value: "friendly",
    label: "חברותי ונגיש",
    icon: "😊",
    description: "גישה אישית וחמה ללקוחות",
    color: "bg-green-100 border-green-300",
  },
  {
    value: "luxurious",
    label: "יוקרתי ואקסקלוסיבי",
    icon: "✨",
    description: "מתמחה בחוויות ונכסים יוקרתיים",
    color: "bg-amber-100 border-amber-300",
  },
  {
    value: "traditional",
    label: "מסורתי ויציב",
    icon: "🏛️",
    description: "ערכים מסורתיים ויציבות לאורך זמן",
    color: "bg-red-100 border-red-300",
  },
  {
    value: "other",
    label: "אחר",
    icon: "✨",
    description: "אישיות מותג אחרת",
    color: "bg-gray-100 border-gray-300",
  },
]

const brandVibeOptions = [
  { value: "professional", label: "מקצועי", icon: "👔", color: "bg-blue-100 border-blue-300" },
  { value: "warm", label: "חם ואישי", icon: "☀️", color: "bg-orange-100 border-orange-300" },
  { value: "modern", label: "מודרני", icon: "🔷", color: "bg-indigo-100 border-indigo-300" },
  { value: "exclusive", label: "אקסקלוסיבי", icon: "💎", color: "bg-purple-100 border-purple-300" },
  { value: "energetic", label: "אנרגטי", icon: "⚡", color: "bg-yellow-100 border-yellow-300" },
  { value: "calm", label: "רגוע", icon: "🌊", color: "bg-teal-100 border-teal-300" },
  { value: "bold", label: "נועז", icon: "🔥", color: "bg-red-100 border-red-300" },
  { value: "minimalist", label: "מינימליסטי", icon: "◻️", color: "bg-gray-100 border-gray-300" },
  { value: "other", label: "אחר", icon: "✨", color: "bg-gray-100 border-gray-300" },
]

const specialtyOptions = [
  {
    value: "luxuryProperties",
    label: "נכסי יוקרה",
    icon: "💎",
    description: "דירות ובתים יוקרתיים במיקומים מבוקשים",
    color: "bg-purple-100 border-purple-300",
  },
  {
    value: "investments",
    label: "נכסי השקעה",
    icon: "📈",
    description: "נכסים עם פוטנציאל תשואה גבוה למשקיעים",
    color: "bg-green-100 border-green-300",
  },
  {
    value: "firstTimeHomebuyers",
    label: "רוכשים ראשונים",
    icon: "🏠",
    description: "ליווי וייעוץ לרוכשי דירה ראשונה",
    color: "bg-blue-100 border-blue-300",
  },
  {
    value: "commercialProperties",
    label: "נכסים מסחריים",
    icon: "🏪",
    description: "חנויות, משרדים ושטחי מסחר",
    color: "bg-amber-100 border-amber-300",
  },
  {
    value: "urbanRenewal",
    label: "התחדשות עירונית",
    icon: "🏙️",
    description: "פרויקטים של פינוי-בינוי ותמ״א 38",
    color: "bg-red-100 border-red-300",
  },
  {
    value: "landParcels",
    label: "מגרשים",
    icon: "🌄",
    description: "קרקעות ומגרשים לבנייה",
    color: "bg-teal-100 border-teal-300",
  },
  {
    value: "foreignResidents",
    label: "תושבי חוץ",
    icon: "✈️",
    description: "שירותים מותאמים לתושבי חוץ המעוניינים בנכסים בישראל",
    color: "bg-indigo-100 border-indigo-300",
  },
  {
    value: "other",
    label: "אחר",
    icon: "✨",
    description: "התמחות אחרת בתחום הנדל״ן",
    color: "bg-gray-100 border-gray-300",
  },
]

// All other option arrays remain the same as in the original code
// ...

// Example text for open-ended questions
const selfPresentationExamples = [
  "אני סוכן נדל״ן עם 10 שנות ניסיון בשוק התל אביבי, מתמחה בדירות יוקרה ונכסים להשקעה.",
  "אני מלווה משפחות במסע לרכישת הבית הראשון שלהן, עם דגש על אזורים מתפתחים.",
  "כיועץ נדל״ן, אני מתמחה בהשקעות חכמות עם תשואה גבוהה לטווח ארוך.",
]

const professionalBackgroundExamples = [
  "התחלתי את דרכי בתחום הנדל״ן לפני 15 שנה, לאחר קריירה בתחום הפיננסים.",
  "אני בעל תואר בכלכלה ונדל״ן, ועבדתי במשרדי תיווך מובילים לפני שפתחתי את העסק שלי.",
  "הגעתי לתחום הנדל״ן מתוך אהבה לאדריכלות ועיצוב, ומאז צברתי מומחיות בנכסים ייחודיים.",
]

const contentGoalExamples = [
  "להגדיל את מספר הלידים האיכותיים ולבנות מאגר לקוחות פוטנציאליים.",
  "לבסס את המותג שלי כמומחה בתחום הנדל״ן באזור ספציפי.",
  "לחנך את השוק לגבי תהליכי רכישה/מכירה ולהפחית חששות של לקוחות.",
]

const keyHighlightsExamples = [
  "מומחיות בנכסי יוקרה באזור תל אביב והסביבה עם ניסיון של למעלה מ-10 שנים.",
  "שירות אישי ומותאם לכל לקוח, כולל ליווי צמוד לאורך כל התהליך.",
  'רשת קשרים ענפה בתחום הנדל"ן המאפשרת גישה לנכסים שאינם בשוק הפתוח.',
]

// Define the main sections of the questionnaire
const sections = [
  {
    id: "intro",
    title: "ברוכים הבאים",
    icon: "👋",
    color: "bg-gradient-to-br from-purple-500 to-indigo-600",
  },
  {
    id: "generalDetails",
    title: "פרטים כלליים",
    icon: "👤",
    color: "bg-gradient-to-br from-blue-500 to-cyan-600",
  },
  {
    id: "digitalLinks",
    title: "קישורים דיגיטליים",
    icon: "🔗",
    color: "bg-gradient-to-br from-green-500 to-teal-600",
  },
  {
    id: "brandIdentity",
    title: "זהות מותג",
    icon: "🎯",
    color: "bg-gradient-to-br from-amber-500 to-orange-600",
  },
  {
    id: "targetAudience",
    title: "קהל יעד",
    icon: "👥",
    color: "bg-gradient-to-br from-pink-500 to-rose-600",
  },
  {
    id: "propertiesAndProjects",
    title: "נכסים ופרויקטים",
    icon: "🏢",
    color: "bg-gradient-to-br from-violet-500 to-purple-600",
  },
  {
    id: "personalStory",
    title: "סיפור אישי",
    icon: "📖",
    color: "bg-gradient-to-br from-red-500 to-pink-600",
  },
  {
    id: "digitalMarketing",
    title: "שיווק דיגיטלי",
    icon: "📱",
    color: "bg-gradient-to-br from-blue-500 to-indigo-600",
  },
  {
    id: "summary",
    title: "סיכום",
    icon: "✅",
    color: "bg-gradient-to-br from-green-500 to-emerald-600",
  },
]

// Define the questions for each section
const questions = {
  intro: [
    {
      id: "welcome",
      type: "info",
      title: "ברוכים הבאים לשאלון השיווק שלנו",
      description: "השאלון יעזור לנו להבין את הצרכים שלך ולבנות אסטרטגיית שיווק מותאמת אישית.",
    },
  ],
  generalDetails: [
    {
      id: "fullName",
      type: "text",
      title: "שם מלא",
      required: true,
    },
    {
      id: "businessName",
      type: "text",
      title: "שם העסק",
      required: true,
    },
    {
      id: "profession",
      type: "select-card",
      title: "תחום עיסוק",
      options: professionOptions,
      required: true,
      multiple: false,
    },
    {
      id: "otherProfession",
      type: "text",
      title: "פרט תחום עיסוק אחר",
      condition: (data) => data.profession === "other",
    },
    {
      id: "areas",
      type: "select-card",
      title: "אזורי פעילות",
      options: areaOptions,
      required: true,
      multiple: true,
    },
    {
      id: "specificCities",
      type: "select-cities",
      title: "ערים ספציפיות",
      options: allCities,
      condition: (data) => data.areas && data.areas.some((area) => area !== "nationwide" && area !== "other"),
      multiple: true,
    },
  ],
  digitalLinks: [
    {
      id: "website",
      type: "text",
      title: "אתר אינטרנט",
      placeholder: "https://www.example.com",
    },
    {
      id: "socialMedia",
      type: "social-links",
      title: "רשתות חברתיות",
      fields: [
        { id: "facebookUrl", icon: "facebook", placeholder: "כתובת עמוד הפייסבוק" },
        { id: "instagramUrl", icon: "instagram", placeholder: "כתובת עמוד האינסטגרם" },
        { id: "linkedinUrl", icon: "linkedin", placeholder: "כתובת פרופיל הלינקדאין" },
        { id: "youtubeUrl", icon: "youtube", placeholder: "כתובת ערוץ היוטיוב" },
        { id: "tiktokUrl", icon: "tiktok", placeholder: "כתובת חשבון הטיקטוק" },
      ],
    },
    {
      id: "otherProfiles",
      type: "textarea",
      title: "קישורים נוספים",
      placeholder: "הזן כל קישור בשורה נפרדת",
    },
    {
      id: "mediaUpload",
      type: "media-upload",
      title: "העלאת מדיה",
      fields: [
        { id: "logo", title: "לוגו", accept: "image/*" },
        { id: "profilePicture", title: "תמונת פרופיל", accept: "image/*" },
      ],
    },
  ],
  brandIdentity: [
    {
      id: "selfPresentation",
      type: "textarea-with-examples",
      title: "הצגה עצמית",
      placeholder: "תאר את עצמך בכמה משפטים",
      examples: selfPresentationExamples,
    },
    {
      id: "brandPersonality",
      type: "select-card",
      title: "אישיות המותג",
      options: brandPersonalityOptions,
      multiple: false,
    },
    {
      id: "otherBrandPersonality",
      type: "text",
      title: "פרט אישיות מותג אחרת",
      condition: (data) => data.brandPersonality === "other",
    },
    {
      id: "brandVibe",
      type: "select-card",
      title: "אווירת המותג",
      options: brandVibeOptions,
      multiple: true,
    },
    {
      id: "otherBrandVibe",
      type: "text",
      title: "פרט אווירת מותג אחרת",
      condition: (data) => data.brandVibe && data.brandVibe.includes("other"),
    },
    {
      id: "specialties",
      type: "select-card",
      title: "התמחויות",
      options: specialtyOptions,
      multiple: true,
    },
    {
      id: "otherSpecialty",
      type: "text",
      title: "פרט התמחות אחרת",
      condition: (data) => data.specialties && data.specialties.includes("other"),
    },
    {
      id: "formalityLevel",
      type: "slider",
      title: "רמת פורמליות",
      min: 1,
      max: 5,
      labels: ["לא פורמלי 😊", "פורמלי מאוד 🧐"],
      emojis: ["😄", "🙂", "😐", "🧐", "🎩"],
    },
  ],
  // Continue with other sections...
}

// Component for rendering a card-based selection
const CardSelector = ({ options, value, onChange, multiple = false, compact = false }) => {
  if (!value && multiple) {
    value = []
  }

  const isSelected = (optionValue) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(optionValue)
    } else {
      return value === optionValue
    }
  }

  const handleSelect = (optionValue) => {
    if (multiple) {
      if (isSelected(optionValue)) {
        onChange(value.filter((v) => v !== optionValue))
      } else {
        onChange([...(value || []), optionValue])
      }
    } else {
      onChange(optionValue)
    }
  }

  return (
    <div className={`grid ${compact ? "grid-cols-2 md:grid-cols-4 gap-2" : "grid-cols-1 md:grid-cols-3 gap-3"}`}>
      {options.map((option) => (
        <motion.div
          key={option.value}
          className={`${option.color || "bg-gray-100"} border rounded-lg ${
            compact ? "py-2 px-1" : "p-3"
          } flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-md ${
            isSelected(option.value)
              ? "border-purple-500 ring-2 ring-purple-300 shadow-sm"
              : "border-gray-200 hover:border-purple-300"
          }`}
          onClick={() => handleSelect(option.value)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className={`text-xl ${compact ? "mb-1" : "mb-2"}`}>{option.icon}</span>
          <span className={`font-medium text-center ${compact ? "text-sm" : ""}`}>{option.label}</span>
          {!compact && <span className="text-xs text-center mt-1 text-gray-600">{option.description}</span>}
          {isSelected(option.value) && (
            <motion.div
              className="absolute top-1 right-1 bg-purple-500 text-white rounded-full p-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Check className="h-3 w-3" />
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

// Component for rendering a text field with examples
const TextFieldWithExamples = ({ value, onChange, examples, placeholder, isRecording, toggleRecording }) => {
  const selectExample = (example) => {
    // Update field value
    const currentValue = value || ""
    const newValue = currentValue ? `${currentValue}\n${example}` : example
    onChange(newValue)
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <Textarea
          placeholder={placeholder}
          className="min-h-[120px] pr-10"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <Button
          type="button"
          variant={isRecording ? "destructive" : "outline"}
          size="icon"
          className="absolute bottom-3 left-3"
          onClick={toggleRecording}
        >
          <Mic className={`h-4 w-4 ${isRecording ? "animate-pulse" : ""}`} />
        </Button>
      </div>
      <div className="mt-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-center">
              ראה דוגמאות
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandList>
                <CommandGroup>
                  {examples.map((example, index) => (
                    <CommandItem key={index} onSelect={() => selectExample(example)} className="flex items-center">
                      <div className="flex-1">{example}</div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

// Component for rendering a city selector
const CitySelector = ({ value, onChange, options, selectedAreas }) => {
  const filteredCities = options.filter((city) => selectedAreas.includes(city.area))

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-full justify-between">
          {value && value.length > 0 ? `${value.length} ערים נבחרו` : "בחר ערים"}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="חפש עיר..." />
          <CommandList>
            <CommandEmpty>לא נמצאו ערים</CommandEmpty>
            {selectedAreas.map((area) => (
              <CommandGroup key={area} heading={areaOptions.find((opt) => opt.value === area)?.label}>
                {filteredCities
                  .filter((city) => city.area === area)
                  .map((city) => (
                    <CommandItem
                      key={city.value}
                      onSelect={() => {
                        const newValues = value || []
                        const updatedValues = newValues.includes(city.value)
                          ? newValues.filter((v) => v !== city.value)
                          : [...newValues, city.value]
                        onChange(updatedValues)
                      }}
                    >
                      <div className="flex items-center">
                        <div
                          className={`mr-2 h-4 w-4 rounded-sm border ${
                            value?.includes(city.value) ? "bg-purple-500 text-white" : "border-gray-300"
                          }`}
                        >
                          {value?.includes(city.value) && <Check className="h-3 w-3 text-white" />}
                        </div>
                        {city.label}
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// Component for rendering social media links
const SocialMediaLinks = ({ values, onChange }) => {
  const socialIcons = {
    facebook: (
      <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    instagram: (
      <svg className="h-5 w-5 text-pink-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
      </svg>
    ),
    linkedin: (
      <svg className="h-5 w-5 text-blue-700" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    youtube: (
      <svg className="h-5 w-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    tiktok: (
      <svg className="h-5 w-5 text-black" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  }

  return (
    <div className="space-y-4">
      {Object.keys(socialIcons).map((platform) => {
        const fieldId = `${platform}Url`
        return (
          <div key={fieldId} className="flex items-center space-x-3 space-x-reverse">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
              {socialIcons[platform]}
            </div>
            <Input
              placeholder={`כתובת ${platform}`}
              value={values[fieldId] || ""}
              onChange={(e) => onChange({ ...values, [fieldId]: e.target.value })}
              className="flex-grow"
            />
          </div>
        )
      })}
    </div>
  )
}

// Component for rendering media upload
const MediaUpload = ({ fields, values, onChange }) => {
  const handleFileChange = (fieldId, file) => {
    onChange({ ...values, [fieldId]: file })
  }

  return (
    <div className="space-y-6">
      {fields.map((field) => (
        <div key={field.id} className="space-y-2">
          <FormLabel className="font-medium">{field.title}</FormLabel>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="flex flex-col items-center">
              {values[field.id] ? (
                <div className="mb-4 relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 mb-2">
                    {values[field.id] instanceof File && (
                      <img
                        src={URL.createObjectURL(values[field.id]) || "/placeholder.svg"}
                        alt={field.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <p className="text-sm text-green-600">הקובץ הועלה בהצלחה</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="absolute top-0 right-0 bg-white"
                    onClick={() => handleFileChange(field.id, null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    {field.id === "logo" ? (
                      <svg
                        className="h-8 w-8 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                      </svg>
                    ) : (
                      <Camera className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <p className="text-gray-500 mb-2">גרור ושחרר קובץ כאן</p>
                  <p className="text-gray-500 mb-4">או</p>
                </>
              )}
              <Input
                type="file"
                accept={field.accept}
                className="hidden"
                id={`${field.id}-upload`}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handleFileChange(field.id, file)
                  }
                }}
              />
              <label
                htmlFor={`${field.id}-upload`}
                className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md"
              >
                בחר קובץ
              </label>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">פורמטים מומלצים: PNG, JPG, SVG. גודל מקסימלי: 2MB</p>
        </div>
      ))}
    </div>
  )
}

// Component for rendering a slider
const SliderControl = ({ value, onChange, min, max, labels, emojis }) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span>{labels[0]}</span>
        <span>{labels[1]}</span>
      </div>
      <div className="flex justify-between space-x-2 rtl:space-x-reverse">
        {Array.from({ length: max - min + 1 }).map((_, index) => {
          const level = min + index
          return (
            <div
              key={level}
              className={`flex-1 flex flex-col items-center cursor-pointer transition-all ${
                value === level ? "scale-110" : ""
              }`}
              onClick={() => onChange(level)}
            >
              <div className={`text-xl mb-2 ${value === level ? "animate-bounce" : ""}`}>{emojis[index]}</div>
              <div
                className={`w-full h-10 rounded-md border-2 ${
                  value === level
                    ? "bg-purple-100 border-purple-500"
                    : "bg-gray-100 border-gray-300 hover:border-purple-300 hover:bg-purple-50"
                }`}
              ></div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Main questionnaire component
export default function AdvancedRealEstateQuestionnaire() {
  const [currentSection, setCurrentSection] = useState("intro")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isRecording, setIsRecording] = useState({})
  const [showSectionNav, setShowSectionNav] = useState(false)
  const [savedData, setSavedData] = useState({})
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      businessName: "",
      profession: "",
      areas: [],
      specificCities: [],
      // ... other default values
    },
  })

  const formValues = form.watch()

  // Calculate total questions and progress
  const totalQuestions = Object.values(questions).flat().length
  const answeredQuestions = Object.keys(formValues).filter((key) => {
    const value = formValues[key]
    return (
      (Array.isArray(value) && value.length > 0) ||
      (typeof value === "string" && value.trim() !== "") ||
      typeof value === "number" ||
      typeof value === "boolean" ||
      value instanceof File
    )
  }).length

  useEffect(() => {
    const calculatedProgress = (answeredQuestions / totalQuestions) * 100
    setProgress(calculatedProgress)
  }, [answeredQuestions, totalQuestions])

  const currentQuestions = questions[currentSection] || []
  const currentQuestion = currentQuestions[currentQuestionIndex]

  const handleNext = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Find the next section
      const sectionIndex = sections.findIndex((s) => s.id === currentSection)
      if (sectionIndex < sections.length - 1) {
        setCurrentSection(sections[sectionIndex + 1].id)
        setCurrentQuestionIndex(0)
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    } else {
      // Find the previous section
      const sectionIndex = sections.findIndex((s) => s.id === currentSection)
      if (sectionIndex > 0) {
        setCurrentSection(sections[sectionIndex - 1].id)
        setCurrentQuestionIndex(questions[sections[sectionIndex - 1].id].length - 1)
      }
    }
  }

  const toggleRecording = (field) => {
    setIsRecording((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const saveProgress = () => {
    setSavedData(formValues)
    setShowSaveConfirmation(true)
    setTimeout(() => {
      setShowSaveConfirmation(false)
    }, 3000)
  }

  // Render the current question based on its type
  const renderQuestion = (question) => {
    if (!question) return null

    // Skip questions that don't meet their condition
    if (question.condition && !question.condition(formValues)) {
      return null
    }

    switch (question.type) {
      case "info":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-4"
          >
            <div className="w-24 h-24 mx-auto">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="#8b5cf6" />
                <circle cx="35" cy="40" r="8" fill="#fff" />
                <circle cx="65" cy="40" r="8" fill="#fff" />
                <circle cx="35" cy="40" r="4" fill="#000" />
                <circle cx="65" cy="40" r="4" fill="#000" />
                <path d="M40 60 Q50 70 60 60" stroke="#fff" strokeWidth="3" fill="none" />
                <path d="M25 25 L35 15" stroke="#f472b6" strokeWidth="3" />
                <path d="M75 25 L65 15" stroke="#f472b6" strokeWidth="3" />
                <path d="M20 50 L10 45" stroke="#fb923c" strokeWidth="3" />
                <path d="M80 50 L90 45" stroke="#fb923c" strokeWidth="3" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">{question.title}</h2>
            <p className="text-gray-600">{question.description}</p>
          </motion.div>
        )
      case "text":
        return (
          <FormField
            control={form.control}
            name={question.id}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">
                  {question.title}
                  {question.required && (
                    <Badge variant="outline" className="mr-2 font-normal">
                      שדה חובה
                    </Badge>
                  )}
                </FormLabel>
                <FormControl>
                  <Input placeholder={question.placeholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )
      case "textarea":
        return (
          <FormField
            control={form.control}
            name={question.id}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">{question.title}</FormLabel>
                <FormControl>
                  <Textarea placeholder={question.placeholder} className="min-h-[120px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )
      case "textarea-with-examples":
        return (
          <FormField
            control={form.control}
            name={question.id}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">{question.title}</FormLabel>
                <TextFieldWithExamples
                  value={field.value}
                  onChange={field.onChange}
                  examples={question.examples}
                  placeholder={question.placeholder}
                  isRecording={!!isRecording[question.id]}
                  toggleRecording={() => toggleRecording(question.id)}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        )
      case "select-card":
        return (
          <FormField
            control={form.control}
            name={question.id}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium flex items-center">
                  {question.title}
                  <Badge variant="outline" className="mr-2 font-normal">
                    {question.multiple ? "בחירה מרובה" : "בחירה יחידה"}
                  </Badge>
                </FormLabel>
                <FormControl>
                  <CardSelector
                    options={question.options}
                    value={field.value}
                    onChange={field.onChange}
                    multiple={question.multiple}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )
      case "select-cities":
        return (
          <FormField
            control={form.control}
            name={question.id}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium flex items-center">
                  {question.title}
                  <Badge variant="outline" className="mr-2 font-normal">
                    בחירה מרובה
                  </Badge>
                </FormLabel>
                <FormControl>
                  <CitySelector
                    value={field.value}
                    onChange={field.onChange}
                    options={question.options}
                    selectedAreas={formValues.areas.filter((area) => area !== "nationwide" && area !== "other")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )
      case "social-links":
        return (
          <div>
            <FormLabel className="font-medium">{question.title}</FormLabel>
            <SocialMediaLinks
              values={formValues}
              onChange={(newValues) => {
                // Update each field individually
                Object.keys(newValues).forEach((key) => {
                  form.setValue(key, newValues[key])
                })
              }}
            />
          </div>
        )
      case "media-upload":
        return (
          <div>
            <FormLabel className="font-medium">{question.title}</FormLabel>
            <MediaUpload
              fields={question.fields}
              values={formValues}
              onChange={(newValues) => {
                // Update each field individually
                Object.keys(newValues).forEach((key) => {
                  form.setValue(key, newValues[key])
                })
              }}
            />
          </div>
        )
      case "slider":
        return (
          <FormField
            control={form.control}
            name={question.id}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">{question.title}</FormLabel>
                <FormControl>
                  <SliderControl
                    value={field.value || 3} // Default to middle value
                    onChange={field.onChange}
                    min={question.min}
                    max={question.max}
                    labels={question.labels}
                    emojis={question.emojis}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50" dir="rtl">
      <div className="container mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => setShowSectionNav(!showSectionNav)} className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M4.1 19c-1.2 0-2.1-.9-2.1-2.1 0-1.2.9-2.1 2.1-2.1h15.8c1.2 0 2.1.9 2.1 2.1 0 1.2-.9 2.1-2.1 2.1H4.1zM4.1 13.1c-1.2 0-2.1-.9-2.1-2.1 0-1.2.9-2.1 2.1-2.1h15.8c1.2 0 2.1.9 2.1 2.1 0 1.2-.9 2.1-2.1 2.1H4.1zM4.1 7.2c-1.2 0-2.1-.9-2.1-2.1 0-1.2.9-2.1 2.1-2.1h15.8c1.2 0 2.1.9 2.1 2.1 0 1.2-.9 2.1-2.1 2.1H4.1z" />
            </svg>
            {showSectionNav && <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-purple-500"></span>}
          </Button>
          <h1 className="text-2xl font-bold text-center">שאלון שיווק נדל"ן</h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={saveProgress}>
                  <Save className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>שמור התקדמות</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Save confirmation */}
        <AnimatePresence>
          {showSaveConfirmation && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 flex items-center"
            >
              <Check className="h-5 w-5 mr-2" />
              <span>ההתקדמות נשמרה בהצלחה!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section Navigation Drawer */}
        <AnimatePresence>
          {showSectionNav && (
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setShowSectionNav(false)}
            >
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                className="absolute top-0 right-0 h-full w-80 bg-white shadow-xl p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">חלקי השאלון</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowSectionNav(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {sections.map((section) => (
                    <div
                      key={section.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        currentSection === section.id ? "bg-purple-100 border-purple-500 border" : "hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        setCurrentSection(section.id)
                        setCurrentQuestionIndex(0)
                        setShowSectionNav(false)
                      }}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                            section.color || "bg-gray-200"
                          }`}
                        >
                          <span className="text-white text-lg">{section.icon}</span>
                        </div>
                        <span className="font-medium">{section.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="w-full mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>
              {currentSection !== "intro" && (
                <>
                  {sections.find((s) => s.id === currentSection)?.title} - שאלה {currentQuestionIndex + 1} מתוך{" "}
                  {currentQuestions.length}
                </>
              )}
            </span>
            <span>{Math.round(progress)}% הושלמו</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Current Section Header */}
        <div className="mb-6">
          <div className="flex items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${
                sections.find((s) => s.id === currentSection)?.color || "bg-gray-200"
              }`}
            >
              <span className="text-white text-xl">{sections.find((s) => s.id === currentSection)?.icon}</span>
            </div>
            <h2 className="text-xl font-bold">{sections.find((s) => s.id === currentSection)?.title}</h2>
          </div>
        </div>

        {/* Main Content */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => console.log(data))} className="space-y-8">
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${currentSection}-${currentQuestionIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-[300px] flex flex-col justify-between"
                  >
                    <div className="mb-8">{renderQuestion(currentQuestion)}</div>

                    <div className="flex justify-between mt-auto pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentSection === "intro" && currentQuestionIndex === 0}
                      >
                        <ChevronRight className="h-4 w-4 ml-2" />
                        הקודם
                      </Button>

                      <Button type="button" onClick={handleNext} className="bg-purple-600 hover:bg-purple-700">
                        {currentSection === "summary" && currentQuestionIndex === currentQuestions.length - 1
                          ? "סיום"
                          : "הבא"}
                        <ChevronLeft className="h-4 w-4 mr-2" />
                      </Button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Floating Help Button */}
            <div className="fixed bottom-6 left-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" className="rounded-full h-12 w-12 bg-purple-600 hover:bg-purple-700 shadow-lg">
                      <Info className="h-6 w-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>צריך עזרה?</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Floating AI Suggestions Button */}
            <div className="fixed bottom-6 right-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      className="rounded-full h-12 w-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg"
                    >
                      <Sparkles className="h-6 w-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>הצע לי תשובות AI</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

