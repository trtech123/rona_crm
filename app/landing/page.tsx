"use client"

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Star, TrendingUp, Menu, LogIn, ChevronDown, Users, Megaphone, BarChart3, CheckCircle, BotMessageSquare, FileText } from "lucide-react";
import Image from 'next/image'; // Import Next.js Image component
import Link from 'next/link'; // Import Next.js Link component
import { motion } from "framer-motion"; // Import motion
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion" // Import Accordion

// Placeholder Line Chart Component - Adjusted colors
const LineChartPlaceholder = () => (
  <svg className="w-full h-16" fill="none" viewBox="0 0 100 40" preserveAspectRatio="none">
    {/* Adjusted stroke colors */}
    <polyline points="0,30 10,20 20,25 30,15 40,18 50,10 60,15 70,5 80,10 90,15 100,20" stroke="#86EFAC" strokeWidth="2" /> {/* Lime Green */}
    <polyline points="0,35 10,30 20,32 30,25 40,28 50,22 60,26 70,18 80,22 90,28 100,32" stroke="#A78BFA" strokeWidth="2" /> {/* Soft Purple */}
  </svg>
);

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function LandingPage() {
  return (
    // Updated background color to a lavender shade
    <div dir="rtl" className="min-h-screen bg-[#E6E0FF] p-4 sm:p-6 lg:p-8 font-sans overflow-hidden">
      {/* Header - Restructured */}
      <header className="container mx-auto mb-12 flex items-center justify-between py-4">
        {/* Logo */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
           {/* Updated Icon Placeholder - Pulse/Graph like */}
           <svg className="h-8 w-8 text-[#111827]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
             <path strokeLinecap="round" strokeLinejoin="round" d="M3 15l5-7 4 4 6-8 4 5" />
           </svg>
          <span className="text-2xl font-bold text-[#111827]">hoogi</span>
        </div>

        {/* Navigation and Login Button Wrapper */}
        <div className="hidden md:flex items-center bg-[#111827] text-white rounded-full px-3 py-2 space-x-6 rtl:space-x-reverse shadow-md">
          <nav className="flex items-center space-x-6 rtl:space-x-reverse pr-3">
            <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">אודותינו</a>
            <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">בלוג</a>
            <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">צור קשר</a>
          </nav>
          <Link href="/login" passHref>
            <Button size="sm" className="bg-lime-300 hover:bg-lime-400 text-black font-semibold px-4 py-2 rounded-full text-xs">
              <LogIn className="ml-2 h-4 w-4" />
              התחברות
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
           <Button variant="ghost" size="icon">
             <Menu className="h-6 w-6 text-gray-800" />
           </Button>
        </div>
      </header>

       {/* ----- START: Introductory Text Section ----- */}
       <motion.div
         className="container mx-auto text-center mb-16 max-w-3xl" // Centered and constrained width
         initial="hidden"
         animate="visible"
         variants={cardVariants} // Reuse card animation variant
       >
         <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4 leading-relaxed">
            נמאס לך לבזבז זמן יקר על שיווק במקום לסגור עסקאות?
         </h2>
         <p className="text-gray-600 text-lg">
            hoogi היא מערכת ה-AI שסוכני נדל"ן חיכו לה. הפוך את השיווק שלך לאוטומטי, קבל תובנות חכמות, נהל לידים בקלות - והתמקד במה שאתה עושה הכי טוב.
         </p>
       </motion.div>
       {/* ----- END: Introductory Text Section ----- */}

      {/* Main Content Grid - Added motion container */}
      <motion.main
        className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }} // Stagger animation for children
      >

        {/* Hero Section - Right Card (Text) - Updated content */}
        <motion.div variants={cardVariants} className="lg:col-span-1 order-2 lg:order-1 flex flex-col justify-center space-y-5 px-2 text-right">
          <span className="text-xs font-semibold text-gray-600 tracking-wider block">[ שיווק נדל"ן חכם עם AI ]</span>
          {/* Updated headline styling */}
          <h1 className="text-4xl md:text-5xl font-bold text-[#111827] leading-tight">
             <span className="inline-flex items-center justify-center h-8 w-8 bg-blue-500 rounded-md align-middle ml-2">
                <TrendingUp className="h-4 w-4 text-white" /> {/* Changed Icon */}
            </span>
            התחל לשווק נכסים<br/> וסגור יותר עסקאות
          </h1>
          {/* Updated button text */}
          <Button size="lg" className="bg-lime-300 hover:bg-lime-400 text-black font-bold py-3 px-6 rounded-xl shadow-md transition-transform duration-300 hover:scale-105 self-center mt-4">
             <ArrowLeft className="mr-2 h-5 w-5" /> התחל ליצור את סוכן ה-AI שלך
          </Button>
        </motion.div>

        {/* Hero Section - Left Card (Image) - Updated Alt Text */}
        <motion.div variants={cardVariants} className="lg:col-span-1 order-1 lg:order-2 aspect-square md:aspect-auto relative">
             <Image
               src="/placeholder-user.jpg" // Make sure this image exists in /public
               alt="סוכן נדלן משתמש במערכת hoogi"
               fill
               style={{objectFit: "cover"}}
               className="rounded-2xl shadow-lg"
             />
        </motion.div>

        {/* Stats Section - Cards updated content */}
        <motion.div variants={cardVariants}>
            <Card className="col-span-1 rounded-2xl p-6 shadow-lg bg-[#4338CA] text-white flex flex-col justify-between min-h-[180px]">
                <span className="text-xs font-semibold uppercase tracking-wider block opacity-80 text-right">[ דירוג משתמשים ]</span> {/* Updated Text */}
                <div className="flex items-center mt-2 justify-end">
                    <Star className="h-7 w-7 text-yellow-400 fill-current ml-2" />
                    <span className="text-5xl font-bold">4.9</span>
                </div>
                <div className="w-full h-px bg-white/20 mt-auto"></div>
            </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
            <Card className="col-span-1 rounded-2xl p-6 shadow-lg bg-white flex flex-col justify-center items-center text-center min-h-[180px]">
                <p className="text-xl font-semibold text-gray-800 leading-relaxed">
                    "הפוך כל ליד לעסקה, כל נכס להזדמנות"
                </p>
            </Card>
        </motion.div>

        <motion.div variants={cardVariants} className="lg:col-span-2">
            <Card className="col-span-1 lg:col-span-2 rounded-2xl p-6 shadow-lg bg-[#374151] text-white flex flex-col justify-between min-h-[180px]">
                <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block">[ לידים חדשים החודש ]</span> {/* Updated Text */}
                    <Button variant="outline" size="sm" className="bg-gray-700 border-gray-600 text-xs text-gray-300 hover:bg-gray-600 px-3 py-1 rounded-md flex items-center">
                        <ChevronDown className="mr-1 h-3 w-3" /> חודש
                    </Button>
                </div>
                <div className="flex items-baseline space-x-2 rtl:space-x-reverse mt-2 justify-end">
                    <TrendingUp className="h-5 w-5 text-lime-300 ml-2" />
                    <span className="text-4xl font-bold">+35%</span> {/* Example data */}
                </div>
                <div className="mt-auto">
                    <LineChartPlaceholder />
                </div>
            </Card>
        </motion.div>
        {/* ----- END: Stats Section ----- */}

         {/* ----- START: Features Section - Added 4th feature ----- */}
         <motion.div variants={cardVariants} className="lg:col-span-2 text-center mt-8 mb-4">
           <h2 className="text-3xl font-bold text-[#111827] mb-2">פלטפורמה חכמה לסוכני נדל"ן</h2>
           <p className="text-gray-600">כל הכלים שאתה צריך כדי לסגור יותר עסקאות, במקום אחד.</p>
         </motion.div>

        {/* Features Grid - Adjusted to fit 4 items */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={cardVariants}>
                <Card className="rounded-2xl p-6 shadow-lg bg-white flex flex-col items-end text-right h-full">
                    <div className="bg-purple-100 p-2 rounded-lg mb-3 inline-block">
                        <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">ניהול לידים חכם</h3>
                    <p className="text-sm text-gray-500">נהל את כל הלידים והלקוחות שלך במקום אחד, עם תזכורות ומעקב אוטומטי.</p>
                </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
                <Card className="rounded-2xl p-6 shadow-lg bg-white flex flex-col items-end text-right h-full">
                    <div className="bg-blue-100 p-2 rounded-lg mb-3 inline-block">
                        <Megaphone className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">שיווק נכסים אוטומטי</h3>
                    <p className="text-sm text-gray-500">צור קמפיינים, דפי נחיתה ותוכן שיווקי מותאם אישית בכמה קליקים.</p>
                </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
                <Card className="rounded-2xl p-6 shadow-lg bg-white flex flex-col items-end text-right h-full">
                    <div className="bg-green-100 p-2 rounded-lg mb-3 inline-block">
                        <BarChart3 className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">ניתוח שוק ותובנות AI</h3>
                    <p className="text-sm text-gray-500">קבל ניתוחי שוק עדכניים והמלצות AI חכמות לקבלת החלטות טובות יותר.</p>
                </Card>
            </motion.div>

            {/* Added 4th Feature */}
            <motion.div variants={cardVariants}>
                <Card className="rounded-2xl p-6 shadow-lg bg-white flex flex-col items-end text-right h-full">
                    <div className="bg-orange-100 p-2 rounded-lg mb-3 inline-block">
                        <FileText className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">יצירת תוכן ומאמרים</h3>
                    <p className="text-sm text-gray-500">ה-AI יכתוב עבורך פוסטים, מאמרים ותיאורי נכסים מקצועיים ומושכים.</p>
                </Card>
            </motion.div>
        </div>
        {/* ----- END: Features Section ----- */}


         {/* ----- START: How It Works Section - Updated content ----- */}
         <motion.div variants={cardVariants} className="lg:col-span-2 text-center mt-8 mb-4">
           <h2 className="text-3xl font-bold text-[#111827] mb-2">בנה את סוכן השיווק האישי שלך בדקות</h2>
           <p className="text-gray-600">שלושה שלבים פשוטים כדי להתחיל לשווק חכם יותר.</p>
         </motion.div>

        {/* Wrapped How It Works steps in a Card and motion.div */}
         <motion.div variants={cardVariants} className="lg:col-span-2">
             <Card className="rounded-2xl p-6 shadow-lg bg-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center text-center p-4">
                        <div className="bg-lime-200 text-lime-800 p-2 rounded-lg mb-3 inline-block">
                           <BotMessageSquare className="h-6 w-6" />
                        </div>
                        <h4 className="font-semibold mb-1">ענה על השאלון</h4>
                        <p className="text-sm text-gray-500">ספר לנו על העסק, ההתמחויות, קהל היעד והנכסים שלך.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4">
                        <div className="bg-lime-200 text-lime-800 p-2 rounded-lg mb-3 inline-block">
                           <BarChart3 className="h-6 w-6" />
                        </div>
                        <h4 className="font-semibold mb-1">קבל אסטרטגיה מותאמת</h4>
                        <p className="text-sm text-gray-500">ה-AI שלנו ינתח את המידע ויבנה תוכנית שיווק ייחודית עבורך.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4">
                         <div className="bg-lime-200 text-lime-800 p-2 rounded-lg mb-3 inline-block">
                           <CheckCircle className="h-6 w-6" />
                        </div>
                        <h4 className="font-semibold mb-1">התחל לשווק ולסגור</h4>
                        <p className="text-sm text-gray-500">קבל תוכן מוכן, נהל לידים, עקוב אחר התקדמות וסגור יותר עסקאות.</p>
                    </div>
                </div>
             </Card>
         </motion.div>
        {/* ----- END: How It Works Section ----- */}

         {/* ----- START: FAQ Section ----- */}
         <motion.div variants={cardVariants} className="lg:col-span-2 text-center mt-8 mb-4">
           <h2 className="text-3xl font-bold text-[#111827] mb-2">שאלות נפוצות</h2>
           <p className="text-gray-600">כל מה שרצית לדעת על hoogi במקום אחד.</p>
         </motion.div>

         <motion.div variants={cardVariants} className="lg:col-span-2">
           <Card className="rounded-2xl p-6 shadow-lg bg-white">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-right hover:no-underline font-semibold">האם המערכת מתאימה גם לסוכנים מתחילים?</AccordionTrigger>
                  <AccordionContent className="text-right text-gray-600">
                    בהחלט! hoogi תוכננה להיות אינטואיטיבית וקלה לשימוש. השאלון הראשוני עוזר לנו להתאים את האסטרטגיה והכלים לרמת הניסיון והצרכים שלך, בין אם אתה סוכן ותיק או רק בתחילת הדרך.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-right hover:no-underline font-semibold">איך ה-AI עוזר לי בפועל?</AccordionTrigger>
                  <AccordionContent className="text-right text-gray-600">
                    ה-AI שלנו מנתח את הנתונים שהזנת, לומד את קהל היעד שלך ואת סגנון התקשורת המועדף עליך. על בסיס זה, הוא יוצר עבורך תוכן שיווקי (פוסטים, מאמרים), מציע אסטרטגיות לניהול לידים, מספק תובנות שוק ועוזר לך לייעל את תהליכי העבודה.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-right hover:no-underline font-semibold">האם המידע שלי ושל הלקוחות שלי מאובטח?</AccordionTrigger>
                  <AccordionContent className="text-right text-gray-600">
                    אבטחת מידע היא בראש סדר העדיפויות שלנו. אנו משתמשים בפרוטוקולי האבטחה המתקדמים ביותר ושומרים על המידע שלך ושל לקוחותיך בהתאם לתקנים המחמירים ביותר ולתקנות הפרטיות.
                  </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-4">
                  <AccordionTrigger className="text-right hover:no-underline font-semibold">כמה זה עולה?</AccordionTrigger>
                  <AccordionContent className="text-right text-gray-600">
                    אנו מציעים מגוון מסלולי מנוי שיתאימו לכל סוכן ולכל גודל עסק. תוכל להתחיל עם תקופת ניסיון בחינם כדי להתרשם מהמערכת, ולאחר מכן לבחור את המסלול המתאים לך ביותר. פרטים נוספים ניתן למצוא בעמוד התמחור.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
           </Card>
         </motion.div>
         {/* ----- END: FAQ Section ----- */}


         {/* ----- START: CTA Section - Updated content ----- */}
         <motion.div variants={cardVariants} className="lg:col-span-2">
             <Card className="lg:col-span-2 rounded-2xl p-8 shadow-lg bg-gradient-to-l from-[#4338CA] to-[#6D28D9] text-white flex flex-col md:flex-row justify-between items-center mt-8">
               <div className="text-center md:text-right mb-4 md:mb-0">
                 <h2 className="text-2xl font-bold mb-1">מוכן להזניק את עסק הנדל"ן שלך קדימה?</h2>
                 <p className="opacity-90">הצטרף לסוכנים שכבר מגדילים את העסקאות בעזרת hoogi.</p>
               </div>
               <Button size="lg" className="bg-lime-300 hover:bg-lime-400 text-black font-bold py-3 px-6 rounded-xl shadow-md transition-transform duration-300 hover:scale-105 shrink-0">
                 <ArrowLeft className="mr-2 h-5 w-5" /> התנסה בחינם עכשיו
               </Button>
             </Card>
         </motion.div>
         {/* ----- END: CTA Section ----- */}


      </motion.main>

       {/* Footer */}
       <footer className="container mx-auto mt-16 text-center text-gray-600 text-sm py-6 border-t border-purple-200">
         © {new Date().getFullYear()} hoogi. כל הזכויות שמורות.<br />
         <span className="text-xs">מבית היוצר של ai-4biz</span>
       </footer>

    </div>
  );
} 