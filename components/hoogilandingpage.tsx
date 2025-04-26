"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Gift,
  CheckCircle,
  Clock,
  MessageSquare,
  FileText,
  Clock3,
  DollarSign,
  Users,
  Clipboard,
  X,
  Printer,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function HoogiLandingPage() {
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])

  const surveyRef = useRef<HTMLDivElement>(null)
  const launchInfoRef = useRef<HTMLElement>(null)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handlePriorityToggle = (priority: string) => {
    setSelectedPriorities((prev) => {
      // אם כבר נבחר, הסר אותו
      if (prev.includes(priority)) {
        return prev.filter((p) => p !== priority)
      }
      // אם עדיין לא הגענו ל-5 בחירות, הוסף אותו
      if (prev.length < 5) {
        return [...prev, priority]
      }
      // אחרת השאר את הרשימה כמו שהיא
      return prev
    })
  }

  const handlePrintTerms = () => {
    const printContent = document.getElementById("terms-content")
    const originalBody = document.body.innerHTML

    if (printContent) {
      document.body.innerHTML = printContent.innerHTML
      window.print()
      document.body.innerHTML = originalBody
      // Re-attach event listeners after printing
      setShowTerms(true)
    }
  }

  const handlePrintPrivacy = () => {
    const printContent = document.getElementById("privacy-content")
    const originalBody = document.body.innerHTML

    if (printContent) {
      document.body.innerHTML = printContent.innerHTML
      window.print()
      document.body.innerHTML = originalBody
      // Re-attach event listeners after printing
      setShowPrivacy(true)
    }
  }

  const scrollToSurvey = () => {
    surveyRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToLaunchInfo = () => {
    launchInfoRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Sticky Header */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3",
          isScrolled ? "bg-white shadow-md" : "bg-transparent",
        )}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="#" className="flex items-center justify-center" prefetch={false}>
              <span className="sr-only">Hoogi</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-4 space-x-reverse">
            <Button
              asChild
              variant="ghost"
              className="text-gray-600 hover:text-teal-600"
            >
              <a href="/post-creation">יצירת פוסט</a>
            </Button>
            <Button
              onClick={() => setShowLeadForm(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 rounded-md shadow-md hover:shadow-lg transition-all"
            >
              הירשם עכשיו
            </Button>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/signin" passHref>
              <Button variant="outline">התחברות</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Premium Design */}
      <section className="pt-28 pb-16 bg-gradient-to-b from-teal-50 to-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            {/* Content Column - Now on the right in RTL */}
            <div className="md:w-7/12">
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                    גם לעסק קטן מגיע מנהל שיווק גדול. תכירו את Hoogi.
                  </h2>
                  <div className="h-1 w-24 bg-teal-500 my-6"></div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-4 w-4 text-teal-600" />
                    </div>
                    <p className="text-lg text-gray-700 text-right">
                      <span className="font-bold text-xl text-teal-700">
                        Hoogi יוצר עבורך תוכן מדויק ואישי לכל הרשתות
                      </span>{" "}
                      – ממקום אחד ובכמה קליקים.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-4 w-4 text-teal-600" />
                    </div>
                    <p className="text-lg text-gray-700 text-right">
                      <span className="font-bold text-xl text-teal-700">כל תגובה, לייק או פנייה</span> – מתועדת, מרוכזת
                      ומנוהלת בקלות במקום אחד.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-4 w-4 text-teal-600" />
                    </div>
                    <p className="text-lg text-gray-700 text-right">
                      <span className="font-bold text-xl text-teal-700">
                        המערכת מגיבה אוטומטית ללידים בוואטסאפ ובמייל
                      </span>{" "}
                      – בזמן אמת ובלי לפספס אף הזדמנות.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-4 w-4 text-teal-600" />
                    </div>
                    <p className="text-lg text-gray-700 text-right">
                      <span className="font-bold text-xl text-teal-700">והכול מותאם אישית לעסק שלך</span> – עם בינה
                      מלאכותית שמבינה את הקהל שלך ויודעת לדבר בשמך.
                    </p>
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  <Button
                    onClick={() => setShowLeadForm(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white text-lg py-6 px-8 rounded-md shadow-lg hover:shadow-xl transition-all w-full md:w-auto"
                  >
                    נסו את Hoogi – חינם, בלי התחייבות
                  </Button>

                  <div className="bg-orange-50 border border-orange-200 p-4 rounded-md shadow-sm">
                    <div className="flex items-center gap-2">
                      <Gift className="h-5 w-5 text-orange-500" />
                      <p className="font-bold text-gray-800">הטבה מיוחדת למצטרפים עכשיו!</p>
                    </div>
                    <p className="text-gray-700 mt-1">50% הנחה לחודשיים הראשונים + התנסות חינמית מורחבת</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Column - Now on the left in RTL */}
            <div className="md:w-5/12 relative">
              <div className="text-center mb-4">
                <h1 className="text-5xl font-bold text-teal-600">Hoogi</h1>
              </div>
              <div className="relative z-10">
                <Image
                  src="/hoogi-mascot.png"
                  alt="Hoogi - הסוכן השיווקי החכם"
                  width={500}
                  height={500}
                  className="object-contain mx-auto"
                  priority
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full bg-teal-100/30 -z-10"></div>
              <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-orange-100/50 -z-10"></div>
              <div className="absolute bottom-10 right-10 w-16 h-16 rounded-full bg-teal-200/50 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Cards - Premium Design */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 50% Discount Card */}
            <Card className="bg-white p-6 rounded-lg border-0 shadow-md hover:shadow-lg transition-all overflow-hidden relative">
              <div className="absolute top-0 left-0 w-2 h-full bg-teal-500"></div>
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="h-8 w-8 text-teal-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">מתנה</div>
                <div className="mt-2 text-gray-600">התנסות חינמית מורחבת</div>
                <div className="mt-2 text-gray-600">גישה מלאה לכל התכונות</div>
                <div
                  className="mt-4 text-sm bg-teal-50 p-2 rounded-md cursor-pointer hover:bg-teal-100 transition-colors"
                  onClick={scrollToLaunchInfo}
                >
                  50% הנחה לחודשיים ראשונים
                </div>
              </div>
            </Card>

            {/* Free Trial Card */}
            <Card className="bg-white p-6 rounded-lg border-0 shadow-md hover:shadow-lg transition-all overflow-hidden relative">
              <div className="absolute top-0 left-0 w-2 h-full bg-orange-500"></div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">מה הכי חשוב לך לקבל ממנהל השיווק שלנו Hoogi?</div>
                <div
                  className="mt-4 text-sm bg-orange-50 p-2 rounded-md cursor-pointer hover:bg-orange-100 transition-colors"
                  onClick={scrollToSurvey}
                >
                  אפשר להשפיע
                </div>
              </div>
            </Card>

            {/* Limited Spots Card */}
            <Card className="bg-white p-6 rounded-lg border-0 shadow-md hover:shadow-lg transition-all overflow-hidden relative">
              <div className="absolute top-0 left-0 w-2 h-full bg-teal-500"></div>
              <div className="text-center">
                <div className="text-4xl font-bold text-center text-gray-900">37</div>
                <div className="mt-2 text-gray-600">מקומות נותרו בלבד</div>
                <div className="mt-4 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div className="bg-teal-500 h-full" style={{ width: "37%" }}></div>
                </div>
                <div className="mt-2 text-sm text-gray-500">מתוך 100 מקומות להטבות הבלעדיות</div>
                <div
                  className="mt-4 text-sm bg-teal-50 p-2 rounded-md text-teal-700 cursor-pointer hover:bg-teal-100 transition-colors"
                  onClick={scrollToLaunchInfo}
                >
                  הזדרזו להבטיח את מקומכם!
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Survey Section - New Addition */}
      <section className="py-16 bg-white" ref={surveyRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-400 inline-block px-4 py-2 rounded-lg shadow-sm">
              מה הכי חשוב לך לקבל ממנהל השיווק שלנו Hoogi?
            </h2>
            <p className="text-gray-600 mt-2">ניתן לבחור עד 5 יכולות</p>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option 1 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    checked={selectedPriorities.includes("option1")}
                    onChange={() => handlePriorityToggle("option1")}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-gray-800 font-medium text-right">
                        השיווק מתפזר בין מיילים, וואטסאפ ורשתות? מערכת אחת מסדרת הכל – לידים, תגובות, משימות – במקום
                        אחד.
                      </p>
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mr-2">
                        <Users className="h-4 w-4 text-teal-600" />
                      </div>
                    </div>
                  </div>
                </label>
              </div>

              {/* Option 2 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    checked={selectedPriorities.includes("option2")}
                    onChange={() => handlePriorityToggle("option2")}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-gray-800 font-medium text-right">
                        לא הספקתם לענות בזמן – והלקוח נעלם? התשובות יוצאות אוטומטית, גם כשאתם בפגישה או בין משימות.
                      </p>
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mr-2">
                        <MessageSquare className="h-4 w-4 text-teal-600" />
                      </div>
                    </div>
                  </div>
                </label>
              </div>

              {/* Option 3 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    checked={selectedPriorities.includes("option3")}
                    onChange={() => handlePriorityToggle("option3")}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-gray-800 font-medium text-right">
                        מרגישים שהתוכן פשוט לא מביא תוצאות? התוכן שלנו מותאם לעסק שלכם – מדויק, מדבר בשפה שלכם, ומוביל
                        לפעולה.
                      </p>
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mr-2">
                        <FileText className="h-4 w-4 text-teal-600" />
                      </div>
                    </div>
                  </div>
                </label>
              </div>

              {/* Option 4 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    checked={selectedPriorities.includes("option4")}
                    onChange={() => handlePriorityToggle("option4")}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-gray-800 font-medium text-right">
                        כל תגובה לוקחת זמן? הלקוחות מחכים? תגובות אוטומטיות שעובדות בשבילכם – ומקדמות כל שיחה.
                      </p>
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mr-2">
                        <MessageSquare className="h-4 w-4 text-teal-600" />
                      </div>
                    </div>
                  </div>
                </label>
              </div>

              {/* Option 5 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    checked={selectedPriorities.includes("option5")}
                    onChange={() => handlePriorityToggle("option5")}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-gray-800 font-medium text-right">
                        קופצים בין כלים, מערכות, אפליקציות – רק כדי לנהל את השיווק? שליטה מלאה על כל הדיגיטל – מתוכן ועד
                        לידים – דרך מערכת אחת פשוטה.
                      </p>
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mr-2">
                        <Clipboard className="h-4 w-4 text-teal-600" />
                      </div>
                    </div>
                  </div>
                </label>
              </div>

              {/* Option 6 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    checked={selectedPriorities.includes("option6")}
                    onChange={() => handlePriorityToggle("option6")}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-gray-800 font-medium text-right">
                        הנראות שלכם משתנה בין רשת לרשת? מותג אחד, קו אחד, נראות אחידה ומקצועית בכל פלטפורמה.
                      </p>
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mr-2">
                        <FileText className="h-4 w-4 text-teal-600" />
                      </div>
                    </div>
                  </div>
                </label>
              </div>

              {/* Option 7 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    checked={selectedPriorities.includes("option7")}
                    onChange={() => handlePriorityToggle("option7")}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-gray-800 font-medium text-right">
                        קשה להבין מה באמת עובד? מערכת נתונים ברורה שמראה לכם מה עובד – ומה לשפר.
                      </p>
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mr-2">
                        <Clock3 className="h-4 w-4 text-teal-600" />
                      </div>
                    </div>
                  </div>
                </label>
              </div>

              {/* Option 8 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    checked={selectedPriorities.includes("option8")}
                    onChange={() => handlePriorityToggle("option8")}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-gray-800 font-medium text-right">
                        משלמים על כמה מערכות – ולא באמת משתמשים בהן? תשלום חכם אחד שמכסה את כל מה שצריך.
                      </p>
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mr-2">
                        <DollarSign className="h-4 w-4 text-teal-600" />
                      </div>
                    </div>
                  </div>
                </label>
              </div>

              {/* Option 9 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    checked={selectedPriorities.includes("option9")}
                    onChange={() => handlePriorityToggle("option9")}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-gray-800 font-medium text-right">
                        לא יודעים מה לפרסם? מרגישים שחגים, אירועים ומאמרים פשוט מתפספסים? מאגר תוכן שמתעדכן כל הזמן מספק לכם רעיונות רלוונטיים ומדויקים – בזמן הנכון.
                      </p>
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mr-2">
                        <FileText className="h-4 w-4 text-teal-600" />
                      </div>
                    </div>
                  </div>
                </label>
              </div>

              {/* Option 10 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    checked={selectedPriorities.includes("option10")}
                    onChange={() => handlePriorityToggle("option10")}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-gray-800 font-medium text-right">
                        💬 התגובות האוטומטיות מרגישות קרות או רובוטיות? האוטומציה נכתבת בסגנון שלכם – אישית, אנושית, ומותאמת לשפה של העסק.
                      </p>
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mr-2">
                        <MessageSquare className="h-4 w-4 text-teal-600" />
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button
                onClick={() => setShowLeadForm(true)}
                className="bg-teal-600 hover:bg-teal-700 text-white text-lg py-4 px-8 rounded-md shadow-lg hover:shadow-xl transition-all"
              >
                קבל פתרון מותאם אישית
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Launch Info Section - Premium Design */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-700 text-white" ref={launchInfoRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">היו מהראשונים לגלות איך זה מרגיש כששיווק קורה לבד</h2>
            {/* הסרת המשפט על מתי תושק האפליקציה */}
          </div>

          <div className="bg-white/10 p-8 rounded-lg shadow-lg backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-right">
                <h3 className="text-2xl font-bold mb-4">למה להצטרף עכשיו?</h3>
                <ul className="space-y-3 text-left">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-orange-300 flex-shrink-0" />
                    <span>תקבלו גישה מוקדמת לפני כולם</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-orange-300 flex-shrink-0" />
                    <span>תהנו מהטבות בלעדיות שלא יחזרו</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-orange-300 flex-shrink-0" />
                    <span>תשפיעו על פיתוח התכונות העתידיות</span>
                  </li>
                </ul>
              </div>

              {/* הסרת האיקון והתאריך */}
            </div>
          </div>

          <div className="text-center mt-10">
            <Button
              onClick={() => setShowLeadForm(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white text-lg py-6 px-8 rounded-md shadow-lg hover:shadow-xl transition-all"
            >
              הבטיחו את מקומכם עכשיו
            </Button>
            <p className="mt-4 text-teal-100">
              <Clock className="inline-block h-4 w-4 ml-1" />
              מספר המקומות מוגבל! נותרו עוד{" "}
              <span className="font-bold text-white bg-teal-500 px-2 py-1 rounded-md">37</span> מקומות
            </p>
          </div>
        </div>
      </section>

      {/* Features Section - Premium Design */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              מה <span className="text-teal-600">Hoogi</span> יכול לעשות בשבילך?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              <span className="font-semibold text-teal-600">Hoogi</span> משלב טכנולוגיית AI מתקדמת ואוטומציה מלאה לפתרון
              שיווקי עוצמת משלב טכנולוגיית AI מתקדמת ואוטומציה מלאה לפתרון שיווקי עוצמתי ומותאם אישית
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature Cards */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all border-t-4 border-teal-500">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                  <span className="text-2xl">🔥</span>
                </div>
                <h3 className="text-xl font-bold">יצירת תוכן מדויק ואיכותי</h3>
              </div>
              <p className="text-gray-600">תוכן שיווקי חד, מקצועי, ואוטומטי – מותאם בדיוק לעסק שלך.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all border-t-4 border-orange-500">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-bold">ניהול ומעקב לידים מתקדם</h3>
              </div>
              <p className="text-gray-600">
                מערכת ניהול לידים חכמה שמוודאת שאף לקוח לא הולך לאיבוד, עם מעקב רציף וחיבור מהיר ללקוחות פוטנציאליים.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all border-t-4 border-teal-500">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold">מענה אוטומטי חכם</h3>
              </div>
              <p className="text-gray-600">
                תגובה אוטומטית מהירה ומקצועית לפניות ותגובות, שחוסכת לך זמן יקר ומשפרת משמעותית את חוויית הלקוח.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Premium Design */}
      <section className="py-16 bg-gradient-to-br from-teal-600 to-teal-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">מוכנים להתחיל?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            הצטרפו ל-Hoogi כדי לחסוך זמן, להגדיל את ההכנסות ולשפר את הנוכחות הדיגיטלית שלכם.
          </p>
          <Button
            className="bg-white text-teal-600 hover:bg-gray-100 py-4 px-8 rounded-md text-lg font-bold shadow-lg hover:shadow-xl transition-all"
            onClick={() => setShowLeadForm(true)}
          >
            התחילו את הניסיון החינמי שלכם עכשיו
          </Button>
        </div>
      </section>

      {/* Footer - Premium Design */}
      <footer className="bg-white py-8 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <span className="font-bold text-xl text-teal-600">Hoogi</span>
              </div>
              <p className="text-gray-600 mt-1">הסוכן השיווקי האישי שלך</p>
            </div>
            <div className="flex space-x-6 space-x-reverse">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setShowTerms(true)
                }}
                className="text-gray-600 hover:text-teal-600"
              >
                תנאי שימוש
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setShowPrivacy(true)
                }}
                className="text-gray-600 hover:text-teal-600"
              >
                מדיניות פרטיות
              </a>
            </div>
          </div>
          <div className="mt-4 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Hoogi. כל הזכויות שמורות.
          </div>
        </div>
      </footer>

      {/* Lead Capture Form Modal - Premium Design */}
      {showLeadForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowLeadForm(false)}
        >
          <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white p-6 rounded-lg shadow-2xl border-t-4 border-teal-500">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">השאירו פרטים ונחזור אליכם</h3>
                <p className="text-gray-600 mt-2">מלאו את הפרטים ונציג יצור איתכם קשר בהקדם</p>
                <div className="mt-4 bg-orange-50 p-3 rounded-md border border-orange-100">
                  <div className="flex items-center gap-2 justify-center">
                    <Gift className="h-5 w-5 text-orange-500" />
                    <p className="font-bold text-gray-800">הטבה מיוחדת למצטרפים עכשיו!</p>
                  </div>
                  <p className="text-gray-700 mt-1 text-sm">50% הנחה לחודשיים הראשונים + התנסות חינמית מורחבת</p>
                </div>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">שם מלא</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    placeholder="הכניסו שם מלא"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">טלפון</label>
                  <input
                    type="tel"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    placeholder="הכניסו מספר טלפון"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">אימייל</label>
                  <input
                    type="email"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    placeholder="הכניסו כתובת אימייל"
                  />
                </div>
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-medium shadow-md hover:shadow-lg transition-all">
                  שליחה והתחלת ניסיון
                </Button>
                <p className="text-center text-sm text-gray-500 mt-2">
                  לחיצה על "שליחה" מהווה הסכמה ל
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowLeadForm(false)
                      setShowTerms(true)
                    }}
                    className="text-teal-600 hover:underline mx-1"
                  >
                    תנאי השימוש
                  </a>
                  ול
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowLeadForm(false)
                      setShowPrivacy(true)
                    }}
                    className="text-teal-600 hover:underline mr-1"
                  >
                    מדיניות הפרטיות
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {showTerms && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setShowTerms(false)}
        >
          <div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white p-6 rounded-lg shadow-2xl border-t-4 border-teal-500">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900">תנאי שימוש באפליקציית AI-4Biz</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrintTerms}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="הדפס"
                  >
                    <Printer className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setShowTerms(false)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="סגור"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div id="terms-content" className="text-sm text-gray-600">
                <p className="text-gray-500">עודכן לאחרונה: 20.4.2024</p>

                <div className="mt-4 space-y-4">
                  <p>
                    ברוכים הבאים לאפליקציית AI-4Biz (להלן: "האפליקציה" או "השירות"). השימוש באפליקציה מהווה הסכמה מלאה
                    ומחייבת לכל התנאים המפורטים להלן. האפליקציה פתוחה לשימוש לכלל הגילאים, אך מומלץ להשתמש בה באחריות,
                    ובייחוד לצרכים עסקיים.
                  </p>

                  <div>
                    <h4 className="font-bold text-lg text-gray-800 mb-2">1. רישום לשירות</h4>
                    <p>
                      בעת ההרשמה לאפליקציה, תידרשו להזין פרטים מזהים, לרבות: שם מלא, כתובת דוא"ל, מספר טלפון, תחום עיסוק
                      ופרטים נוספים. המידע נדרש לצורך הפעלת השירות, מתן תמיכה ושיפור חוויית המשתמש באמצעות התאמה אישית.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg text-gray-800 mb-2">2. שימוש מותר</h4>
                    <p>
                      השימוש באפליקציה מותר לצרכים חוקיים בלבד. אין לבצע בה שימוש לרעה, לפגוע בזכויות של אחרים או לנסות
                      לשבש את פעולתה התקינה של המערכת. כל תוכן שנוצר במסגרת השימוש באפליקציה הינו באחריות הבלעדית של
                      המשתמש/ת.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg text-gray-800 mb-2">3. קניין רוחני</h4>
                    <p>
                      כלל הזכויות באפליקציה, לרבות תכנים, עיצובים, לוגואים, קוד המקור וכל רכיב אחר – שייכים ל-AI-4Biz.
                      אין להעתיק, לשכפל, להפיץ, לפרסם או לעשות כל שימוש אחר בהם ללא אישור מראש ובכתב.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg text-gray-800 mb-2">4. שינויים בתנאי השימוש</h4>
                    <p>
                      AI-4Biz שומרת לעצמה את הזכות לעדכן או לשנות את תנאי השימוש בכל עת. עדכונים כאמור יפורסמו
                      באפליקציה, והם ייכנסו לתוקפם מרגע הפרסום. המשך השימוש באפליקציה לאחר העדכון ייחשב כהסכמה לתנאים
                      המעודכנים.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg text-gray-800 mb-2">5. הרשאות לרשתות חברתיות</h4>
                    <p>
                      במהלך השימוש באפליקציה, המשתמש/ת רשאי/ת לחבר את חשבונותיו/ה העסקיים למערכת. עם מתן ההרשאה,
                      האפליקציה תקבל גישה לבצע את הפעולות הבאות (בהתאם להגדרות שיאושרו על-ידי המשתמש/ת):
                    </p>
                    <ul className="list-disc list-inside mr-4 mt-2 space-y-1">
                      <li>ניתוח תכנים, תגובות וסטטיסטיקות.</li>
                      <li>פרסום פוסטים ותכנים.</li>
                      <li>מענה לתגובות ולידים.</li>
                      <li>שילוב נתונים עם מערכות CRM או דוחות חיצוניים.</li>
                    </ul>
                    <p className="mt-2">ניתן לבטל את ההרשאות בכל עת דרך הגדרות החשבון.</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Button onClick={() => setShowTerms(false)} className="bg-teal-500 hover:bg-teal-600 text-white">
                  הבנתי ומסכים/ה
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setShowPrivacy(false)}
        >
          <div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white p-6 rounded-lg shadow-2xl border-t-4 border-teal-500">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900">מדיניות פרטיות - AI-4Biz</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrintPrivacy}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="הדפס"
                  >
                    <Printer className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setShowPrivacy(false)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="סגור"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div id="privacy-content" className="text-sm text-gray-600">
                <p className="text-gray-500">עודכן לאחרונה: 20.4.2024</p>

                <div className="mt-4 space-y-4">
                  <p>
                    אנו ב-AI-4Biz מחויבים לשמירה על פרטיותך. מדיניות זו מסבירה כיצד אנו אוספים, משתמשים ומגנים על המידע
                    האישי שלך.
                  </p>

                  <div>
                    <h4 className="font-bold text-lg text-gray-800 mb-2">1. איסוף מידע</h4>
                    <p>אנו אוספים מידע שאתה מספק לנו באופן ישיר בעת ההרשמה והשימוש בשירות, כגון:</p>
                    <ul className="list-disc list-inside mr-4 mt-2 space-y-1">
                      <li>פרטים אישיים (שם, כתובת דוא"ל, מספר טלפון)</li>
                      <li>פרטי עסק ותחום עיסוק</li>
                      <li>מידע מחשבונות רשתות חברתיות מקושרים (בהתאם להרשאות שניתנו)</li>
                      <li>נתוני שימוש ואינטראקציה עם האפליקציה</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg text-gray-800 mb-2">2. שימוש במידע</h4>
                    <p>המידע שנאסף משמש אותנו למטרות הבאות:</p>
                    <ul className="list-disc list-inside mr-4 mt-2 space-y-1">
                      <li>אספקת השירותים המבוקשים והתאמתם אישית לצרכיך</li>
                      <li>שיפור ופיתוח האפליקציה והשירותים שלנו</li>
                      <li>תקשורת עמך בנושאים הקשורים לשירות</li>
                      <li>ניתוח מגמות ושימושים לצורך שיפור חוויית המשתמש</li>
                      <li>עמידה בדרישות חוקיות ורגולטוריות</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg text-gray-800 mb-2">3. שיתוף מידע</h4>
                    <p>אנו לא מוכרים את המידע האישי שלך לצדדים שלישיים. עם זאת, אנו עשויים לשתף מידע במקרים הבאים:</p>
                    <ul className="list-disc list-inside mr-4 mt-2 space-y-1">
                      <li>עם ספקי שירות הפועלים מטעמנו לצורך אספקת השירותים</li>
                      <li>כאשר נדרש על פי חוק או במסגרת הליך משפטי</li>
                      <li>להגנה על זכויותינו או על בטיחות המשתמשים</li>
                      <li>במקרה של מיזוג, רכישה או מכירת נכסים (תוך הודעה מראש)</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg text-gray-800 mb-2">4. אבטחת מידע</h4>
                    <p>
                      אנו נוקטים באמצעי אבטחה סבירים כדי להגן על המידע האישי שלך מפני גישה, שימוש או חשיפה בלתי מורשים.
                      עם זאת, אין שיטת העברה או אחסון אלקטרונית שהיא בטוחה ב-100%.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg text-gray-800 mb-2">5. זכויותיך</h4>
                    <p>בהתאם לחוקי הגנת הפרטיות החלים, יש לך זכויות מסוימות ביחס למידע האישי שלך, כולל:</p>
                    <ul className="list-disc list-inside mr-4 mt-2 space-y-1">
                      <li>גישה למידע האישי שלך</li>
                      <li>תיקון מידע לא מדויק</li>
                      <li>מחיקת המידע (בכפוף למגבלות חוקיות)</li>
                      <li>הגבלת עיבוד המידע</li>
                      <li>התנגדות לעיבוד מסוים של המידע</li>
                    </ul>
                    <p className="mt-2">
                      לבקשות בנושא זכויותיך, אנא פנה אלינו באמצעות פרטי הקשר המופיעים בסוף מדיניות זו.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg text-gray-800 mb-2">6. שינויים במדיניות</h4>
                    <p>
                      אנו עשויים לעדכן מדיניות פרטיות זו מעת לעת. שינויים משמעותיים יפורסמו באפליקציה ויכנסו לתוקף מיד
                      עם פרסומם. המשך השימוש בשירות לאחר פרסום השינויים מהווה הסכמה למדיניות המעודכנת.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg text-gray-800 mb-2">7. יצירת קשר</h4>
                    <p>לשאלות או בירורים בנוגע למדיניות הפרטיות שלנו, אנא צור קשר בכתובת: privacy@ai-4biz.com</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Button onClick={() => setShowPrivacy(false)} className="bg-teal-500 hover:bg-teal-600 text-white">
                  הבנתי ומסכים/ה
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
