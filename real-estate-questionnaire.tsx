"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from 'next/navigation' // Import useRouter
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Mic, Check, ChevronDown, ChevronLeft, ChevronRight, Info } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { motion, AnimatePresence } from "framer-motion" // Import motion and AnimatePresence

// Define the *minimal* necessary schema based on remaining questions
const formSchema = z.object({
  // General Details (Required)
  fullName: z.string().min(2, { message: "שם מלא נדרש" }),
  businessName: z.string().min(2, { message: "שם העסק נדרש" }),
  profession: z.string({ required_error: "תחום עיסוק נדרש" }),
  otherProfession: z.string().optional(),

  // Digital Links (Optional)
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

  // Brand Identity (Only Self Presentation)
  selfPresentation: z.string().optional(),

  // Target Audience (Keep base idealClient, clientAge)
  idealClient: z.array(z.string()).optional(),
  otherIdealClient: z.string().optional(),
  clientAge: z.array(z.string()).optional(),
  otherClientAge: z.string().optional(),

  // Personal Story (Keep professionalBackground, realEstateJourney, favoriteAspect, proudProject, learnedMistake, emotionalFeedback, hasReturningClients, returningClientsDetails, successStory)
  professionalBackground: z.string().optional(),
  realEstateJourney: z.string().optional(),
  favoriteAspect: z.string().optional(),
  proudProject: z.string().optional(),
  learnedMistake: z.string().optional(),
  emotionalFeedback: z.string().optional(),
  hasReturningClients: z.boolean().optional(),
  returningClientsDetails: z.string().optional(),
  successStory: z.string().optional(),

  // Summary (Only additionalInfo)
  additionalInfo: z.string().optional(),
})

// Keep necessary option lists
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

const idealClientOptions = [
  { value: "youngCouples", label: "זוגות צעירים", icon: "👫", description: "זוגות בתחילת דרכם המחפשים את ביתם הראשון" },
  { value: "investors", label: "משקיעים", icon: "💰", description: "אנשים המחפשים נכסים להשקעה ותשואה" },
  { value: "foreignResidents", label: "תושבי חוץ", icon: "✈️", description: "אנשים המתגוררים בחו״ל ומעוניינים בנכס בישראל" },
  { value: "developers", label: "יזמים", icon: "🏗️", description: "יזמים המחפשים הזדמנויות לפיתוח" },
  { value: "retirees", label: "גמלאים", icon: "🏖️", description: "אנשים בגיל הפרישה המחפשים לשדרג או להקטין דירה" },
  { value: "pressuredSellers", label: "מוכרים לחוצים", icon: "⏱️", description: "אנשים הזקוקים למכירה מהירה של נכסיהם" },
  { value: "other", label: "אחר", icon: "✨", description: "קהל יעד אחר" },
]

const clientAgeOptions = [
  { value: "young", label: "צעירים (20-35)", icon: "🧑", description: "דור ה-Y וה-Z" },
  { value: "middle", label: "גיל ביניים (35-50)", icon: "👨‍👩‍👧‍👦", description: "משפחות ואנשי קריירה" },
  { value: "mature", label: "מבוגרים (50-65)", icon: "👨‍👩‍👧", description: "הורים שהילדים עזבו את הבית" },
  { value: "senior", label: "גיל הזהב (65+)", icon: "👴", description: "גמלאים ופנסיונרים" },
  { value: "other", label: "אחר", icon: "✨", description: "קבוצת גיל אחרת" },
]

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

// Helper components (CardSelector, TextFieldWithExamples)
// Keep these components, they are useful for rendering questions

// Component for rendering a card-based selection
interface CardOption {
  value: string;
  label: string;
  icon?: string;
  description?: string;
  color?: string;
}

interface CardSelectorProps {
  options: CardOption[];
  value: string | string[] | undefined;
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  compact?: boolean;
}

