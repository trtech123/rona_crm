"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sparkles,
  Upload,
  Play,
  ImageIcon,
  Pencil,
  Trash2,
  Plus,
  Loader2,
  Check,
  Video,
  PenTool,
  ArrowLeft,
  Wand2,
  Lightbulb,
  Maximize,
  Palette,
  Layers,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Owl } from "@/components/owl"

interface MediaEditorProps {
  onMediaChange?: (media: any) => void
}

export function MediaEditor({ onMediaChange }: MediaEditorProps) {
  const [activeTab, setActiveTab] = useState("images")
  const [aiSuggestions, setAiSuggestions] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [selectedDrawing, setSelectedDrawing] = useState<string | null>(null)
  const [videoCreationMode, setVideoCreationMode] = useState<"fromImages" | "uploadVideo">("fromImages")
  const [propertyDetails, setPropertyDetails] = useState({
    rooms: "",
    size: "",
    style: "modern",
    furniture: "full",
  })
  const [aiImagePrompt, setAiImagePrompt] = useState("")
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [isGeneratingAiImage, setIsGeneratingAiImage] = useState(false)
  const [enhancedImages, setEnhancedImages] = useState<{ [key: number]: boolean }>({})

  // מצב עריכת תמונה
  const [imageEditSettings, setImageEditSettings] = useState({
    resolution: "original",
    sharpness: 50,
    noise: 50,
    contrast: 50,
    brightness: 50,
    saturation: 50,
  })

  // מצב יצירת וידאו
  const [videoSettings, setVideoSettings] = useState({
    transition: "fade",
    duration: 3,
    music: "none",
    title: "",
    showLogo: true,
  })

  // עדכון ה-state כדי לתמוך בהמלצות תיאור תמונה ובהוספת לוגו/תמונת תדמית
  const [imageDescriptionSuggestions, setImageDescriptionSuggestions] = useState<string[]>([])
  const [showMoreSuggestions, setShowMoreSuggestions] = useState(false)
  const [selectedLogoSource, setSelectedLogoSource] = useState<"none" | "questionnaire" | "upload">("none")
  const [selectedProfileImageSource, setSelectedProfileImageSource] = useState<"none" | "questionnaire" | "upload">(
    "none",
  )
  const [logoImage, setLogoImage] = useState<string | null>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)

  // הוספת פונקציה לייצור המלצות תיאור תמונה
  const generateImageDescriptionSuggestions = () => {
    setIsProcessing(true)

    // בפועל, כאן היה נשלח API call לקבלת המלצות מ-AI
    // כרגע נדמה המלצות קבועות
    setTimeout(() => {
      const initialSuggestions = [
        "דירת 4 חדרים מודרנית עם מטבח פתוח, חלונות גדולים ונוף לים, סלון מרווח עם ספה אפורה",
        "בית פרטי מרווח עם גינה ירוקה, מרפסת רחבה ועיצוב פנים יוקרתי בסגנון מודרני",
        "דירת גן מעוצבת עם כניסה נפרדת, פינת אוכל מוארת ומטבח מאובזר בסגנון סקנדינבי",
      ]

      if (showMoreSuggestions) {
        const additionalSuggestions = [
          "פנטהאוז מפואר עם נוף פנורמי לעיר, מרפסת שמש גדולה וחדר מאסטר עם חדר ארונות",
          "דירת סטודיו קומפקטית ומעוצבת בקפידה, עם פתרונות אחסון חכמים וריהוט רב-תכליתי",
          "בית טאון-האוס בן 3 קומות עם חניה פרטית, חצר אחורית מטופחת וחלל מגורים פתוח",
        ]
        setImageDescriptionSuggestions([...initialSuggestions, ...additionalSuggestions])
      } else {
        setImageDescriptionSuggestions(initialSuggestions)
      }

      setIsProcessing(false)
    }, 1500)
  }

  // הוספת פונקציה לבחירת תיאור תמונה מההמלצות
  const selectImageDescription = (description: string) => {
    setAiImagePrompt(description)
  }

  // הוספת פונקציה לבקשת המלצות נוספות
  const requestMoreSuggestions = () => {
    setShowMoreSuggestions(true)
    generateImageDescriptionSuggestions()
  }

  // הוספת פונקציה לטיפול בבחירת מקור הלוגו
  const handleLogoSourceChange = (source: "none" | "questionnaire" | "upload") => {
    setSelectedLogoSource(source)

    if (source === "questionnaire") {
      // בפועל, כאן היינו מושכים את הלוגו מהשאלון
      setLogoImage("/placeholder.svg?height=100&width=100")
    } else if (source === "none") {
      setLogoImage(null)
    }
  }

  // הוספת פונקציה לטיפול בבחירת מקור תמונת התדמית
  const handleProfileImageSourceChange = (source: "none" | "questionnaire" | "upload") => {
    setSelectedProfileImageSource(source)

    if (source === "questionnaire") {
      // בפועל, כאן היינו מושכים את תמונת התדמית מהשאלון
      setProfileImage("/placeholder.svg?height=100&width=100")
    } else if (source === "none") {
      setProfileImage(null)
    }
  }

  // הוספת פונקציה להעלאת לוגו
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLogoImage(URL.createObjectURL(e.target.files[0]))
      setSelectedLogoSource("upload")
    }
  }

  // הוספת פונקציה להעלאת תמונת תדמית
  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfileImage(URL.createObjectURL(e.target.files[0]))
      setSelectedProfileImageSource("upload")
    }
  }

  const handleAiSuggestions = () => {
    setAiSuggestions(true)
    setIsProcessing(true)
    // בפועל, כאן היה נשלח API call לקבלת המלצות AI
    setTimeout(() => {
      setAiSuggestions(false)
      setIsProcessing(false)
    }, 2000)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // בפועל, כאן היינו מעלים את הקבצים לשרת
      // כרגע נדמה העלאה עם URL מקומיים
      const newImages = Array.from(e.target.files).map((file) => URL.createObjectURL(file))
      setSelectedImages([...selectedImages, ...newImages])
    }
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // בפועל, כאן היינו מעלים את הקבצים לשרת
      setSelectedVideo(URL.createObjectURL(e.target.files[0]))
    }
  }

  const handleDrawingUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // בפועל, כאן היינו מעלים את הקבצים לשרת
      setSelectedDrawing(URL.createObjectURL(e.target.files[0]))
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...selectedImages]
    newImages.splice(index, 1)
    setSelectedImages(newImages)

    // Also remove from enhanced images if it exists
    if (enhancedImages[index]) {
      const newEnhanced = { ...enhancedImages }
      delete newEnhanced[index]
      setEnhancedImages(newEnhanced)
    }
  }

  const handleImageSettingChange = (setting: string, value: any) => {
    setImageEditSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
  }

  const handleVideoSettingChange = (setting: string, value: any) => {
    setVideoSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
  }

  const handlePropertyDetailChange = (detail: string, value: any) => {
    setPropertyDetails((prev) => ({
      ...prev,
      [detail]: value,
    }))
  }

  const generateVideo = () => {
    setIsProcessing(true)
    // בפועל, כאן היה נשלח API call ליצירת הוידאו
    setTimeout(() => {
      setIsProcessing(false)
      // כאן היינו מקבלים את הוידאו המוכן
    }, 3000)
  }

  const generateRenderingFromDrawing = () => {
    setIsProcessing(true)
    // בפועל, כאן היה נשלח API call ליצירת ההדמיה
    setTimeout(() => {
      setIsProcessing(false)
      // כאן היינו מקבלים את ההדמיה המוכנה
    }, 3000)
  }

  const generateAiImage = () => {
    if (!aiImagePrompt.trim()) return

    setIsGeneratingAiImage(true)
    // Simulate AI image generation
    setTimeout(() => {
      // In a real implementation, this would call an API to generate the image
      const mockGeneratedImage = "/placeholder.svg?height=512&width=512"
      setGeneratedImages([...generatedImages, mockGeneratedImage])
      setIsGeneratingAiImage(false)
    }, 3000)
  }

  const enhanceImageForMarketing = (index: number) => {
    setIsProcessing(true)
    // Simulate image enhancement
    setTimeout(() => {
      // In a real implementation, this would call an API to enhance the image
      setEnhancedImages({ ...enhancedImages, [index]: true })
      setIsProcessing(false)
    }, 2000)
  }

  const enhanceVideoQuality = () => {
    setIsProcessing(true)
    // Simulate video enhancement
    setTimeout(() => {
      // In a real implementation, this would call an API to enhance the video
      setIsProcessing(false)
    }, 3000)
  }

  // הוסף את הפונקציות החדשות לאחר הפונקציה enhanceVideoQuality

  // הוספת פונקציה לניקוי בלאגן בתמונה
  const cleanupImageClutter = (index: number) => {
    setIsProcessing(true)
    // בפועל, כאן היה נשלח API call לניקוי הבלאגן בתמונה
    setTimeout(() => {
      // בפועל, כאן היינו מקבלים את התמונה המנוקה
      setIsProcessing(false)
      // עדכון התמונה המשופרת
      const newEnhanced = { ...enhancedImages }
      newEnhanced[index] = true
      setEnhancedImages(newEnhanced)
    }, 2500)
  }

  // הוספת פונקציה לריהוט וירטואלי
  const addVirtualFurniture = (index: number, style: string) => {
    setIsProcessing(true)
    // בפועל, כאן היה נשלח API call להוספת ריהוט וירטואלי
    setTimeout(() => {
      // בפועל, כאן היינו מקבלים את התמונה עם הריהוט
      setIsProcessing(false)
      // עדכון התמונה המשופרת
      const newEnhanced = { ...enhancedImages }
      newEnhanced[index] = true
      setEnhancedImages(newEnhanced)
    }, 3000)
  }

  // הוספת פונקציה ליצירת תמונה אחידה ממספר תמונות
  const createUnifiedImage = () => {
    if (selectedImages.length < 2) return

    setIsProcessing(true)
    // בפועל, כאן היה נשלח API call ליצירת תמונה אחידה
    setTimeout(() => {
      // בפועל, כאן היינו מקבלים את התמונה האחידה
      setIsProcessing(false)
      // הוספת התמונה החדשה לרשימת התמונות
      const unifiedImageUrl = "/placeholder.svg?height=600&width=800"
      setSelectedImages([...selectedImages, unifiedImageUrl])
    }, 3000)
  }

  // עדכון useEffect כדי לייצר המלצות תיאור תמונה בטעינה הראשונית של הלשונית
  useEffect(() => {
    if (activeTab === "ai-generation" && imageDescriptionSuggestions.length === 0) {
      generateImageDescriptionSuggestions()
    }
  }, [activeTab])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">עריכת מדיה</h3>
        <div className="flex items-center gap-2">
          <div className="text-sm bg-purple-50 px-3 py-1.5 rounded-full flex items-center">
            <Sparkles className="h-4 w-4 text-purple-600 mr-1.5" />
            <span className="text-purple-800">עריכה חכמה בעזרת AI</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="images" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="images" className="flex items-center gap-1.5">
            <ImageIcon className="h-4 w-4" />
            <span>תמונות</span>
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-1.5">
            <Video className="h-4 w-4" />
            <span>סרטונים</span>
          </TabsTrigger>
          <TabsTrigger value="drawings" className="flex items-center gap-1.5">
            <PenTool className="h-4 w-4" />
            <span>שרטוטים והדמיות</span>
          </TabsTrigger>
          <TabsTrigger value="ai-generation" className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" />
            <span>יצירה ב-AI</span>
          </TabsTrigger>
        </TabsList>

        {/* תוכן לשונית תמונות */}
        <TabsContent value="images" className="space-y-4">
          {selectedImages.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="flex flex-col items-center">
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">גרור תמונות לכאן או לחץ להעלאה</p>
                <p className="text-xs text-gray-500 mb-4">PNG, JPG, GIF עד 5MB</p>
                <div className="relative">
                  <Button variant="outline" size="sm">
                    בחר תמונות
                  </Button>
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="w-24 h-24 rounded-md overflow-hidden border border-gray-200 relative">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`תמונה ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {enhancedImages[index] && (
                        <div className="absolute top-0 right-0 bg-green-500 text-white p-1 rounded-bl-md">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                    <div className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {index + 1}
                    </div>
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                    {!enhancedImages[index] && (
                      <button
                        onClick={() => enhanceImageForMarketing(index)}
                        className="absolute bottom-0 left-0 right-0 bg-purple-600 text-white text-xs py-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <Loader2 className="h-3 w-3 mx-auto animate-spin" />
                        ) : (
                          <span className="flex items-center justify-center">
                            <Wand2 className="h-3 w-3 mr-1" />
                            שיפור
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                ))}
                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="relative flex flex-col items-center">
                    <Plus className="h-6 w-6 text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1">הוסף</span>
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>
              </div>

              {selectedImages.length >= 3 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <Owl size="small" />
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-800">יצירת סרטון מתמונות</h4>
                      <p className="text-sm text-purple-700 mt-1">
                        זיהיתי שהעלית {selectedImages.length} תמונות. תוכל ליצור סרטון מרשים מהתמונות שלך!
                      </p>
                      <div className="mt-3">
                        <Button
                          onClick={() => {
                            setActiveTab("videos")
                            setVideoCreationMode("fromImages")
                          }}
                          className="bg-gradient-to-r from-purple-600 to-indigo-600"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          צור סרטון מהתמונות
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* עריכת תמונה */}
              <div className="border rounded-lg p-4 mt-4 bg-gray-50">
                <h4 className="font-medium mb-3 flex items-center">
                  <Pencil className="h-4 w-4 mr-1.5 text-gray-600" />
                  עריכת תמונה
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg border p-2 h-48 flex items-center justify-center">
                    {selectedImages.length > 0 && (
                      <img
                        src={selectedImages[0] || "/placeholder.svg"}
                        alt="תצוגה מקדימה"
                        className="max-w-full max-h-full object-contain"
                      />
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="image-resolution" className="text-sm">
                        רזולוציה
                      </Label>
                      <Select
                        value={imageEditSettings.resolution}
                        onValueChange={(value) => handleImageSettingChange("resolution", value)}
                      >
                        <SelectTrigger id="image-resolution">
                          <SelectValue placeholder="בחר רזולוציה" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="original">מקורי</SelectItem>
                          <SelectItem value="high">גבוהה (1920x1080)</SelectItem>
                          <SelectItem value="medium">בינונית (1280x720)</SelectItem>
                          <SelectItem value="low">נמוכה (640x360)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="image-sharpness" className="text-sm">
                          חידוד
                        </Label>
                        <span className="text-xs text-gray-500">{imageEditSettings.sharpness}%</span>
                      </div>
                      <Slider
                        id="image-sharpness"
                        min={0}
                        max={100}
                        step={1}
                        value={[imageEditSettings.sharpness]}
                        onValueChange={(value) => handleImageSettingChange("sharpness", value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="image-noise" className="text-sm">
                          הסרת רעשים
                        </Label>
                        <span className="text-xs text-gray-500">{imageEditSettings.noise}%</span>
                      </div>
                      <Slider
                        id="image-noise"
                        min={0}
                        max={100}
                        step={1}
                        value={[imageEditSettings.noise]}
                        onValueChange={(value) => handleImageSettingChange("noise", value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="image-contrast" className="text-sm">
                          ניגודיות
                        </Label>
                        <span className="text-xs text-gray-500">{imageEditSettings.contrast}%</span>
                      </div>
                      <Slider
                        id="image-contrast"
                        min={0}
                        max={100}
                        step={1}
                        value={[imageEditSettings.contrast]}
                        onValueChange={(value) => handleImageSettingChange("contrast", value[0])}
                      />
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-purple-600 border-purple-200 hover:bg-purple-50"
                      onClick={handleAiSuggestions}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 size={16} className="mr-2 animate-spin" />
                          מעבד...
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} className="mr-2" />
                          קבל המלצות AI לשיפור התמונה
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start mb-3">
                  <div className="mr-3 mt-1">
                    <Owl size="small" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800">שיפור תמונות לנדל"ן</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      הפוך את התמונות שלך למקצועיות ומכירתיות יותר עם הכלים המתקדמים שלנו
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-white rounded-lg border p-3 space-y-3 hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Lightbulb className="h-5 w-5 text-blue-600" />
                      </div>
                      <h5 className="text-sm font-medium mr-2">שיפור תאורה</h5>
                    </div>
                    <p className="text-xs text-gray-500">הבהרת חללים חשוכים והדגשת פרטים</p>
                    <Button size="sm" variant="outline" className="w-full">
                      החל
                    </Button>
                  </div>

                  <div className="bg-white rounded-lg border p-3 space-y-3 hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Maximize className="h-5 w-5 text-blue-600" />
                      </div>
                      <h5 className="text-sm font-medium mr-2">הדגשת מרחב</h5>
                    </div>
                    <p className="text-xs text-gray-500">יצירת תחושת מרחב גדול יותר בחללים</p>
                    <Button size="sm" variant="outline" className="w-full">
                      החל
                    </Button>
                  </div>

                  <div className="bg-white rounded-lg border p-3 space-y-3 hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Palette className="h-5 w-5 text-blue-600" />
                      </div>
                      <h5 className="text-sm font-medium mr-2">שיפור צבעים</h5>
                    </div>
                    <p className="text-xs text-gray-500">התאמת צבעים לתצוגה אטרקטיבית יותר</p>
                    <Button size="sm" variant="outline" className="w-full">
                      החל
                    </Button>
                  </div>
                </div>

                <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600">
                  <Wand2 size={16} className="mr-2" />
                  שפר את כל התמונות אוטומטית
                </Button>
              </div>

              {/* ניקוי בלאגן וריהוט וירטואלי */}
              <div className="border rounded-lg p-4 bg-green-50 border-green-200 mt-4">
                <div className="flex items-start mb-3">
                  <div className="mr-3 mt-1">
                    <Owl size="small" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-800">שיפורים מתקדמים לתמונות נדל"ן</h4>
                    <p className="text-sm text-green-700 mt-1">הפוך את הנכס למושך יותר עם כלי העריכה החכמים שלנו</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-white rounded-lg border p-3 space-y-3 hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Trash2 className="h-5 w-5 text-green-600" />
                      </div>
                      <h5 className="text-sm font-medium mr-2">ניקוי בלאגן אוטומטי</h5>
                    </div>
                    <p className="text-xs text-gray-500">הסרת חפצים מיותרים וסידור החלל באופן אוטומטי</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => selectedImages.length > 0 && cleanupImageClutter(0)}
                      disabled={selectedImages.length === 0 || isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          מנקה...
                        </>
                      ) : (
                        <>החל</>
                      )}
                    </Button>
                  </div>

                  <div className="bg-white rounded-lg border p-3 space-y-3 hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Layers className="h-5 w-5 text-green-600" />
                      </div>
                      <h5 className="text-sm font-medium mr-2">ריהוט וירטואלי</h5>
                    </div>
                    <p className="text-xs text-gray-500">הוספת ריהוט וירטואלי בסגנונות שונים</p>
                    <Select
                      disabled={selectedImages.length === 0 || isProcessing}
                      onValueChange={(value) => selectedImages.length > 0 && addVirtualFurniture(0, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="בחר סגנון ריהוט" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">מודרני</SelectItem>
                        <SelectItem value="classic">קלאסי</SelectItem>
                        <SelectItem value="minimalist">מינימליסטי</SelectItem>
                        <SelectItem value="luxury">יוקרתי</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {selectedImages.length >= 2 && (
                  <div className="mt-4 p-4 bg-white rounded-lg border">
                    <div className="flex items-center mb-2">
                      <div className="bg-green-100 p-2 rounded-full mr-2">
                        <ImageIcon className="h-5 w-5 text-green-600" />
                      </div>
                      <h5 className="text-sm font-medium">יצירת תמונה אחידה</h5>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">צור תמונה אחידה ומקצועית מכל התמונות שהעלית</p>
                    <Button
                      className="w-full bg-gradient-to-r from-green-600 to-teal-600"
                      onClick={createUnifiedImage}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          יוצר תמונה אחידה...
                        </>
                      ) : (
                        <>
                          <ImageIcon className="h-4 w-4 mr-2" />
                          צור תמונה אחידה
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {/* הוספת לוגו ותמונת תדמית */}
              <div className="border rounded-lg p-4 bg-white border-gray-200 mt-4">
                <h4 className="font-medium mb-3 flex items-center">
                  <Layers className="h-4 w-4 mr-1.5 text-gray-600" />
                  הוספת לוגו ותמונת תדמית
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">לוגו</Label>
                    <RadioGroup value={selectedLogoSource} onValueChange={handleLogoSourceChange} className="space-y-2">
                      <div className="flex items-center">
                        <RadioGroupItem value="none" id="images-logo-none" />
                        <Label htmlFor="images-logo-none" className="mr-2 cursor-pointer">
                          ללא לוגו
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="questionnaire" id="images-logo-questionnaire" />
                        <Label htmlFor="images-logo-questionnaire" className="mr-2 cursor-pointer">
                          השתמש בלוגו מהשאלון
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="upload" id="images-logo-upload" />
                        <Label htmlFor="images-logo-upload" className="mr-2 cursor-pointer">
                          העלה לוגו חדש
                        </Label>
                      </div>
                    </RadioGroup>

                    {selectedLogoSource === "upload" && (
                      <div className="mt-2">
                        <div className="relative">
                          <Button variant="outline" size="sm" className="w-full">
                            <Upload className="h-4 w-4 mr-2" />
                            העלה לוגו
                          </Button>
                          <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/*"
                            onChange={handleLogoUpload}
                          />
                        </div>
                      </div>
                    )}

                    {logoImage && (
                      <div className="mt-2 border rounded-md p-2 flex justify-center">
                        <img src={logoImage || "/placeholder.svg"} alt="לוגו" className="h-16 object-contain" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">תמונת תדמית</Label>
                    <RadioGroup
                      value={selectedProfileImageSource}
                      onValueChange={handleProfileImageSourceChange}
                      className="space-y-2"
                    >
                      <div className="flex items-center">
                        <RadioGroupItem value="none" id="images-profile-none" />
                        <Label htmlFor="images-profile-none" className="mr-2 cursor-pointer">
                          ללא תמונת תדמית
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="questionnaire" id="images-profile-questionnaire" />
                        <Label htmlFor="images-profile-questionnaire" className="mr-2 cursor-pointer">
                          השתמש בתמונה מהשאלון
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="upload" id="images-profile-upload" />
                        <Label htmlFor="images-profile-upload" className="mr-2 cursor-pointer">
                          העלה תמונה חדשה
                        </Label>
                      </div>
                    </RadioGroup>

                    {selectedProfileImageSource === "upload" && (
                      <div className="mt-2">
                        <div className="relative">
                          <Button variant="outline" size="sm" className="w-full">
                            <Upload className="h-4 w-4 mr-2" />
                            העלה תמונת תדמית
                          </Button>
                          <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/*"
                            onChange={handleProfileImageUpload}
                          />
                        </div>
                      </div>
                    )}

                    {profileImage && (
                      <div className="mt-2 border rounded-md p-2 flex justify-center">
                        <img
                          src={profileImage || "/placeholder.svg"}
                          alt="תמונת תדמית"
                          className="h-16 w-16 object-cover rounded-full"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <Button
                    className="w-full"
                    disabled={selectedLogoSource === "none" && selectedProfileImageSource === "none"}
                    onClick={() => {
                      // בפועל, כאן היינו מחילים את הלוגו ותמונת התדמית על התמונות הנבחרות
                      setIsProcessing(true)
                      setTimeout(() => {
                        setIsProcessing(false)
                        // הודעת הצלחה
                      }, 1500)
                    }}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        מחיל שינויים...
                      </>
                    ) : (
                      <>
                        <Check size={16} className="mr-2" />
                        החל על כל התמונות
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {aiSuggestions && (
                <div className="border rounded-lg p-4 bg-purple-50 border-purple-200">
                  <div className="flex items-start mb-3">
                    <div className="mr-3 mt-1">
                      <Owl size="small" />
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-800">המלצות AI לשיפור התמונה</h4>
                      <p className="text-sm text-purple-700 mt-1">
                        ניתחתי את התמונה שלך והנה ההמלצות שלי לשיפור המראה:
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-white rounded-lg border p-3 space-y-3">
                      <h5 className="text-sm font-medium">המלצות אוטומטיות</h5>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs">חידוד לשיפור פרטים</span>
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            החל
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs">איזון צבעים אוטומטי</span>
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            החל
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs">הגברת ניגודיות ב-15%</span>
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            החל
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg border p-3 space-y-3">
                      <h5 className="text-sm font-medium">שיפורים מותאמים לנדל"ן</h5>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs">הבהרת חללים כהים</span>
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            החל
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs">הדגשת מרחב</span>
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            החל
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs">שיפור צבעי קירות</span>
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            החל
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600">
                    <Sparkles size={16} className="mr-2" />
                    החל את כל ההמלצות
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Rest of the component... */}
        {/* I'm truncating the rest of the component for brevity */}
        <TabsContent value="videos" className="space-y-4">
          {videoCreationMode === "fromImages" ? (
            <div className="space-y-4">
              <h4 className="font-medium">יצירת סרטון מתמונות</h4>
              <p className="text-sm text-gray-600">בחר את ההגדרות הרצויות לסרטון שלך.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="video-transition" className="text-sm">
                    מעבר בין תמונות
                  </Label>
                  <Select
                    value={videoSettings.transition}
                    onValueChange={(value) => handleVideoSettingChange("transition", value)}
                  >
                    <SelectTrigger id="video-transition">
                      <SelectValue placeholder="בחר מעבר" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fade">מעבר הדרגתי</SelectItem>
                      <SelectItem value="slide">החלקה</SelectItem>
                      <SelectItem value="zoom">זום</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="video-duration" className="text-sm">
                    משך זמן תצוגת תמונה (שניות)
                  </Label>
                  <Slider
                    id="video-duration"
                    min={1}
                    max={10}
                    step={1}
                    value={[videoSettings.duration]}
                    onValueChange={(value) => handleVideoSettingChange("duration", value[0])}
                  />
                  <span className="text-xs text-gray-500">{videoSettings.duration} שניות</span>
                </div>
              </div>

              <div>
                <Label htmlFor="video-music" className="text-sm">
                  מוזיקת רקע
                </Label>
                <Select value={videoSettings.music} onValueChange={(value) => handleVideoSettingChange("music", value)}>
                  <SelectTrigger id="video-music">
                    <SelectValue placeholder="בחר מוזיקה" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">ללא מוזיקה</SelectItem>
                    <SelectItem value="acoustic">אקוסטית</SelectItem>
                    <SelectItem value="electronic">אלקטרונית</SelectItem>
                    <SelectItem value="pop">פופ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="video-title" className="text-sm">
                  כותרת הסרטון
                </Label>
                <input
                  type="text"
                  id="video-title"
                  className="w-full border rounded-md px-3 py-2"
                  value={videoSettings.title}
                  onChange={(e) => handleVideoSettingChange("title", e.target.value)}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="video-show-logo"
                  className="mr-2"
                  checked={videoSettings.showLogo}
                  onChange={(e) => handleVideoSettingChange("showLogo", e.target.checked)}
                />
                <Label htmlFor="video-show-logo" className="text-sm">
                  הצג לוגו בסרטון
                </Label>
              </div>

              {/* הוספת לוגו ותמונת תדמית */}
              <div className="border rounded-lg p-4 bg-white border-gray-200 mt-4">
                <h4 className="font-medium mb-3 flex items-center">
                  <Layers className="h-4 w-4 mr-1.5 text-gray-600" />
                  הוספת לוגו
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">לוגו</Label>
                    <RadioGroup value={selectedLogoSource} onValueChange={handleLogoSourceChange} className="space-y-2">
                      <div className="flex items-center">
                        <RadioGroupItem value="none" id="video-logo-none" />
                        <Label htmlFor="video-logo-none" className="mr-2 cursor-pointer">
                          ללא לוגו
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="questionnaire" id="video-logo-questionnaire" />
                        <Label htmlFor="video-logo-questionnaire" className="mr-2 cursor-pointer">
                          השתמש בלוגו מהשאלון
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="upload" id="video-logo-upload" />
                        <Label htmlFor="video-logo-upload" className="mr-2 cursor-pointer">
                          העלה לוגו חדש
                        </Label>
                      </div>
                    </RadioGroup>

                    {selectedLogoSource === "upload" && (
                      <div className="mt-2">
                        <div className="relative">
                          <Button variant="outline" size="sm" className="w-full">
                            <Upload className="h-4 w-4 mr-2" />
                            העלה לוגו
                          </Button>
                          <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/*"
                            onChange={handleLogoUpload}
                          />
                        </div>
                      </div>
                    )}

                    {logoImage && (
                      <div className="mt-2 border rounded-md p-2 flex justify-center">
                        <img src={logoImage || "/placeholder.svg"} alt="לוגו" className="h-16 object-contain" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Button
                className="bg-gradient-to-r from-purple-600 to-indigo-600"
                disabled={isProcessing}
                onClick={generateVideo}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    יוצר סרטון...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    צור סרטון
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-medium">העלאת סרטון</h4>
              <p className="text-sm text-gray-600">גרור סרטון לכאן או לחץ להעלאה</p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div className="flex flex-col items-center">
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-2">גרור סרטון לכאן או לחץ להעלאה</p>
                  <p className="text-xs text-gray-500 mb-4">MP4, MOV, AVI עד 100MB</p>
                  <div className="relative">
                    <Button variant="outline" size="sm">
                      בחר סרטון
                    </Button>
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="video/*"
                      onChange={handleVideoUpload}
                    />
                  </div>
                </div>
              </div>

              {selectedVideo && (
                <div className="border rounded-lg p-4">
                  <video src={selectedVideo} controls className="w-full aspect-video"></video>
                  <div className="mt-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Pencil className="h-4 w-4 mr-2" />
                      ערוך סרטון
                    </Button>
                  </div>
                </div>
              )}

              {selectedVideo && (
                <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                  <div className="flex items-start mb-3">
                    <div className="mr-3 mt-1">
                      <Owl size="small" />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-800">שיפור איכות סרטון</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        הפוך את הסרטון שלך למקצועי יותר עם הכלים המתקדמים שלנו
                      </p>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600"
                    onClick={enhanceVideoQuality}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        משפר איכות...
                      </>
                    ) : (
                      <>
                        <Wand2 size={16} className="mr-2" />
                        שפר איכות אוטומטית
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="drawings" className="space-y-4">
          {selectedDrawing ? (
            <div className="space-y-4">
              <img src={selectedDrawing || "/placeholder.svg"} alt="שרטוט" className="max-w-full" />
              <Button variant="outline" onClick={generateRenderingFromDrawing} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    יוצר הדמיה...
                  </>
                ) : (
                  <>צור הדמיה מהשרטוט</>
                )}
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="flex flex-col items-center">
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">גרור שרטוט לכאן או לחץ להעלאה</p>
                <p className="text-xs text-gray-500 mb-4">PNG, JPG, PDF עד 5MB</p>
                <div className="relative">
                  <Button variant="outline" size="sm">
                    בחר שרטוט
                  </Button>
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*, application/pdf"
                    onChange={handleDrawingUpload}
                  />
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="ai-generation" className="space-y-4">
          <div className="space-y-4">
            <Label htmlFor="ai-image-prompt">תיאור התמונה</Label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                id="ai-image-prompt"
                className="w-full border rounded-md px-3 py-2"
                placeholder="דירה מודרנית עם נוף לים"
                value={aiImagePrompt}
                onChange={(e) => setAiImagePrompt(e.target.value)}
              />
              <Button variant="outline" size="sm" onClick={generateImageDescriptionSuggestions} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    טוען...
                  </>
                ) : (
                  <>קבל הצעות</>
                )}
              </Button>
            </div>

            {imageDescriptionSuggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-500">הצעות:</p>
                <div className="flex flex-wrap gap-2">
                  {imageDescriptionSuggestions.map((suggestion, index) => (
                    <Button key={index} variant="outline" size="sm" onClick={() => selectImageDescription(suggestion)}>
                      {suggestion}
                    </Button>
                  ))}
                  {!showMoreSuggestions && (
                    <Button variant="link" size="sm" onClick={requestMoreSuggestions}>
                      הצג עוד הצעות
                    </Button>
                  )}
                </div>
              </div>
            )}

            <Button
              className="bg-gradient-to-r from-purple-600 to-indigo-600"
              onClick={generateAiImage}
              disabled={isGeneratingAiImage || !aiImagePrompt.trim()}
            >
              {isGeneratingAiImage ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  יוצר תמונה...
                </>
              ) : (
                <>צור תמונה</>
              )}
            </Button>

            {generatedImages.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {generatedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="w-32 h-32 rounded-md overflow-hidden border border-gray-200">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`תמונה שנוצרה על ידי AI ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between mt-4">
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          חזרה
        </Button>
        <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
          המשך
          <Check className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Make sure to export the component as default as well
export default MediaEditor

