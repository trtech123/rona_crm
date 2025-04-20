"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronRight, ChevronLeft, Mic, Info, ArrowLeft, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function QuestionnaireScreen() {
  const [step, setStep] = useState(1)
  const [category, setCategory] = useState<string | null>(null)
  const [location, setLocation] = useState("")
  const [recording, setRecording] = useState(false)
  const [showAiSuggestion, setShowAiSuggestion] = useState(false)

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleReset = () => {
    if (confirm("האם אתה בטוח שברצונך לאפס את כל התשובות?")) {
      setStep(1)
      setCategory(null)
      setLocation("")
    }
  }

  const toggleRecording = () => {
    setRecording(!recording)
  }

  const toggleAiSuggestion = () => {
    setShowAiSuggestion(!showAiSuggestion)
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-50 to-cyan-50 p-4 md:p-8 flex flex-col items-center"
      dir="rtl"
    >
      <div className="w-full max-w-3xl">
        <div className="flex justify-end mb-6">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 mb-4">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="45" fill="#38bdf8" />
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
          <h1 className="text-2xl font-bold mb-2">בנה את הסוכן האישי שלך</h1>
          <p className="text-gray-600 mb-4">ספר לנו עליך כדי שניצור עבורך תוכן מדויק!</p>

          <div className="w-full mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>
                שלב {step} מתוך {totalSteps}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {step === 1 && (
          <Card className="mb-6 shadow-md">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">בחר קטגוריה</h2>
                  <p className="text-gray-500 text-sm mb-4">
                    בחירת הקטגוריה תעזור לנו להתאים את התוכן לתחום העיסוק שלך
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { id: "realestate", name: 'נדל"ן', icon: "🏢" },
                      { id: "legal", name: "משפטים", icon: "⚖️" },
                      { id: "therapy", name: "טיפול", icon: "💆" },
                      { id: "education", name: "חינוך", icon: "🎓" },
                      { id: "retail", name: "קמעונאות", icon: "🛒" },
                      { id: "other", name: "אחר", icon: "✨" },
                    ].map((cat) => (
                      <div
                        key={cat.id}
                        className={`border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${
                          category === cat.id
                            ? "border-purple-500 bg-purple-50 shadow-sm"
                            : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/50"
                        }`}
                        onClick={() => setCategory(cat.id)}
                      >
                        <span className="text-3xl mb-2">{cat.icon}</span>
                        <span className="font-medium">{cat.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-2">הזן את המיקום שלך</h2>
                  <p className="text-gray-500 text-sm mb-4">המיקום יעזור לנו להתאים תוכן רלוונטי לאזור שלך</p>
                  <Input placeholder="הזן עיר או אזור" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-2">הוסף קישורים לאתרים ורשתות חברתיות</h2>
                  <p className="text-gray-500 text-sm mb-4">קישורים אלו יעזרו לנו לאסוף מידע על הפעילות העסקית שלך</p>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="website">אתר אינטרנט</Label>
                      <Input id="website" placeholder="https://www.example.com" />
                    </div>
                    <div>
                      <Label htmlFor="facebook">עמוד פייסבוק</Label>
                      <Input id="facebook" placeholder="https://www.facebook.com/yourpage" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="mb-6 shadow-md">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="bg-purple-100 px-3 py-1 rounded-full text-sm font-medium text-purple-800 flex items-center gap-2">
                  <span>
                    הקטגוריה שנבחרה: {category === "realestate" ? 'נדל"ן' : category === "therapy" ? "טיפול" : category}
                  </span>
                </div>
                <div className="bg-cyan-100 px-3 py-1 rounded-full text-sm font-medium text-cyan-800 flex items-center gap-2">
                  <span>מיקום: {location || "תל אביב"}</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">תאר את העסק/שירות שלך</h2>
                  <p className="text-gray-500 text-sm mb-4">
                    ספר לנו יותר על העסק שלך כדי שנוכל להתאים את התוכן בצורה טובה יותר
                  </p>

                  <div className="relative">
                    <Textarea
                      placeholder="תאר את השירותים שאתה מציע והיתרונות המרכזיים שלך"
                      className="min-h-[120px]"
                    />
                    <Button
                      variant={recording ? "destructive" : "outline"}
                      size="icon"
                      className="absolute bottom-3 left-3"
                      onClick={toggleRecording}
                    >
                      <Mic className={`h-4 w-4 ${recording ? "animate-pulse" : ""}`} />
                    </Button>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-2">מי קהל היעד שלך?</h2>
                  <p className="text-gray-500 text-sm mb-4">בחר את המאפיינים העיקריים של הלקוחות שלך</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { id: "women", label: "נשים" },
                      { id: "men", label: "גברים" },
                      { id: "youth", label: "נוער/ילדים" },
                      { id: "adults", label: "מבוגרים", defaultChecked: true },
                      { id: "families", label: "משפחות" },
                      { id: "professionals", label: "מקצועיים", defaultChecked: true },
                      { id: "seniors", label: "גיל הזהב" },
                      { id: "other", label: "אחר" },
                    ].map((audience) => (
                      <div key={audience.id} className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox id={`audience-${audience.id}`} defaultChecked={audience.defaultChecked} />
                        <Label htmlFor={`audience-${audience.id}`}>{audience.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {category === "therapy" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-2">אילו שיטות טיפול אתה מציע?</h2>
                    <p className="text-gray-500 text-sm mb-4">בחר את שיטות הטיפול שאתה מתמחה בהן</p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { id: "swedish", label: "עיסוי שוודי", defaultChecked: true },
                        { id: "reflexology", label: "רפלקסולוגיה", defaultChecked: true },
                        { id: "shiatsu", label: "שיאצו" },
                        { id: "physio", label: "פיזיותרפיה" },
                        { id: "emotional", label: "טיפול רגשי" },
                        { id: "other", label: "אחר", defaultChecked: true },
                      ].map((method) => (
                        <div key={method.id} className="flex items-center space-x-2 space-x-reverse">
                          <Checkbox id={`method-${method.id}`} defaultChecked={method.defaultChecked} />
                          <Label htmlFor={`method-${method.id}`}>{method.label}</Label>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3">
                      <Input placeholder="פרט שיטות טיפול נוספות" defaultValue="טיפולים הוליסטיים משולבים" />
                    </div>
                  </div>
                )}

                {category === "realestate" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-2">באיזה סוג נכסים אתה מתמחה?</h2>
                    <p className="text-gray-500 text-sm mb-4">בחר את סוגי הנכסים שאתה עובד איתם</p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { id: "residential", label: "דירות מגורים", defaultChecked: true },
                        { id: "commercial", label: "נכסים מסחריים" },
                        { id: "investment", label: "נכסי השקעה", defaultChecked: true },
                        { id: "luxury", label: "נכסי יוקרה" },
                        { id: "rental", label: "השכרה" },
                        { id: "development", label: "פרויקטים חדשים" },
                      ].map((property) => (
                        <div key={property.id} className="flex items-center space-x-2 space-x-reverse">
                          <Checkbox id={`property-${property.id}`} defaultChecked={property.defaultChecked} />
                          <Label htmlFor={`property-${property.id}`}>{property.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="mb-6 shadow-md">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="bg-purple-100 px-3 py-1 rounded-full text-sm font-medium text-purple-800 flex items-center gap-2">
                  <span>
                    הקטגוריה שנבחרה: {category === "realestate" ? 'נדל"ן' : category === "therapy" ? "טיפול" : category}
                  </span>
                </div>
                <div className="bg-cyan-100 px-3 py-1 rounded-full text-sm font-medium text-cyan-800 flex items-center gap-2">
                  <span>מיקום: {location || "תל אביב"}</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">העדפות תוכן ואסטרטגיית שיווק</h2>
                  <p className="text-gray-500 text-sm mb-4">בחר את סוגי התוכן ואת גישת השיווק המועדפים עליך</p>

                  <div className="space-y-5">
                    <div>
                      <h3 className="font-medium mb-2">אילו סוגי תוכן תרצה ליצור?</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: "tips", label: "טיפים מקצועיים", defaultChecked: true },
                          { id: "offers", label: "מבצעים והנחות", defaultChecked: true },
                          { id: "stories", label: "סיפורי לקוחות", defaultChecked: true },
                          { id: "news", label: "מחקרים וחדשות" },
                        ].map((content) => (
                          <div key={content.id} className="flex items-center space-x-2 space-x-reverse">
                            <Checkbox id={`content-${content.id}`} defaultChecked={content.defaultChecked} />
                            <Label htmlFor={`content-${content.id}`}>{content.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">באיזה סגנון תרצה לתקשר עם הקהל שלך?</h3>
                      <RadioGroup defaultValue="formal">
                        {[
                          { id: "formal", label: "רשמי ומקצועי" },
                          { id: "friendly", label: "חברותי ונגיש" },
                          { id: "inspiring", label: "מעורר השראה ומוטיבציה" },
                          { id: "educational", label: "מידעי וחינוכי" },
                        ].map((style) => (
                          <div key={style.id} className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value={style.id} id={`style-${style.id}`} />
                            <Label htmlFor={`style-${style.id}`}>{style.label}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">באילו שעות הכי אפקטיבי לפרסם עבור הקהל שלך?</h3>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: "morning", label: "בוקר" },
                          { id: "noon", label: "צהריים", defaultChecked: true },
                          { id: "afternoon", label: 'אחה"צ', defaultChecked: true },
                          { id: "evening", label: "ערב" },
                        ].map((time) => (
                          <Button
                            key={time.id}
                            variant={time.defaultChecked ? "default" : "outline"}
                            className={time.defaultChecked ? "bg-purple-600 hover:bg-purple-700" : ""}
                            onClick={() => {}}
                          >
                            {time.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">באילו ימים הכי אפקטיבי לפרסם?</h3>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: "sun", label: "א", defaultChecked: true },
                          { id: "mon", label: "ב" },
                          { id: "tue", label: "ג" },
                          { id: "wed", label: "ד", defaultChecked: true },
                          { id: "thu", label: "ה" },
                          { id: "fri", label: "ו" },
                          { id: "sat", label: "ש" },
                        ].map((day) => (
                          <Button
                            key={day.id}
                            variant={day.defaultChecked ? "default" : "outline"}
                            className={`w-10 ${day.defaultChecked ? "bg-purple-600 hover:bg-purple-700" : ""}`}
                            onClick={() => {}}
                          >
                            {day.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">באיזו תדירות תרצה לפרסם תוכן?</h3>
                      <RadioGroup defaultValue="several">
                        {[
                          { id: "daily", label: "יומי" },
                          { id: "several", label: "2-3 פעמים בשבוע" },
                          { id: "weekly", label: "פעם בשבוע" },
                          { id: "biweekly", label: "פעם בשבועיים" },
                        ].map((frequency) => (
                          <div key={frequency.id} className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value={frequency.id} id={`frequency-${frequency.id}`} />
                            <Label htmlFor={`frequency-${frequency.id}`}>{frequency.label}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card className="mb-6 shadow-md">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="bg-purple-100 px-3 py-1 rounded-full text-sm font-medium text-purple-800 flex items-center gap-2">
                  <span>
                    הקטגוריה שנבחרה: {category === "realestate" ? 'נדל"ן' : category === "therapy" ? "טיפול" : category}
                  </span>
                </div>
                <div className="bg-cyan-100 px-3 py-1 rounded-full text-sm font-medium text-cyan-800 flex items-center gap-2">
                  <span>מיקום: {location || "תל אביב"}</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">התמקצעות באסטרטגיה שיווקית</h2>
                  <p className="text-gray-500 text-sm mb-4">הגדרות אחרונות לפני יצירת הסוכן האישי שלך</p>

                  <div className="space-y-5">
                    <div>
                      <h3 className="font-medium mb-2">בחר תגים (tags) לקידום התוכן שלך</h3>
                      <p className="text-gray-500 text-xs mb-3">
                        תגים מתאימים יעזרו לקדם את התוכן באלגוריתמים של הרשתות השונות
                      </p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {[
                          { id: "holistic", label: "טיפול_הוליסטי" },
                          { id: "health", label: "בריאות" },
                          { id: "swedish", label: "עיסוי_שוודי" },
                          { id: "reflexology", label: "רפלקסולוגיה" },
                          { id: "telaviv", label: "תל_אביב" },
                          { id: "healthy", label: "חיים_בריאים", selected: false },
                          { id: "emotional", label: "טיפול_רגשי", selected: false },
                        ].map((tag) => (
                          <Badge
                            key={tag.id}
                            variant={tag.selected === false ? "outline" : "default"}
                            className={`cursor-pointer ${tag.selected === false ? "" : "bg-purple-600 hover:bg-purple-700"}`}
                          >
                            #{tag.label}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Input placeholder="הוסף תג חדש" />
                        <Button size="sm" className="shrink-0">
                          <Plus className="h-4 w-4 mr-1" /> הוסף
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">מהם היעדים העסקיים שלך?</h3>
                      <p className="text-gray-500 text-xs mb-3">בחר את היעדים שהכי חשובים לך (עד 3)</p>

                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: "clients", label: "הגדלת מספר לקוחות", defaultChecked: true },
                          { id: "brand", label: "בניית מותג", defaultChecked: true },
                          { id: "awareness", label: "הגדלת מודעות", defaultChecked: true },
                          { id: "retention", label: "שימור לקוחות" },
                          { id: "revenue", label: "הגדלת הכנסה" },
                          { id: "community", label: "יצירת קהילה" },
                        ].map((goal) => (
                          <div key={goal.id} className="flex items-center space-x-2 space-x-reverse">
                            <Checkbox id={`goal-${goal.id}`} defaultChecked={goal.defaultChecked} />
                            <Label htmlFor={`goal-${goal.id}`}>{goal.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">העלאת לוגו ותמונות (אופציונלי)</h3>
                      <p className="text-gray-500 text-xs mb-3">העלאת ויזואלים תעזור ליצירת תוכן מותאם יותר</p>

                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <div className="flex flex-col items-center">
                          <p className="text-gray-500 mb-2">גרור ושחרר קבצים כאן</p>
                          <p className="text-gray-500 mb-4">או</p>
                          <Button variant="outline">בחר קבצים</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
                  <div className="text-green-600 mr-3 mt-1">🎉</div>
                  <div>
                    <h3 className="font-medium text-green-800 mb-1">כמעט סיימנו!</h3>
                    <p className="text-green-700 text-sm">
                      לחיצה על 'סיום' תיצור את הסוכן האישי שלך על בסיס המידע שסיפקת.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {showAiSuggestion && step === 3 && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAiSuggestion(false)}
          >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <span className="bg-purple-100 text-purple-800 p-1 rounded-md mr-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 17H13V19H11V17ZM11 5H13V15H11V5Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                המלצת AI
              </h3>
              <p className="text-gray-700 mb-4">
                לפי הנתונים, שעות אחה"צ בימים א' ו-ד' הן האפקטיביות ביותר עבור עסקי טיפול בתל אביב הפונים למבוגרים
                מקצועיים.
              </p>
              <Button className="w-full" onClick={() => setShowAiSuggestion(false)}>
                החל המלצה
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-col space-y-4">
          <div className="flex justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={step === 1}>
              <ChevronRight className="h-4 w-4 ml-2" />
              הקודם
            </Button>

            <Button
              onClick={step < totalSteps ? handleNext : () => alert("השאלון הושלם!")}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {step < totalSteps ? (
                <>
                  הבא
                  <ChevronLeft className="h-4 w-4 mr-2" />
                </>
              ) : (
                "סיום"
              )}
            </Button>
          </div>

          <div className="flex justify-between items-center">
            <Button variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={handleReset}>
              אפס והתחל מחדש
            </Button>

            <Button
              variant="outline"
              className="text-purple-600 hover:text-purple-800 hover:bg-purple-50"
              onClick={toggleAiSuggestion}
            >
              <Info className="h-4 w-4 ml-2" />
              הצע עבורי AI
            </Button>
          </div>

          <Alert className="bg-amber-50 border-amber-200 text-amber-800">
            <AlertDescription>שים לב! שינוי קטגוריה יאפס את כל התשובות. חשוב לבחור נכון מההתחלה.</AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}