const CardSelector: React.FC<CardSelectorProps> = ({ options, value, onChange, multiple = false, compact = false }) => {
  let currentSelection: string[] = [];
    if (multiple) {
    currentSelection = Array.isArray(value) ? value : [];
    } else {
    currentSelection = typeof value === 'string' ? [value] : [];
    }

  const isSelected = (optionValue: string): boolean => {
    return currentSelection.includes(optionValue);
  }

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const newSelection = isSelected(optionValue)
        ? currentSelection.filter((v) => v !== optionValue)
        : [...currentSelection, optionValue];
      onChange(newSelection);
      } else {
      onChange(optionValue); // For single select, pass the string directly
    }
  }

  return (
    <div className={`grid ${compact ? "grid-cols-2 md:grid-cols-4 gap-2" : "grid-cols-1 md:grid-cols-3 gap-3"}`}>
          {options.map((option) => (
            <div
              key={option.value}
          className={`${option.color || 'bg-gray-100'} border rounded-lg ${
                compact ? "py-2 px-1" : "p-3"
          } flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-md relative ${
                isSelected(option.value)
                  ? "border-purple-500 ring-2 ring-purple-300 shadow-sm"
                  : "border-gray-200 hover:border-purple-300"
              }`}
              onClick={() => handleSelect(option.value)}
            >
              <span className={`text-xl ${compact ? "mb-1" : "mb-2"}`}>{option.icon}</span>
              <span className={`font-medium text-center ${compact ? "text-sm" : ""}`}>{option.label}</span>
              {!compact && <span className="text-xs text-center mt-1 text-gray-600">{option.description}</span>}
              {isSelected(option.value) && (
                <div className="absolute top-1 right-1 bg-purple-500 text-white rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </div>
          ))}
        </div>
  )
}

// Component for rendering a text field with examples
interface TextFieldWithExamplesProps {
    value: string | undefined;
    onChange: (value: string) => void;
    examples: string[];
    placeholder: string;
}

const TextFieldWithExamples: React.FC<TextFieldWithExamplesProps> = ({ value, onChange, examples, placeholder }) => {
  const selectExample = (example: string) => {
    const currentValue = value || ""
    const newValue = currentValue ? `${currentValue}\n${example}` : example
    onChange(newValue)
  }

  return (
    <div className="space-y-2">
      <Textarea
        placeholder={placeholder}
        className="min-h-[120px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
       {/* Removed Mic Button */}
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
                      <div className="flex-1 text-right">{example}</div>
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

// Define the structure for steps (can be single question or group)
interface Question {
  id: string;
  type: string;
  title: string;
  required?: boolean;
  placeholder?: string;
  options?: any[];
  multiple?: boolean;
  condition?: (data: any) => boolean;
  examples?: string[];
  accept?: string;
}

interface QuestionGroup {
    id: string;
    type: 'group';
    title: string; // Title for the group step
    questions: Question[];
}

type StepItem = Question | QuestionGroup;

// --- Define the original list of questions before filtering/grouping ---
const originalQuestions: Question[] = [
  // General Details
  { id: "fullName", type: "text", title: "שם מלא", required: true },
  { id: "businessName", type: "text", title: "שם העסק", required: true },
  { id: "profession", type: "select-card", title: "תחום עיסוק", options: professionOptions, required: true, multiple: false },
  { id: "otherProfession", type: "text", title: "פרט תחום עיסוק אחר", condition: (data) => data.profession === "other" },

  // Digital Links (Indices 4-13)
  { id: "website", type: "text", title: "אתר אינטרנט", placeholder: "https://www.example.com" }, // 4
  { id: "facebookUrl", type: "text", title: "עמוד פייסבוק", placeholder: "https://www.facebook.com/yourpage" }, // 5
  { id: "instagramUrl", type: "text", title: "עמוד אינסטגרם", placeholder: "https://www.instagram.com/yourpage" }, // 6
  { id: "linkedinUrl", type: "text", title: "פרופיל לינקדאין", placeholder: "https://www.linkedin.com/in/yourprofile" }, // 7
  { id: "youtubeUrl", type: "text", title: "ערוץ יוטיוב", placeholder: "https://www.youtube.com/yourchannel" }, // 8
  { id: "tiktokUrl", type: "text", title: "חשבון טיקטוק", placeholder: "https://www.tiktok.com/@yourprofile" }, // 9
  { id: "googleBusinessUrl", type: "text", title: "פרופיל גוגל לעסק", placeholder: "כתובת הפרופיל שלך בגוגל" }, // 10
  { id: "otherProfiles", type: "textarea", title: "קישורים נוספים (רשתות אחרות, בלוג וכו')", placeholder: "הזן כל קישור בשורה נפרדת" }, // 11
  { id: "logo", type: "file", title: "העלאת לוגו", accept: "image/*" }, // 12
  { id: "profilePicture", type: "file", title: "העלאת תמונת פרופיל", accept: "image/*" }, // 13

  // Brand Identity
  { id: "selfPresentation", type: "textarea-with-examples", title: "הצגה עצמית קצרה", placeholder: "תאר את עצמך ואת העסק שלך בכמה משפטים", examples: selfPresentationExamples }, // 14

  // Target Audience
  { id: "idealClient", type: "select-card", title: "לקוח אידיאלי", options: idealClientOptions, multiple: true }, // 15
  { id: "otherIdealClient", type: "text", title: "פרט לקוח אידיאלי אחר", condition: (data) => data.idealClient?.includes("other") }, // 16
  { id: "clientAge", type: "select-card", title: "גיל הלקוחות העיקרי", options: clientAgeOptions, multiple: true }, // 17 <- REMOVE
  { id: "otherClientAge", type: "text", title: "פרט קבוצת גיל אחרת", condition: (data) => data.clientAge?.includes("other") }, // 18 <- REMOVE (due to 17)

  // Personal Story
  { id: "professionalBackground", type: "textarea-with-examples", title: "רקע מקצועי", placeholder: "ספר על הרקע המקצועי שלך", examples: professionalBackgroundExamples }, // 19
  { id: "realEstateJourney", type: "textarea", title: "המסע שלך בנדל\"ן", placeholder: "ספר על הדרך שלך בתחום הנדל\"ן (בעתיד ניתן יהיה להקליט או לדבר עם צ'אטבוט)" }, // 20 <- REMOVE
  { id: "favoriteAspect", type: "textarea", title: "ההיבט האהוב עליך בעבודה", placeholder: "מה אתה הכי אוהב בעבודה שלך?" }, // 21
  { id: "proudProject", type: "textarea", title: "פרויקט שאתה גאה בו במיוחד", placeholder: "תאר פרויקט או עסקה שאתה גאה בהם" }, // 22 <- REMOVE
  { id: "learnedMistake", type: "textarea", title: "טעות שלמדת ממנה", placeholder: "ספר על טעות שעשית ומה למדת ממנה" }, // 23 <- REMOVE
  { id: "emotionalFeedback", type: "textarea", title: "משוב מרגש מלקוח", placeholder: "שתף משוב מרגש שקיבלת מלקוח" }, // 24 <- REMOVE
  { id: "hasReturningClients", type: "boolean", title: "האם יש לך לקוחות חוזרים?" }, // 25 <- REMOVE
  { id: "returningClientsDetails", type: "textarea", title: "פרט על לקוחות חוזרים", placeholder: "מדוע לדעתך לקוחות חוזרים אליך?", condition: (data) => data.hasReturningClients === true }, // 26 <- REMOVE
  { id: "successStory", type: "textarea", title: "סיפור הצלחה", placeholder: "שתף סיפור הצלחה בולט שלך" }, // 27 <- REMOVE

  // Summary
  { id: "additionalInfo", type: "textarea", title: "מידע נוסף", placeholder: "כל מידע נוסף שחשוב לך שנדע" }, // 28 <- REMOVE
];

// --- Filter and Group Questions --- 
const questionsToRemove = [
    "clientAge", "otherClientAge", // Indices 17, 18
    "realEstateJourney", // Index 20
    "proudProject", // Index 22
    "learnedMistake", // Index 23
    "emotionalFeedback", // Index 24
    "hasReturningClients", "returningClientsDetails", // Index 25, 26
    "successStory", // Index 27
    // "additionalInfo" // Index 28 - REMOVED FROM REMOVAL LIST
];

// Find and update the title for additionalInfo before filtering
const additionalInfoIndex = originalQuestions.findIndex(q => q.id === 'additionalInfo');
if (additionalInfoIndex !== -1) {
    originalQuestions[additionalInfoIndex].title = "האם יש משהו נוסף שתרצה להוסיף?";
}

const filteredQuestions = originalQuestions.filter(q => !questionsToRemove.includes(q.id));

// Group digital links (original indices 4-11)
const steps: StepItem[] = [];
const digitalLinkGroup: Question[] = [];
const fileUploadGroup: Question[] = [];
let currentGroup: 'links' | 'files' | 'none' = 'none';

filteredQuestions.forEach(q => {
    if (q.id === 'website') { // Start of digital links group
        currentGroup = 'links';
        digitalLinkGroup.push(q);
    } else if (q.id === 'logo') { // Start of file upload group
        if (digitalLinkGroup.length > 0) {
             steps.push({ id: 'digitalLinksGroup', type: 'group', title: 'קישורים דיגיטליים', questions: [...digitalLinkGroup] });
             digitalLinkGroup.length = 0; // Clear the array
        }
        currentGroup = 'files';
        fileUploadGroup.push(q);
    } else if (currentGroup === 'links') {
        digitalLinkGroup.push(q);
         if (q.id === 'otherProfiles') { // End of digital links group (before files)
             // The group will be pushed when file uploads start or at the end
         }
    } else if (currentGroup === 'files') {
        fileUploadGroup.push(q); // Add profilePicture
         if (q.id === 'profilePicture') { // End of file uploads
            steps.push({ id: 'fileUploadGroup', type: 'group', title: 'לוגו ותמונת פרופיל', questions: [...fileUploadGroup] });
            fileUploadGroup.length = 0;
            currentGroup = 'none';
         }
    } else {
        steps.push(q); // Push individual question as a step
    }
});

// Ensure any remaining group is pushed (shouldn't happen with current structure but good practice)
if (digitalLinkGroup.length > 0) {
    steps.push({ id: 'digitalLinksGroup', type: 'group', title: 'קישורים דיגיטליים', questions: [...digitalLinkGroup] });
}
if (fileUploadGroup.length > 0) {
    steps.push({ id: 'fileUploadGroup', type: 'group', title: 'לוגו ותמונת פרופיל', questions: [...fileUploadGroup] });
}

// Main Component
export default function RealEstateQuestionnaire() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0) // Changed state name
  const [showOtherInput, setShowOtherInput] = useState<Record<string, boolean>>({})
  const [submitted, setSubmitted] = useState(false); // Track submission
  const router = useRouter(); // Initialize router

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Update default values based on the *filtered* schema fields
      fullName: "",
      businessName: "",
      profession: "",
      otherProfession: "",
      website: "",
      facebookUrl: "",
      instagramUrl: "",
      linkedinUrl: "",
      youtubeUrl: "",
      tiktokUrl: "",
      googleBusinessUrl: "",
      otherProfiles: "",
      logo: null,
      profilePicture: null,
      selfPresentation: "",
      idealClient: [],
      otherIdealClient: "",
      // Removed clientAge, otherClientAge
      professionalBackground: "",
      // Removed realEstateJourney
      favoriteAspect: "",
      // Removed proudProject, learnedMistake, emotionalFeedback, hasReturningClients, returningClientsDetails, successStory
      additionalInfo: "", // ADDED BACK
    },
    mode: 'onChange', // Validate on change to enable/disable Next button
  })

  const formValues = form.watch()
  const totalSteps = steps.length // Use the new steps array length
  const progress = ((currentStepIndex + 1) / totalSteps) * 100; // Progress based on step index

   // Helper to check if a step should be shown based on conditions
   const isStepVisible = (stepIndex: number): boolean => {
    const stepItem = steps[stepIndex];
    if (!stepItem) return false;
    if (stepItem.type === 'group') {
        // A group step is visible if it contains at least one visible question
        // (This assumes groups don't have their own top-level condition)
        // Correctly check the type before accessing questions
        return (stepItem as QuestionGroup).questions.some(q => !q.condition || q.condition(formValues));
    } else {
        // A single question step is visible if it has no condition or the condition is met
        const question = stepItem as Question;
        return !question.condition || question.condition(formValues);
    }
   }

  // Function to check if the current step's question(s) are valid
  const isCurrentStepValid = async () => {
    const currentStepItem = steps[currentStepIndex];
    let isValid = true;

    if (!currentStepItem) return false;
    // If the current step itself isn't visible (e.g., navigating back to a now-hidden step), consider it valid to allow navigation *away*
    if (!isStepVisible(currentStepIndex)) return true;

    if (currentStepItem.type === 'group') {
        // Trigger validation for all *visible* fields in the group
        // Correctly check type before accessing questions
        const visibleGroupQuestions = (currentStepItem as QuestionGroup).questions.filter(q => !q.condition || q.condition(formValues));
        const groupFields = visibleGroupQuestions.map(q => q.id) as (keyof z.infer<typeof formSchema>)[];
         if (groupFields.length > 0) { // Only trigger validation if there are visible fields
            isValid = await form.trigger(groupFields);
         }
    } else {
        // Trigger validation only for the single field in this step
        const question = currentStepItem as Question;
        // No need to validate if the question isn't visible (this case is handled by isStepVisible check above)
        isValid = await form.trigger(question.id as keyof z.infer<typeof formSchema>);
    }
    return isValid;
  };


  const handleNext = async () => {
    const isValid = await isCurrentStepValid();

    if (isValid) {
        let nextStepIndex = currentStepIndex + 1;
        // Find the next *visible* step
        while (nextStepIndex < totalSteps && !isStepVisible(nextStepIndex)) {
            nextStepIndex++;
        }

        if (nextStepIndex < totalSteps) {
            setCurrentStepIndex(nextStepIndex);
    } else {
            // Reached the end (or beyond) after skipping
            handleSubmit();
        }
    } else {
        console.log("Current step is not valid");
        // Highlight errors or rely on FormMessage - re-trigger validation for visible fields
        const currentStepItem = steps[currentStepIndex];
        if (currentStepItem.type === 'group') {
            // Correctly check type before accessing questions
            const visibleGroupQuestions = (currentStepItem as QuestionGroup).questions.filter(q => !q.condition || q.condition(formValues));
            const groupFields = visibleGroupQuestions.map(q => q.id) as (keyof z.infer<typeof formSchema>)[];
             if (groupFields.length > 0) {
                 await form.trigger(groupFields);
             }
        } else {
             await form.trigger((currentStepItem as Question).id as keyof z.infer<typeof formSchema>);
        }
    }
  };

  const handlePrevious = () => {
     let prevStepIndex = currentStepIndex - 1;
     // Find the previous *visible* step
     while (prevStepIndex >= 0 && !isStepVisible(prevStepIndex)) {
         prevStepIndex--;
     }

     if (prevStepIndex >= 0) {
         setCurrentStepIndex(prevStepIndex);
     }
   };

  const handleSubmit = async () => {
    // Validate *all* schema fields before final submit, not just current step
    const isValid = await form.trigger();
    if (isValid) {
      const data = form.getValues();
      console.log("Form Submitted:", data);
      setSubmitted(true);
      router.push('/dashboard');
    } else {
       console.log("Form has validation errors");
       // Maybe find the first step with an error and navigate there?
       // Requires mapping errors back to visible steps.
       // For now, just log.
    }
  };

  // Watch specific fields to show/hide conditional inputs
  useEffect(() => {
    setShowOtherInput(prev => ({ 
        ...prev,
        profession: formValues.profession === 'other',
        idealClient: !!formValues.idealClient?.includes('other'),
        // clientAge removed
        hasReturningClients: formValues.hasReturningClients === true, // For the boolean field condition
    }));
  }, [formValues.profession, formValues.idealClient, formValues.hasReturningClients]); // Updated dependencies

  const currentStepItem = steps[currentStepIndex];

  // Render the current step (either single question or group)
  const renderStep = (stepItem: StepItem | undefined) => {
    if (!stepItem) return null;

    // Added check: If the step itself isn't visible, render nothing or a placeholder
    // This prevents rendering an empty container for a skipped step
    if (!isStepVisible(currentStepIndex)) {
        return <p>Loading...</p>; // Or null, or some indicator
    }

    if (stepItem.type === 'group') {
        // Filter questions within the group to only render visible ones
        const visibleQuestions = (stepItem as QuestionGroup).questions.filter(q => !q.condition || q.condition(formValues));
        // If no questions in the group are visible, maybe show nothing?
        if (visibleQuestions.length === 0) {
            // This case should be rare if isStepVisible handles groups correctly
            return null;
        }
        return (
            <div className="space-y-6">
                 <h3 className="text-xl font-semibold mb-4 text-purple-700">{stepItem.title}</h3>
                 {visibleQuestions.map(question => (
                    <div key={question.id} className="pb-4 mb-4 border-b border-gray-100 last:border-b-0">
                        {renderQuestion(question)}
            </div>
          ))}
        </div>
        );
    } else {
        // Render single question (renderQuestion already handles its own condition)
        return renderQuestion(stepItem as Question);
    }
  }

  // Render the individual question based on its type (mostly unchanged)
  const renderQuestion = (question: Question | undefined) => {
    if (!question) return null;

     // Check condition before rendering
     if (question.condition && !question.condition(formValues)) {
        // This should ideally not be reached if navigation logic is perfect,
        // but as a fallback, don't render the question.
        return null; 
     }

    switch (question.type) {
        // Cases for text, textarea, textarea-with-examples, select-card, file, boolean remain largely the same
        // Ensure they use the `question` object passed to them
         case "text":
         return (
                      <FormField
                        control={form.control}
             name={question.id as keyof z.infer<typeof formSchema>}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium">
                   {question.title}
                   {question.required && (
                     <Badge variant="destructive" className="mr-2 font-normal">חובה</Badge>
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
              name={question.id as keyof z.infer<typeof formSchema>}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium">
                    {question.title}
                     {question.required && (
                         <Badge variant="destructive" className="mr-2 font-normal">חובה</Badge>
                     )}
                            </FormLabel>
                            <FormControl>
                    <Textarea placeholder={question.placeholder} className="min-h-[150px]" {...field} />
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
             name={question.id as keyof z.infer<typeof formSchema>}
                        render={({ field }) => (
                          <FormItem>
                 <FormLabel className="font-medium">
                  {question.title}
                  {question.required && (
                      <Badge variant="destructive" className="mr-2 font-normal">חובה</Badge>
                  )}
                 </FormLabel>
                 <TextFieldWithExamples
                   value={field.value}
                   onChange={field.onChange}
                   examples={question.examples || []}
                   placeholder={question.placeholder || ""}
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
             name={question.id as keyof z.infer<typeof formSchema>}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium flex items-center">
                  {question.title}
                              <Badge variant="outline" className="mr-2 font-normal">
                     {question.multiple ? "בחירה מרובה" : "בחירה יחידה"}
                              </Badge>
                    {question.required && (
                        <Badge variant="destructive" className="mr-2 font-normal">חובה</Badge>
                    )}
                                </FormLabel>
                                <FormControl>
                    <CardSelector
                     options={question.options || []}
                     value={field.value}
                     onChange={field.onChange}
                     multiple={question.multiple}
                     compact={true} // Use compact style for one question view
                   />
                            </FormControl>
                  {/* Conditional Input for 'Other' */}
                  {question.multiple ? (
                       field.value?.includes("other") && (
                      <FormField
                        control={form.control}
                             name={`other${question.id.charAt(0).toUpperCase() + question.id.slice(1)}` as keyof z.infer<typeof formSchema>}
                             render={({ field: otherField }) => (
                             <FormItem className="mt-2">
                                 <FormLabel className="font-medium">פרט "{question.title}" אחר</FormLabel>
                                 <FormControl><Input placeholder={`הזן ${question.title} אחר`} {...otherField} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                     )
                  ) : (
                      field.value === "other" && (
                      <FormField
                        control={form.control}
                             name={`other${question.id.charAt(0).toUpperCase() + question.id.slice(1)}` as keyof z.infer<typeof formSchema>}
                             render={({ field: otherField }) => (
                             <FormItem className="mt-2">
                                 <FormLabel className="font-medium">פרט "{question.title}" אחר</FormLabel>
                                 <FormControl><Input placeholder={`הזן ${question.title} אחר`} {...otherField} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                     )
                  )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
         )
      case "file":
        return (
                      <FormField
                        control={form.control}
            name={question.id as keyof z.infer<typeof formSchema>}
            render={({ field: { value, onChange, ...fieldProps } }) => (
                          <FormItem>
                <FormLabel className="font-medium">{question.title}</FormLabel>
                            <FormControl>
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <div className="flex flex-col items-center">
                                  {value ? (
                        <div className="mb-4 text-center">
                          <Check className="h-8 w-8 text-green-500 mx-auto mb-2"/>
                          <p className="text-sm text-green-600">הקובץ הועלה: {(value as File)?.name ?? 'קובץ'}</p> {/* Added type assertion and fallback */}
                           <Button variant="link" size="sm" className="text-red-500" onClick={() => onChange(null)}>הסר</Button>
                                    </div>
                      ) : (
                        <>
                           <p className="text-gray-500 mb-2">גרור ושחרר קובץ כאן</p>
                                  <p className="text-gray-500 mb-4">או</p>
                         </>
                      )}
                      {!value && (
                         <>
                                  <Input
                                    type="file"
                                 accept={question.accept}
                                    className="hidden"
                                 id={`${question.id}-upload`}
                                    onChange={(e) => {
                                 const file = e.target.files?.[0];
                                      if (file) {
                                     onChange(file);
                                      }
                                    }}
                                 {...fieldProps}
                                  />
                                  <label
                                 htmlFor={`${question.id}-upload`}
                                    className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md"
                                  >
                                    בחר קובץ
                                  </label>
                         </>
                      )}
                    </div>
                </div>
                            </FormControl>
                <p className="text-xs text-gray-500 mt-1">מקסימום 2MB</p>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
        )
      case "boolean":
          return (
                      <FormField
                        control={form.control}
                  name={question.id as keyof z.infer<typeof formSchema>}
                        render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                              <FormLabel className="text-base font-medium">{question.title}</FormLabel>
                                </div>
                          <FormControl>
                             <div className="flex gap-4">
                                 <Button
                                     type="button"
                                     variant={field.value === true ? 'default' : 'outline'}
                                     onClick={() => field.onChange(true)}
                                     className={field.value === true ? 'bg-purple-600 hover:bg-purple-700' : ''}
                                 >
                                     כן
                                 </Button>
                                 <Button
                                     type="button"
                                     variant={field.value === false ? 'destructive' : 'outline'}
                                      onClick={() => field.onChange(false)}
                                 >
                                     לא
                                 </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
          );
       default:
         return <p>סוג שאלה לא נתמך: {question.type}</p>
     }
   }
 
 
  return (
     <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50" dir="rtl">
       <div className="container mx-auto py-8 px-4 flex flex-col flex-grow items-center justify-center">
 
         <div className="w-full max-w-2xl">
              {/* Header - Simplified */}
              <div className="text-center mb-6">
                  <h1 className="text-3xl font-bold text-purple-800 mb-2">בניית הסוכן האישי שלך</h1>
                  <p className="text-gray-600">ענה על השאלות כדי שנוכל להתאים את הסוכן לצרכים שלך</p>
              </div>
 
 
              {/* Progress Bar */}
               <div className="w-full mb-8">
                  <Progress value={progress} className="h-3 bg-purple-200 [&>*]:bg-purple-600" />
                  <div className="flex justify-between text-sm mt-2 text-purple-700">
                     <span>שלב {currentStepIndex + 1} מתוך {totalSteps}</span>
                     <span>{Math.round(progress)}% הושלמו</span>
                    </div>
                </div>
 
             <Form {...form}>
                {/* No onSubmit on form tag, handled by button click */}
                <form className="space-y-8 w-full">
                 <Card className="shadow-xl border-purple-100 border overflow-hidden">
                   <CardContent className="p-6 md:p-8">
                     <AnimatePresence mode="wait">
                       <motion.div
                          key={currentStepIndex} // Use step index as key for animation
                          initial={{ opacity: 0, x: 50 }} // Slide in from right
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }} // Slide out to left
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="min-h-[350px] flex flex-col justify-between" // Ensure minimum height and flex layout
                       >
                         {/* Render the current question */}
                         <div className="mb-8">
                           {renderStep(currentStepItem)}
                    </div>
 
                          {/* Navigation Buttons */}
                          <div className="flex justify-between mt-auto pt-6 border-t border-gray-200">
                               {/* Next/Submit Button - On the right visually in RTL */}
                                <Button
                                  type="button"
                                 onClick={currentStepIndex === totalSteps - 1 ? handleSubmit : handleNext}
                                 className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white disabled:opacity-50 shadow-md flex items-center"
                                 // Add disabled logic if needed based on validation
                               >
                                 <ChevronRight className="h-4 w-4 ml-2" />
                                 {currentStepIndex === totalSteps - 1 ? "סיום והפעלת הסוכן" : "הבא"}
                                </Button>
  
                             {/* Previous Button - On the left visually in RTL */}
                                <Button
                                  type="button"
                                 variant="outline"
                                 onClick={handlePrevious}
                                 disabled={currentStepIndex === 0}
                                 className="border-purple-300 text-purple-700 hover:bg-purple-50 disabled:opacity-50 flex items-center"
                              >
                                 <ChevronRight className="h-4 w-4 ml-2" />
                                 הקודם
                                </Button>
                              </div>
 
                       </motion.div>
                     </AnimatePresence>
                    </CardContent>
                  </Card>
 
                {/* Floating Help Button - Optional */}
                 <div className="fixed bottom-6 left-6 z-50">
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
          </form>
        </Form>
          </div>
      </div>
    </div>
  )
}

