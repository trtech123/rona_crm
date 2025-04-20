"use client"

import { useState, useEffect, useRef } from "react"
import {
  ArrowUp,
  Bell,
  ChevronLeft,
  ChevronRight,
  Copy,
  Edit,
  Plus,
  Trash,
  User,
  Eye,
  Settings,
  BarChart,
  ArrowRight,
  ArrowLeft,
  Calendar,
  CheckSquare,
  MessageSquare,
  Users,
  FileText,
  Mail,
  Zap,
  Reply,
  ExternalLink,
  Star,
  Award,
  FileCheck,
  FilePlus,
  Filter,
  Sparkles,
  Phone,
  Clock,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HebrewDashboard() {
  const [showAllPosts, setShowAllPosts] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [windowHeight, setWindowHeight] = useState(0)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [postFilter, setPostFilter] = useState("all")
  const postsContainerRef = useRef(null)
  const [screenWidth, setScreenWidth] = useState(0)
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [activePostDetails, setActivePostDetails] = useState(null)
  const [showLeadsPopover, setShowLeadsPopover] = useState(null)
  const [showCommentsPopover, setShowCommentsPopover] = useState(null)

  useEffect(() => {
    // Set window height and width for controlling the layout
    setWindowHeight(window.innerHeight)
    setScreenWidth(window.innerWidth)

    const handleResize = () => {
      setWindowHeight(window.innerHeight)
      setScreenWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Sample posts data
  const allPosts = [
    {
      id: 1,
      title: "דירת גן מרווחת",
      status: "פעיל",
      statusColor: "#2ecc71", // ירוק
      effectiveness: 95,
      date: "2025-03-25",
      leads: { new: 3, total: 12 },
      comments: { new: 2, total: 5 },
      likes: { new: 1, total: 22 },
      type: "נכס",
      typeColor: "#3498db", // כחול
      isLeading: true,
      leadingColor: "#e74c3c", // אדום
    },
    {
      id: 2,
      title: "פנטהאוז יוקרתי",
      status: "טיוטה",
      statusColor: "#f39c12", // כתום
      effectiveness: 0,
      date: "2025-03-27",
      leads: { new: 0, total: 0 },
      comments: { new: 0, total: 0 },
      likes: { new: 0, total: 0 },
      type: "מאמר",
      typeColor: "#8e44ad", // סגול
      isLeading: false,
    },
    {
      id: 3,
      title: "דירה קומה גבוהה",
      status: "פעיל",
      statusColor: "#2ecc71", // ירוק
      effectiveness: 85,
      date: "2025-03-20",
      leads: { new: 5, total: 20 },
      comments: { new: 3, total: 8 },
      likes: { new: 2, total: 35 },
      type: "נכס",
      typeColor: "#3498db", // כחול
      isLeading: true,
      leadingColor: "#e74c3c", // אדום
    },
    {
      id: 4,
      title: "דירת סטודיו במרכז",
      status: "פעיל",
      statusColor: "#2ecc71", // ירוק
      effectiveness: 75,
      date: "2025-03-15",
      leads: { new: 2, total: 8 },
      comments: { new: 1, total: 4 },
      likes: { new: 0, total: 15 },
      type: "פרויקט",
      typeColor: "#3498db", // כחול
      isLeading: false,
    },
    {
      id: 5,
      title: "בית פרטי עם גינה",
      status: "פעיל",
      statusColor: "#2ecc71", // ירוק
      effectiveness: 65,
      date: "2025-03-10",
      leads: { new: 1, total: 5 },
      comments: { new: 0, total: 2 },
      likes: { new: 0, total: 10 },
      type: "נכס",
      typeColor: "#3498db", // כחול
      isLeading: false,
    },
    {
      id: 6,
      title: 'מאמר על השקעות נדל"ן',
      status: "פעיל",
      statusColor: "#2ecc71", // ירוק
      effectiveness: 90,
      date: "2025-03-05",
      leads: { new: 4, total: 15 },
      comments: { new: 2, total: 7 },
      likes: { new: 3, total: 25 },
      type: "מאמר",
      typeColor: "#8e44ad", // סגול
      isLeading: true,
      leadingColor: "#e74c3c", // אדום
    },
  ]

  // Filter posts based on selected filter
  const getFilteredPosts = () => {
    let filtered = [...allPosts]

    if (postFilter === "active") {
      filtered = filtered.filter((post) => post.status === "פעיל")
    } else if (postFilter === "draft") {
      filtered = filtered.filter((post) => post.status === "טיוטה")
    } else if (postFilter === "leading") {
      filtered = filtered.filter((post) => post.isLeading)
    } else if (postFilter === "articles") {
      // בסינון מאמרים, נציג רק פוסטים שהם מאמרים
      filtered = filtered.filter((post) => post.type === "מאמר")
    }

    // Sort by effectiveness first (for leading posts), then by date
    return filtered.sort((a, b) => {
      // First show posts with high effectiveness (leading)
      if (a.isLeading && !b.isLeading) return -1
      if (!a.isLeading && b.isLeading) return 1

      // Then sort by date (most recent first)
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  }

  // Calculate how many posts to show based on screen width
  const getInitialPostCount = () => {
    if (screenWidth < 640) return 1
    if (screenWidth < 768) return 2
    if (screenWidth < 1024) return 3
    return 4
  }

  const displayedPosts = showAllPosts ? getFilteredPosts() : getFilteredPosts().slice(0, getInitialPostCount())

  // New leads data
  const newLeads = [
    { name: "דוד כהן", phone: "050-1234567", email: "david@example.com", date: "היום, 10:30" },
    { name: "שרה לוי", phone: "052-7654321", email: "sarah@example.com", date: "היום, 09:15" },
    { name: "יוסי אברהם", phone: "054-9876543", email: "yossi@example.com", date: "אתמול, 18:45" },
  ]

  // New comments data
  const newComments = [
    { text: "מעוניין בנכס, אפשר פרטים?", post: "דירת גן מרווחת", postId: 1, date: "היום, 11:20" },
    { text: "האם יש חניה?", post: "פנטהאוז יוקרתי", postId: 2, date: "היום, 08:30" },
  ]

  // Articles data
  const articles = {
    unread: [
      { title: "טיפים לעיצוב הבית", status: "חדש", date: "25/03/2025" },
      { title: "איך לבחור דירה להשקעה", status: "חדש", date: "27/03/2025" },
    ],
    saved: [
      { title: "מדריך למשקיעים מתחילים", status: "שמור", date: "20/03/2025" },
      { title: 'טרנדים בשוק הנדל"ן', status: "שמור", date: "15/03/2025" },
    ],
  }

  // Events data
  const today = new Date()
  const thirtyDaysFromNow = new Date(today)
  thirtyDaysFromNow.setDate(today.getDate() + 30)

  const events = [
    {
      title: "יריד נדל״ן",
      date: "15/04/2025",
      dateObj: new Date(2025, 3, 15),
      location: "תל אביב",
      canCreateContent: true,
    },
    {
      title: "הרמת כוסית לחג",
      date: "10/04/2025",
      dateObj: new Date(2025, 3, 10),
      location: "משרד ראשי",
      canCreateContent: true,
    },
    {
      title: "פסח",
      date: "23/04/2025",
      dateObj: new Date(2025, 3, 23),
      type: "חג",
      canCreateContent: true,
    },
    {
      title: "יום העצמאות",
      date: "05/05/2025",
      dateObj: new Date(2025, 4, 5),
      type: "חג",
      canCreateContent: true,
    },
    {
      title: "ראש השנה",
      date: "25/09/2025",
      dateObj: new Date(2025, 8, 25),
      type: "חג",
      canCreateContent: true,
    },
  ]

  // Filter events to show only those within the next 30 days
  const upcomingEvents = events.filter((event) => event.dateObj && event.dateObj <= thirtyDaysFromNow)

  // Tasks data
  const tasks = {
    daily: [
      { title: "פגישה עם לקוח", time: "13:00", status: "להיום" },
      { title: "צילום נכס חדש", time: "15:30", status: "להיום" },
      { title: "שיחת טלפון עם משקיע", time: "10:00", status: "להיום" },
    ],
    regular: [
      { title: "פגישת צוות שבועית", date: "05/04/2025", status: "קבוע" },
      { title: "סקירת נכסים חדשים", date: "10/04/2025", status: "מתוכנן" },
    ],
  }

  // Content statistics
  const contentStats = {
    active: 12,
    drafts: 5,
    bestPerforming: "דירת גן מרווחת (95% אפקטיביות)",
  }

  // AI Insights
  const insights = [
    {
      id: 1,
      title: "הפוסט שלך מבצע 30% יותר טוב מהממוצע!",
      description: "שקול ליצור תוכן דומה",
      icon: "📈",
      color: "#8e44ad",
      targetScreen: "post-analytics",
    },
    {
      id: 2,
      title: "3 לידים חדשים ממתינים למענה",
      description: "מומלץ לענות תוך 24 שעות",
      icon: "👥",
      color: "#e74c3c",
      targetScreen: "leads",
    },
    {
      id: 3,
      title: "זמן טוב לפרסם תוכן חדש",
      description: "הקהל שלך פעיל עכשיו",
      icon: "⏰",
      color: "#2ecc71",
      targetScreen: "create",
    },
  ]

  // Stats for the top row with owl icons
  const stats = [
    {
      title: "לידים",
      count: 10,
      total: 200,
      icon: "לידים",
      color: "#8e44ad",
      data: newLeads,
      iconComponent: Users,
      actions: [
        { icon: Mail, label: "שלח מייל", action: "email" },
        { icon: Phone, label: "התקשר", action: "call" },
        { icon: Zap, label: "אוטומציה", action: "automation" },
      ],
    },
    {
      title: "תגובות",
      count: 8,
      total: 150,
      icon: "תגובות",
      color: "#e74c3c",
      data: newComments,
      iconComponent: MessageSquare,
      actions: [
        { icon: Reply, label: "מענה אוטומטי", action: "auto-reply" },
        { icon: ExternalLink, label: "הגב ידנית", action: "manual-reply" },
      ],
    },
    {
      title: "מאמרים",
      count: 1,
      total: 5,
      icon: "יצירה",
      color: "#3498db",
      data: articles,
      iconComponent: FileText,
      subCategories: [
        { title: "מאמרים חדשים", data: articles.unread, icon: FilePlus, canCreateSimilar: true },
        { title: "מאמרים שמורים", data: articles.saved, icon: Star, canCreateSimilar: true },
        {
          title: "המאמרים שלי",
          data: articles.saved,
          icon: FileText,
          canCreateSimilar: true,
          canEdit: true,
          canDelete: true,
        },
      ],
    },
    {
      title: "משימות",
      count: 3,
      total: 5,
      icon: "משימות",
      color: "#f39c12",
      data: tasks,
      iconComponent: CheckSquare,
      todayTasks: "3 משימות להיום",
      subCategories: [
        { title: "משימות להיום", data: tasks.daily, icon: Clock },
        { title: "משימות מתוכננות", data: tasks.regular, icon: Calendar },
      ],
      actions: [
        { icon: Mail, label: "שלח הודעה", action: "message" },
        { icon: Plus, label: "הוסף משימה", action: "add-task" },
      ],
    },
    {
      title: "אירועים",
      count: 2,
      total: 5,
      icon: "אירועים",
      color: "#2ecc71",
      data: upcomingEvents,
      iconComponent: Calendar,
      subCategories: [
        { title: "האירועים שלי", data: upcomingEvents.filter((e) => !e.type), icon: Calendar },
        { title: "אירועי מערכת", data: upcomingEvents.filter((e) => e.type !== "חג"), icon: Users },
        { title: "חגים ומועדים", data: upcomingEvents.filter((e) => e.type === "חג"), icon: Calendar },
      ],
      actions: [{ icon: Plus, label: "הוסף אירוע", action: "add-event" }],
    },
  ]

  const handleShowPosts = () => {
    setActiveTab("posts")
  }

  const handleShowTab = (tab) => {
    if (typeof tab === "object") {
      setActiveTab(tab.screen)
      setActivePostDetails(tab)
    } else {
      setActiveTab(tab)
      setActivePostDetails(null)
    }
  }

  const toggleShowAllPosts = () => {
    setShowAllPosts(!showAllPosts)
  }

  const scrollPosts = (direction) => {
    if (postsContainerRef.current) {
      const scrollAmount = direction === "right" ? -300 : 300
      postsContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
      setScrollPosition(postsContainerRef.current.scrollLeft + scrollAmount)
    }
  }

  const scrollInsights = (direction) => {
    const container = document.getElementById("insights-container")
    if (container) {
      const scrollAmount = direction === "right" ? -300 : 300
      container.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  // Function to handle calendar event click
  const handleEventClick = (event) => {
    setSelectedEvent(event)
    setShowCalendar(true)
  }

  const CalendarModal = ({ isOpen, onClose, event }) => {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-md p-4 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">יומן</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {event && (
            <div className="mb-4">
              <h4 className="font-bold text-md mb-2">{event.title}</h4>
              <p className="text-sm mb-1">תאריך: {event.date}</p>
              {event.location && <p className="text-sm mb-1">מיקום: {event.location}</p>}
              {event.type && <p className="text-sm mb-1">סוג: {event.type}</p>}
            </div>
          )}

          <div className="bg-gray-100 rounded-lg p-4 h-64 flex items-center justify-center">
            <p className="text-gray-500">תצוגת יומן (בפיתוח)</p>
          </div>

          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={onClose} className="mr-2">
              סגור
            </Button>
            {event && event.canCreateContent && (
              <Button
                onClick={() => {
                  onClose()
                  handleShowTab("create")
                }}
              >
                צור תוכן
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // פופאובר לידים
  const LeadsPopover = ({ post, onClose }) => {
    if (!post) return null

    const postLeads = [
      { name: "דוד כהן", phone: "050-1234567", email: "david@example.com", date: "היום, 10:30", isNew: true },
      { name: "שרה לוי", phone: "052-7654321", email: "sarah@example.com", date: "היום, 09:15", isNew: true },
      { name: "יוסי אברהם", phone: "054-9876543", email: "yossi@example.com", date: "אתמול, 18:45", isNew: false },
      { name: "רונית דוד", phone: "053-1122334", email: "ronit@example.com", date: "אתמול, 14:20", isNew: false },
    ]

    // מציג רק לידים חדשים בפופאפ
    const newLeads = postLeads.filter((lead) => lead.isNew)

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
        <div className="absolute inset-0 bg-black bg-opacity-30" onClick={onClose}></div>
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 z-10" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg">לידים חדשים: {post.title}</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {newLeads.length > 0 ? (
              newLeads.map((lead, i) => (
                <div key={i} className="p-2 hover:bg-gray-50 rounded-md border border-gray-200">
                  <p className="font-medium text-sm">{lead.name}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{lead.phone}</span>
                    <span>{lead.date}</span>
                  </div>
                  <div className="flex gap-2 mt-2 justify-end">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 rounded-full hover:bg-[#8e44ad20]"
                      onClick={() => console.log(`Send email to ${lead.email}`)}
                      title="שלח מייל"
                    >
                      <Mail className="h-3.5 w-3.5 text-[#8e44ad]" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 rounded-full hover:bg-[#25D36620]"
                      onClick={() => console.log(`Send WhatsApp to ${lead.phone}`)}
                      title="שלח הודעה בוואטסאפ"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#25D366"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3.5 w-3.5"
                      >
                        <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.2.301-.767.966-.94 1.164-.173.199-.347.223-.647.075-.3-.15-1.269-.467-2.416-1.483-.896-.795-1.497-1.77-1.676-2.07-.173-.3-.018-.465.13-.614.134-.135.301-.353.451-.528.146-.181.194-.301.297-.498.1-.2.05-.371-.025-.52-.075-.149-.673-1.62-.923-2.22-.242-.579-.487-.5-.673-.51-.173-.008-.371-.01-.57-.01-.2 0-.522.074-.796.372-.273.297-1.045 1.019-1.045 2.487 0 1.468 1.07 2.886 1.22 3.086.149.2 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 000-16 8 8 0 000 16z" />
                      </svg>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 rounded-full hover:bg-[#2ecc7120]"
                      onClick={() => console.log(`Call ${lead.phone}`)}
                      title="התקשר"
                    >
                      <Phone className="h-3.5 w-3.5 text-[#2ecc71]" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 rounded-full hover:bg-[#f39c1220]"
                      onClick={() => console.log(`Apply automation to ${lead.name}`)}
                      title="בחר אוטומציה"
                    >
                      <Zap className="h-3.5 w-3.5 text-[#f39c12]" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>אין לידים חדשים</p>
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={onClose} className="mr-2">
              סגור
            </Button>
            <Button
              onClick={() => {
                onClose()
                handleShowTab({
                  screen: "לידים",
                  postId: post.id,
                  postTitle: post.title,
                })
              }}
            >
              הצג הכל
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // פופאובר תגובות
  const CommentsPopover = ({ post, onClose }) => {
    if (!post) return null

    const postComments = [
      { text: "מעוניין בנכס, אפשר פרטים?", name: "יוסי לוי", date: "היום, 11:20", isNew: true },
      { text: "האם יש חניה?", name: "מיכל כהן", date: "היום, 08:30", isNew: true },
      { text: "מה המחיר למטר?", name: "דני אבני", date: "אתמול, 16:45", isNew: false },
      { text: "האם יש מעלית בבניין?", name: "רותי כהן", date: "לפני יומיים, 09:15", isNew: false },
    ]

    // מציג רק תגובות חדשות בפופאפ
    const newComments = postComments.filter((comment) => comment.isNew)

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
        <div className="absolute inset-0 bg-black bg-opacity-30" onClick={onClose}></div>
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 z-10" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg">תגובות חדשות: {post.title}</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {newComments.length > 0 ? (
              newComments.map((comment, i) => (
                <div key={i} className="p-2 hover:bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-sm">{comment.text}</p>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{comment.name}</span>
                    <span>{comment.date}</span>
                  </div>
                  <div className="flex gap-2 mt-2 justify-end">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 rounded-full hover:bg-[#8e44ad20]"
                      onClick={() => console.log(`Auto reply to comment`)}
                      title="מענה אוטומטי"
                    >
                      <Reply className="h-3.5 w-3.5 text-[#8e44ad]" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 rounded-full hover:bg-[#f39c1220]"
                      onClick={() => console.log(`Manual reply to comment`)}
                      title="הגב ידנית"
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-[#f39c12]" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>אין תגובות חדשות</p>
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={onClose} className="mr-2">
              סגור
            </Button>
            <Button
              onClick={() => {
                onClose()
                handleShowTab({
                  screen: "תגובות",
                  postId: post.id,
                  postTitle: post.title,
                })
              }}
            >
              הצג הכל
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white font-sans overflow-hidden" dir="rtl" style={{ height: windowHeight }}>
      {/* Header - Clean design with owl mascot */}
      <div className="container mx-auto pt-4 pb-2 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 bg-[#f8f8f8] rounded-full p-1 shadow-sm border border-gray-200">
              <Image src="/images/owl-mascot.png" alt="Owl Mascot" width={56} height={56} className="object-contain" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#333333]">שלום שם המשתמש, אני סוכן המדיה האישי שלך</h1>
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-500">פעיל כעת</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* לוגו אישי והתמונה שהועלתה */}
            <div className="flex items-center gap-2 ml-2">
              <div className="h-10 w-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="לוגו אישי"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-[#8e44ad] font-medium"
                onClick={() => handleShowTab("questionnaire")}
              >
                שאלון אישי
              </Button>
            </div>

            {/* כפתורי התראות ופרופיל */}
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-gray-200">
                <Bell className="h-4 w-4 text-gray-600" />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-gray-200">
                <User className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main
        className="container mx-auto px-2 py-3"
        style={{ maxHeight: "calc(100% - 80px - 56px)", overflowY: "auto" }}
      >
        {activeTab === "dashboard" && (
          <>
            {/* Stats Icons in a single row - Using owl icons with popover functionality */}
            <div className="flex justify-between mb-4 overflow-x-auto pb-1">
              {stats.map((stat, index) => (
                <Popover key={index}>
                  <PopoverTrigger asChild>
                    <div className="flex flex-col items-center p-1 cursor-pointer transition-transform hover:scale-105">
                      <div className="w-[60px] h-[60px] rounded-lg flex items-center justify-center mb-1 shadow-sm relative overflow-hidden bg-[#f9f9f9] border border-gray-200">
                        <Image
                          src={`/images/owl-icons.png`}
                          alt={stat.icon}
                          width={60}
                          height={60}
                          className="object-contain"
                        />
                      </div>
                      <h3 className="font-bold text-xs text-[#333333]">{stat.title}</h3>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-[#2ecc71]">{stat.count}</span>
                        <span className="text-xs text-[#e74c3c]">/ {stat.total}</span>
                      </div>
                      {stat.title === "משימות" && <p className="text-xs text-gray-600 mt-1">{stat.todayTasks}</p>}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-0" align="center">
                    <div className="p-3 border-b border-gray-100">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-sm text-[#333333]">{stat.title}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs text-[#8e44ad]"
                          onClick={() => handleShowTab(stat.title.toLowerCase())}
                        >
                          הצג הכל
                        </Button>
                      </div>
                    </div>

                    {/* Leads Popover Content */}
                    {stat.title === "לידים" && (
                      <div className="max-h-[250px] overflow-y-auto">
                        <div className="space-y-2 p-2">
                          {newLeads.map((lead, i) => (
                            <div key={i} className="p-2 hover:bg-gray-50 rounded-md">
                              <p className="font-medium text-sm">{lead.name}</p>
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>{lead.phone}</span>
                                <span>{lead.date}</span>
                              </div>
                              <div className="flex gap-2 mt-2 justify-end">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 rounded-full hover:bg-[#8e44ad20]"
                                  onClick={() => console.log(`Send email to ${lead.email}`)}
                                  title="שלח מייל"
                                >
                                  <Mail className="h-3.5 w-3.5 text-[#8e44ad]" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 rounded-full hover:bg-[#25D36620]"
                                  onClick={() => console.log(`Send WhatsApp to ${lead.phone}`)}
                                  title="שלח הודעה בוואטסאפ"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#25D366"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-3.5 w-3.5"
                                  >
                                    <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.2.301-.767.966-.94 1.164-.173.199-.347.223-.647.075-.3-.15-1.269-.467-2.416-1.483-.896-.795-1.497-1.77-1.676-2.07-.173-.3-.018-.465.13-.614.134-.135.301-.353.451-.528.146-.181.194-.301.297-.498.1-.2.05-.371-.025-.52-.075-.149-.673-1.62-.923-2.22-.242-.579-.487-.5-.673-.51-.173-.008-.371-.01-.57-.01-.2 0-.522.074-.796.372-.273.297-1.045 1.019-1.045 2.487 0 1.468 1.07 2.886 1.22 3.086.149.2 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 000-16 8 8 0 000 16z" />
                                  </svg>
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 rounded-full hover:bg-[#2ecc7120]"
                                  onClick={() => console.log(`Call ${lead.phone}`)}
                                  title="התקשר"
                                >
                                  <Phone className="h-3.5 w-3.5 text-[#2ecc71]" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 rounded-full hover:bg-[#f39c1220]"
                                  onClick={() => console.log(`Apply automation to ${lead.name}`)}
                                  title="בחר אוטומציה"
                                >
                                  <Zap className="h-3.5 w-3.5 text-[#f39c12]" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Comments Popover Content */}
                    {stat.title === "תגובות" && (
                      <div className="max-h-[250px] overflow-y-auto">
                        <div className="space-y-2 p-2">
                          {newComments.map((comment, i) => (
                            <div key={i} className="p-2 hover:bg-gray-50 rounded-md">
                              <p className="text-sm">{comment.text}</p>
                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>{comment.post}</span>
                                <span>{comment.date}</span>
                              </div>
                              <div className="flex gap-2 mt-2 justify-end">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 rounded-full hover:bg-[#8e44ad20]"
                                  onClick={() => console.log(`Auto reply to comment on post ${comment.postId}`)}
                                  title="מענה אוטומטי"
                                >
                                  <Reply className="h-3.5 w-3.5 text-[#8e44ad]" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 rounded-full hover:bg-[#f39c1220]"
                                  onClick={() => handleShowTab(`comment-${comment.postId}`)}
                                  title="הגב ידנית"
                                >
                                  <ExternalLink className="h-3.5 w-3.5 text-[#f39c12]" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Articles Popover Content */}
                    {stat.title === "מאמרים" && (
                      <div className="max-h-[300px] overflow-y-auto">
                        <Tabs defaultValue="my" className="w-full">
                          <TabsList className="grid grid-cols-3 p-1 mx-2 mt-2">
                            <TabsTrigger value="unread" className="text-xs">
                              חדשים
                            </TabsTrigger>
                            <TabsTrigger value="saved" className="text-xs">
                              שמורים
                            </TabsTrigger>
                            <TabsTrigger value="my" className="text-xs">
                              המאמרים שלי
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="unread" className="p-2">
                            <div className="space-y-2">
                              {articles.unread.map((article, i) => (
                                <div key={i} className="p-2 hover:bg-gray-50 rounded-md">
                                  <p className="font-medium text-sm">{article.title}</p>
                                  <div className="flex justify-between text-xs text-gray-500">
                                    <span className="text-blue-500">{article.status}</span>
                                    <span>{article.date}</span>
                                  </div>
                                  <div className="flex gap-2 mt-2 justify-end">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7 rounded-full hover:bg-[#8e44ad20]"
                                      onClick={() => handleShowTab("create")}
                                      title="צור תוכן דומה"
                                    >
                                      <FilePlus className="h-3.5 w-3.5 text-[#8e44ad]" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </TabsContent>
                          <TabsContent value="saved" className="p-2">
                            <div className="space-y-2">
                              {articles.saved.map((article, i) => (
                                <div key={i} className="p-2 hover:bg-gray-50 rounded-md">
                                  <p className="font-medium text-sm">{article.title}</p>
                                  <div className="flex justify-between text-xs text-gray-500">
                                    <span className="text-green-500">{article.status}</span>
                                    <span>{article.date}</span>
                                  </div>
                                  <div className="flex gap-2 mt-2 justify-end">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7 rounded-full hover:bg-[#8e44ad20]"
                                      onClick={() => handleShowTab("create")}
                                      title="צור תוכן דומה"
                                    >
                                      <FilePlus className="h-3.5 w-3.5 text-[#8e44ad]" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </TabsContent>
                          <TabsContent value="my" className="p-2">
                            <div className="space-y-2">
                              {[
                                {
                                  title: "מאמר על השקעות נדל״ן",
                                  status: "פורסם",
                                  date: "15/03/2025",
                                  leads: { new: 3, total: 12 },
                                  comments: { new: 2, total: 5 },
                                },
                                {
                                  title: "מדריך לקניית דירה ראשונה",
                                  status: "פורסם",
                                  date: "20/03/2025",
                                  leads: { new: 1, total: 8 },
                                  comments: { new: 3, total: 7 },
                                },
                              ].map((article, i) => (
                                <div key={i} className="p-2 hover:bg-gray-50 rounded-md">
                                  <p className="font-medium text-sm">{article.title}</p>
                                  <div className="flex justify-between text-xs text-gray-500">
                                    <span className="text-[#2ecc71]">{article.status}</span>
                                    <span>{article.date}</span>
                                  </div>
                                  <div className="flex justify-between text-xs mt-1">
                                    <div
                                      className="flex items-center gap-1 cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setShowLeadsPopover({
                                          id: i,
                                          title: article.title,
                                          leads: article.leads,
                                        })
                                      }}
                                    >
                                      <Users className="h-3 w-3 text-[#8e44ad]" />
                                      <span className="text-[#8e44ad]">
                                        {article.leads.new > 0 && (
                                          <span className="text-[#2ecc71] font-bold mr-1">{article.leads.new}</span>
                                        )}
                                        {article.leads.new > 0 ? "/ " : ""}
                                        {article.leads.total}
                                      </span>
                                    </div>
                                    <div
                                      className="flex items-center gap-1 cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setShowCommentsPopover({
                                          id: i,
                                          title: article.title,
                                          comments: article.comments,
                                        })
                                      }}
                                    >
                                      <MessageSquare className="h-3 w-3 text-[#e74c3c]" />
                                      <span className="text-[#e74c3c]">
                                        {article.comments.new > 0 && (
                                          <span className="text-[#2ecc71] font-bold mr-1">{article.comments.new}</span>
                                        )}
                                        {article.comments.new > 0 ? "/ " : ""}
                                        {article.comments.total}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 mt-2 justify-end">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7 rounded-full hover:bg-[#8e44ad20]"
                                      onClick={() => handleShowTab("edit-article")}
                                      title="ערוך מאמר"
                                    >
                                      <Edit className="h-3.5 w-3.5 text-[#8e44ad]" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7 rounded-full hover:bg-[#e74c3c20]"
                                      onClick={() => console.log(`Delete article`)}
                                      title="מחק מאמר"
                                    >
                                      <Trash className="h-3.5 w-3.5 text-[#e74c3c]" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    )}

                    {/* Tasks Popover Content */}
                    {stat.title === "משימות" && (
                      <div className="max-h-[300px] overflow-y-auto">
                        <Tabs defaultValue="daily" className="w-full">
                          <TabsList className="grid grid-cols-2 p-1 mx-2 mt-2">
                            <TabsTrigger value="daily" className="text-xs">
                              משימות להיום
                            </TabsTrigger>
                            <TabsTrigger value="regular" className="text-xs">
                              משימות מתוכננות
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="daily" className="p-2">
                            <div className="space-y-2">
                              {tasks.daily.map((task, i) => (
                                <div key={i} className="p-2 hover:bg-gray-50 rounded-md group">
                                  <p className="font-medium text-sm">{task.title}</p>
                                  <div className="flex justify-between text-xs text-gray-500">
                                    <span>{task.status}</span>
                                    <span>{task.time}</span>
                                  </div>
                                  <div className="flex gap-2 mt-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7 rounded-full hover:bg-[#e74c3c20]"
                                      onClick={() => console.log(`Delete task`)}
                                      title="מחק משימה"
                                    >
                                      <Trash className="h-3.5 w-3.5 text-[#e74c3c]" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7 rounded-full hover:bg-[#8e44ad20]"
                                      onClick={() => console.log(`Send email about task`)}
                                      title="שלח מייל"
                                    >
                                      <Mail className="h-3.5 w-3.5 text-[#8e44ad]" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7 rounded-full hover:bg-[#25D36620]"
                                      onClick={() => console.log(`Send message about task`)}
                                      title="שלח הודעה"
                                    >
                                      <MessageSquare className="h-3.5 w-3.5 text-[#25D366]" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7 rounded-full hover:bg-[#2ecc7120]"
                                      onClick={() => console.log(`Call about task`)}
                                      title="התקשר"
                                    >
                                      <Phone className="h-3.5 w-3.5 text-[#2ecc71]" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7 rounded-full hover:bg-[#3498db20]"
                                      onClick={() => console.log(`Open Waze for navigation`)}
                                      title="פתח ווייז"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#3498db"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-3.5 w-3.5"
                                      >
                                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                      </svg>
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 flex justify-end gap-2">
                              <Button
                                size="icon"
                                className="h-7 w-7 rounded-full bg-[#8e44ad]"
                                onClick={() => console.log("Add new task to calendar")}
                                title="הוסף משימה ליומן"
                              >
                                <Plus className="h-3.5 w-3.5 text-white" />
                              </Button>
                            </div>
                          </TabsContent>
                          <TabsContent value="regular" className="p-2">
                            <div className="space-y-2">
                              {tasks.regular.map((task, i) => (
                                <div key={i} className="p-2 hover:bg-gray-50 rounded-md group">
                                  <p className="font-medium text-sm">{task.title}</p>
                                  <div className="flex justify-between text-xs text-gray-500">
                                    <span>{task.status}</span>
                                    <span>{task.date}</span>
                                  </div>
                                  <div className="flex gap-2 mt-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7 rounded-full hover:bg-[#e74c3c20]"
                                      onClick={() => console.log(`Delete task`)}
                                      title="מחק משימה"
                                    >
                                      <Trash className="h-3.5 w-3.5 text-[#e74c3c]" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7 rounded-full hover:bg-[#8e44ad20]"
                                      onClick={() => console.log(`Send email about task`)}
                                      title="שלח מייל"
                                    >
                                      <Mail className="h-3.5 w-3.5 text-[#8e44ad]" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7 rounded-full hover:bg-[#25D36620]"
                                      onClick={() => console.log(`Send message about task`)}
                                      title="שלח הודעה"
                                    >
                                      <MessageSquare className="h-3.5 w-3.5 text-[#25D366]" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7 rounded-full hover:bg-[#2ecc7120]"
                                      onClick={() => console.log(`Call about task`)}
                                      title="התקשר"
                                    >
                                      <Phone className="h-3.5 w-3.5 text-[#2ecc71]" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7 rounded-full hover:bg-[#3498db20]"
                                      onClick={() => console.log(`Open Waze for navigation`)}
                                      title="פתח ווייז"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#3498db"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-3.5 w-3.5"
                                      >
                                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                      </svg>
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 flex justify-end">
                              <Button
                                size="icon"
                                className="h-7 w-7 rounded-full bg-[#8e44ad]"
                                onClick={() => console.log("Add new scheduled task")}
                                title="הוסף משימה מתוכננת"
                              >
                                <Plus className="h-3.5 w-3.5 text-white" />
                              </Button>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    )}

                    {/* הוספת פופאובר לאירועים וחגים */}
                    {stat.title === "אירועים" && (
                      <div className="max-h-[300px] overflow-y-auto">
                        <Tabs defaultValue="my" className="w-full">
                          <TabsList className="grid grid-cols-3 p-1 mx-2 mt-2">
                            <TabsTrigger value="my" className="text-xs">
                              האירועים שלי
                            </TabsTrigger>
                            <TabsTrigger value="system" className="text-xs">
                              אירועי מערכת
                            </TabsTrigger>
                            <TabsTrigger value="holidays" className="text-xs">
                              חגים ומועדים
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="my" className="p-2">
                            <div className="space-y-2">
                              {upcomingEvents
                                .filter((e) => !e.type)
                                .map((event, i) => (
                                  <div key={i} className="p-2 hover:bg-gray-50 rounded-md group">
                                    <p className="font-medium text-sm">{event.title}</p>
                                    <div className="flex justify-between text-xs text-gray-500">
                                      <span>{event.location || ""}</span>
                                      <span>{event.date}</span>
                                    </div>
                                    <div className="flex gap-2 mt-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7 rounded-full hover:bg-[#e74c3c20]"
                                        onClick={() => console.log(`Delete event: ${event.title}`)}
                                        title="מחק אירוע"
                                      >
                                        <Trash className="h-3.5 w-3.5 text-[#e74c3c]" />
                                      </Button>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7 rounded-full hover:bg-[#3498db20]"
                                        onClick={() => handleEventClick(event)}
                                        title="יומן"
                                      >
                                        <Calendar className="h-3.5 w-3.5 text-[#3498db]" />
                                      </Button>
                                      {event.location && (
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="h-7 w-7 rounded-full hover:bg-[#3498db20]"
                                          onClick={() => console.log(`Open Waze for navigation to ${event.location}`)}
                                          title="פתח ווייז"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#3498db"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-3.5 w-3.5"
                                          >
                                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                          </svg>
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                            </div>
                            <div className="mt-3 flex justify-end">
                              <Button
                                size="icon"
                                className="h-7 w-7 rounded-full bg-[#8e44ad]"
                                onClick={() => console.log("Add new event to calendar")}
                                title="הוסף אירוע ליומן"
                              >
                                <Plus className="h-3.5 w-3.5 text-white" />
                              </Button>
                            </div>
                          </TabsContent>
                          <TabsContent value="system" className="p-2">
                            <div className="space-y-2">
                              {[
                                { title: "כנס נדל״ן ארצי", date: "12/04/2025", location: "תל אביב", category: "כנסים" },
                                {
                                  title: "הרצאה: השקעות נדל״ן",
                                  date: "18/04/2025",
                                  location: "ירושלים",
                                  category: "הרצאות",
                                },
                              ].map((event, i) => (
                                <div key={i} className="p-2 hover:bg-gray-50 rounded-md group">
                                  <p className="font-medium text-sm">{event.title}</p>
                                  <div className="flex justify-between text-xs text-gray-500">
                                    <span>
                                      {event.location} | {event.category}
                                    </span>
                                    <span>{event.date}</span>
                                  </div>
                                  <div className="flex gap-2 mt-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7 rounded-full hover:bg-[#2ecc7120]"
                                      onClick={() => console.log(`Open event link: ${event.title}`)}
                                      title="הצטרף לאירוע"
                                    >
                                      <ExternalLink className="h-3.5 w-3.5 text-[#2ecc71]" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7 rounded-full hover:bg-[#3498db20]"
                                      onClick={() => handleEventClick(event)}
                                      title="פתח יומן"
                                    >
                                      <Calendar className="h-3.5 w-3.5 text-[#3498db]" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7 rounded-full hover:bg-[#e74c3c20]"
                                      onClick={() => console.log(`Delete event: ${event.title}`)}
                                      title="מחק אירוע"
                                    >
                                      <Trash className="h-3.5 w-3.5 text-[#e74c3c]" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </TabsContent>
                          <TabsContent value="holidays" className="p-2">
                            <div className="space-y-2">
                              {upcomingEvents
                                .filter((e) => e.type === "חג")
                                .map((event, i) => (
                                  <div key={i} className="p-2 hover:bg-gray-50 rounded-md group">
                                    <p className="font-medium text-sm">{event.title}</p>
                                    <div className="flex justify-between text-xs text-gray-500">
                                      <span>{event.type}</span>
                                      <span>{event.date}</span>
                                    </div>
                                    <div className="flex gap-2 mt-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7 rounded-full hover:bg-[#8e44ad20]"
                                        onClick={() => handleShowTab("create")}
                                        title="צור תוכן מותאם"
                                      >
                                        <FilePlus className="h-3.5 w-3.5 text-[#8e44ad]" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              ))}
            </div>

            {/* Create Content Button with Post Filters */}
            <div className="flex justify-between items-center mb-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="bg-[#8e44ad] hover:bg-[#7d3c98] text-white rounded-full px-6 py-1 h-10 shadow-sm">
                    <Plus className="mr-1 h-4 w-4" />
                    <span className="text-sm">צור תוכן חדש</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0">
                  <div className="p-3 border-b border-gray-100">
                    <h3 className="font-bold text-sm text-[#333333]">סטטיסטיקת תוכן</h3>
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">פוסטים פעילים:</span>
                      <span className="text-sm font-medium">{contentStats.active}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">טיוטות:</span>
                      <span className="text-sm font-medium">{contentStats.drafts}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-sm font-medium">הפוסט הטוב ביותר:</p>
                      <p className="text-xs text-gray-600">{contentStats.bestPerforming}</p>
                    </div>
                    <div className="pt-2">
                      <Button
                        className="w-full bg-[#8e44ad] hover:bg-[#7d3c98] text-white h-8 text-xs"
                        onClick={() => handleShowTab("create")}
                      >
                        צור תוכן חדש
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <div className="flex gap-2 overflow-x-auto pb-1">
                <Button
                  variant={postFilter === "all" ? "default" : "outline"}
                  size="sm"
                  className={`h-8 text-xs ${postFilter === "all" ? "bg-[#8e44ad]" : "border-gray-200"}`}
                  onClick={() => setPostFilter("all")}
                >
                  <Filter className="h-3 w-3 mr-1" />
                  הכל
                </Button>
                <Button
                  variant={postFilter === "active" ? "default" : "outline"}
                  size="sm"
                  className={`h-8 text-xs ${postFilter === "active" ? "bg-[#8e44ad]" : "border-gray-200"}`}
                  onClick={() => setPostFilter("active")}
                >
                  <FileCheck className="h-3 w-3 mr-1" />
                  פעיל
                </Button>
                <Button
                  variant={postFilter === "draft" ? "default" : "outline"}
                  size="sm"
                  className={`h-8 text-xs ${postFilter === "draft" ? "bg-[#8e44ad]" : "border-gray-200"}`}
                  onClick={() => setPostFilter("draft")}
                >
                  <FilePlus className="h-3 w-3 mr-1" />
                  טיוטה
                </Button>
                <Button
                  variant={postFilter === "leading" ? "default" : "outline"}
                  size="sm"
                  className={`h-8 text-xs ${postFilter === "leading" ? "bg-[#8e44ad]" : "border-gray-200"}`}
                  onClick={() => setPostFilter("leading")}
                >
                  <Award className="h-3 w-3 mr-1" />
                  מוביל
                </Button>
                <Button
                  variant={postFilter === "articles" ? "default" : "outline"}
                  size="sm"
                  className={`h-8 text-xs ${postFilter === "articles" ? "bg-[#8e44ad]" : "border-gray-200"}`}
                  onClick={() => setPostFilter("articles")}
                >
                  <FileText className="h-3 w-3 mr-1" />
                  מאמרים
                </Button>
              </div>
            </div>

            {/* Posts Section - Horizontal Scrollable */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-base font-bold text-[#333333]">הפוסטים האחרונים</h2>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleShowAllPosts}
                    className="hover:bg-gray-100 h-7 w-7 rounded-full"
                  >
                    <ArrowUp
                      className={`h-4 w-4 transition-transform text-gray-600 ${showAllPosts ? "rotate-180" : ""}`}
                    />
                  </Button>
                  <Button variant="link" className="text-[#8e44ad] p-0 h-7" onClick={handleShowPosts}>
                    <span className="text-sm">הצג הכל</span>
                  </Button>
                </div>
              </div>

              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-90 rounded-full h-8 w-8 shadow-sm"
                  onClick={() => scrollPosts("right")}
                >
                  <ArrowRight className="h-4 w-4 text-gray-600" />
                </Button>

                <div
                  id="posts-container"
                  ref={postsContainerRef}
                  className="flex overflow-x-auto pb-2 gap-3 px-8 hide-scrollbar"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {displayedPosts.length > 0 ? (
                    displayedPosts.map((post) => (
                      <Card
                        key={post.id}
                        className={`flex-shrink-0 w-[220px] overflow-hidden hover:shadow-md transition-shadow border rounded-lg ${
                          post.isLeading
                            ? "border-[#e74c3c] border-[3px]"
                            : post.type === "מאמר"
                              ? "border-[#8e44ad] border-[2px]"
                              : "border-gray-200"
                        }`}
                        style={{
                          borderColor: post.isLeading ? "#e74c3c" : post.type === "מאמר" ? "#8e44ad" : "",
                        }}
                      >
                        <CardContent className="p-0">
                          <div className="h-[100px] bg-gray-100 relative">
                            <div className="absolute top-2 right-2 flex flex-col gap-1">
                              <span
                                className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                                style={{
                                  backgroundColor: `${post.typeColor}20`,
                                  color: post.typeColor,
                                }}
                              >
                                {post.type}
                              </span>
                              {post.isLeading && (
                                <span
                                  className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                                  style={{
                                    backgroundColor: `${post.leadingColor}20`,
                                    color: post.leadingColor,
                                  }}
                                >
                                  פוסט מוביל
                                </span>
                              )}
                            </div>
                            <div className="absolute top-2 left-2">
                              <span
                                className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                                style={{
                                  backgroundColor: `${post.statusColor}20`,
                                  color: post.statusColor,
                                }}
                              >
                                {post.status}
                              </span>
                            </div>
                          </div>
                          <div className="p-3">
                            <h3 className="font-bold text-sm text-[#333333] mb-2">{post.title}</h3>

                            <div className="grid grid-cols-3 gap-1 text-xs mb-3">
                              <div className="flex flex-col cursor-pointer" onClick={() => setShowLeadsPopover(post)}>
                                <span className="text-gray-600">לידים:</span>
                                <div className="flex items-center">
                                  {post.leads.new > 0 && (
                                    <span className="text-[#2ecc71] font-bold mr-1">{post.leads.new}</span>
                                  )}
                                  <span className="text-[#8e44ad] font-medium">
                                    {post.leads.new > 0 ? "/ " : ""}
                                    {post.leads.total}
                                  </span>
                                </div>
                              </div>
                              <div
                                className="flex flex-col cursor-pointer"
                                onClick={() => setShowCommentsPopover(post)}
                              >
                                <span className="text-gray-600">תגובות:</span>
                                <div className="flex items-center">
                                  {post.comments.new > 0 && (
                                    <span className="text-[#2ecc71] font-bold mr-1">{post.comments.new}</span>
                                  )}
                                  <span className="text-[#8e44ad] font-medium">
                                    {post.comments.new > 0 ? "/ " : ""}
                                    {post.comments.total}
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-gray-600">לייקים:</span>
                                <div className="flex items-center">
                                  {post.likes.new > 0 && (
                                    <span className="text-[#2ecc71] font-bold mr-1">{post.likes.new}</span>
                                  )}
                                  <span className="text-[#8e44ad] font-medium">
                                    {post.likes.new > 0 ? "/ " : ""}
                                    {post.likes.total}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-between">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 rounded-full hover:bg-[#8e44ad20]"
                                onClick={() => handleShowTab("edit-post")}
                                title="עריכה"
                              >
                                <Edit className="h-4 w-4 text-[#8e44ad]" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 rounded-full hover:bg-[#f39c1220]"
                                onClick={() =>
                                  console.log(`${post.status === "טיוטה" ? "Approving" : "Copying"} post ${post.id}`)
                                }
                                title={post.status === "טיוטה" ? "אישור" : "העתקה"}
                              >
                                <Copy className="h-4 w-4 text-[#f39c12]" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 rounded-full hover:bg-[#e74c3c20]"
                                onClick={() => console.log(`Deleting post ${post.id}`)}
                                title="מחיקה"
                              >
                                <Trash className="h-4 w-4 text-[#e74c3c]" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="flex items-center justify-center w-full py-8 text-gray-500">
                      <p>אין פוסטים להצגה בסינון הנוכחי</p>
                    </div>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-90 rounded-full h-8 w-8 shadow-sm"
                  onClick={() => scrollPosts("left")}
                >
                  <ArrowLeft className="h-4 w-4 text-gray-600" />
                </Button>
              </div>
            </div>

            {/* AI Insights - Multiple in a row */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-base font-bold text-[#333333]">תובנות AI</h2>
              </div>

              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-90 rounded-full h-8 w-8 shadow-sm"
                  onClick={() => scrollInsights("right")}
                >
                  <ArrowRight className="h-4 w-4 text-gray-600" />
                </Button>

                <div
                  id="insights-container"
                  className="flex overflow-x-auto pb-2 gap-3 px-8 hide-scrollbar"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {insights.map((insight) => (
                    <Card
                      key={insight.id}
                      className="flex-shrink-0 w-[280px] overflow-hidden hover:shadow-md transition-shadow border border-gray-200 rounded-lg cursor-pointer"
                      onClick={() => handleShowTab(insight.targetScreen)}
                    >
                      <CardContent className="p-3 flex items-center">
                        <div
                          className="w-[40px] h-[40px] rounded-full flex items-center justify-center mr-3 shadow-sm"
                          style={{ backgroundColor: `${insight.color}20`, color: insight.color }}
                        >
                          <span className="text-lg">{insight.icon}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-[#333333] text-sm">{insight.title}</h3>
                          <p className="text-xs text-gray-600">{insight.description}</p>
                        </div>
                        <ChevronLeft className="mr-auto h-4 w-4" style={{ color: insight.color }} />
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-90 rounded-full h-8 w-8 shadow-sm"
                  onClick={() => scrollInsights("left")}
                >
                  <ArrowLeft className="h-4 w-4 text-gray-600" />
                </Button>
              </div>
            </div>

            {/* Quick Access Circles */}
            <div className="flex justify-center gap-6 mb-2">
              <div className="flex flex-col items-center cursor-pointer" onClick={() => handleShowTab("subscription")}>
                <div className="w-[45px] h-[45px] bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-sm">
                  <span className="text-lg">💎</span>
                </div>
                <span className="text-xs text-[#333333] mt-1 font-medium">מנוי</span>
              </div>

              <div className="flex flex-col items-center cursor-pointer" onClick={() => handleShowTab("questionnaire")}>
                <div className="w-[45px] h-[45px] bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-sm">
                  <span className="text-lg">📝</span>
                </div>
                <span className="text-xs text-[#333333] mt-1 font-medium">שאלון</span>
              </div>

              <div className="flex flex-col items-center cursor-pointer" onClick={() => handleShowTab("automations")}>
                <div className="w-[45px] h-[45px] bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-sm">
                  <span className="text-lg">⚙️</span>
                </div>
                <span className="text-xs text-[#333333] mt-1 font-medium">אוטומציות</span>
              </div>
            </div>
          </>
        )}

        {activeTab === "posts" && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold text-[#333333]">כל הפוסטים</h2>
              <Button
                variant="outline"
                onClick={() => setActiveTab("dashboard")}
                className="flex items-center gap-1 h-8 text-xs border-gray-200 text-[#333333]"
              >
                <ChevronRight className="h-3 w-3" />
                חזרה ללוח המחוונים
              </Button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              <Button
                variant={postFilter === "all" ? "default" : "outline"}
                size="sm"
                className={`h-8 text-xs ${postFilter === "all" ? "bg-[#8e44ad]" : "border-gray-200"}`}
                onClick={() => setPostFilter("all")}
              >
                <Filter className="h-3 w-3 mr-1" />
                הכל
              </Button>
              <Button
                variant={postFilter === "active" ? "default" : "outline"}
                size="sm"
                className={`h-8 text-xs ${postFilter === "active" ? "bg-[#8e44ad]" : "border-gray-200"}`}
                onClick={() => setPostFilter("active")}
              >
                <FileCheck className="h-3 w-3 mr-1" />
                פעיל
              </Button>
              <Button
                variant={postFilter === "draft" ? "default" : "outline"}
                size="sm"
                className={`h-8 text-xs ${postFilter === "draft" ? "bg-[#8e44ad]" : "border-gray-200"}`}
                onClick={() => setPostFilter("draft")}
              >
                <FilePlus className="h-3 w-3 mr-1" />
                טיוטה
              </Button>
              <Button
                variant={postFilter === "leading" ? "default" : "outline"}
                size="sm"
                className={`h-8 text-xs ${postFilter === "leading" ? "bg-[#8e44ad]" : "border-gray-200"}`}
                onClick={() => setPostFilter("leading")}
              >
                <Award className="h-3 w-3 mr-1" />
                מוביל
              </Button>
              <Button
                variant={postFilter === "articles" ? "default" : "outline"}
                size="sm"
                className={`h-8 text-xs ${postFilter === "articles" ? "bg-[#8e44ad]" : "border-gray-200"}`}
                onClick={() => setPostFilter("articles")}
              >
                <FileText className="h-3 w-3 mr-1" />
                מאמרים
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {getFilteredPosts().length > 0 ? (
                getFilteredPosts().map((post) => (
                  <Card
                    key={post.id}
                    className={`overflow-hidden hover:shadow-md transition-shadow border rounded-lg ${
                      post.isLeading
                        ? "border-[#e74c3c] border-[3px]"
                        : post.type === "מאמר"
                          ? "border-[#8e44ad] border-[2px]"
                          : "border-gray-200"
                    }`}
                    style={{
                      borderColor: post.isLeading ? "#e74c3c" : post.type === "מאמר" ? "#8e44ad" : "",
                    }}
                  >
                    <CardContent className="p-0">
                      <div className="h-[100px] bg-gray-100 relative">
                        <div className="absolute top-2 right-2 flex flex-col gap-1">
                          <span
                            className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `${post.typeColor}20`,
                              color: post.typeColor,
                            }}
                          >
                            {post.type}
                          </span>
                          {post.isLeading && (
                            <span
                              className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: `${post.leadingColor}20`,
                                color: post.leadingColor,
                              }}
                            >
                              פוסט מוביל
                            </span>
                          )}
                        </div>
                        <div className="absolute top-2 left-2">
                          <span
                            className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `${post.statusColor}20`,
                              color: post.statusColor,
                            }}
                          >
                            {post.status}
                          </span>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-bold text-sm text-[#333333] mb-2">{post.title}</h3>

                        <div className="grid grid-cols-3 gap-1 text-xs mb-3">
                          <div className="flex flex-col cursor-pointer" onClick={() => setShowLeadsPopover(post)}>
                            <span className="text-gray-600">לידים:</span>
                            <span className="text-[#8e44ad] font-medium">
                              {post.leads.new} / {post.leads.total}
                            </span>
                          </div>
                          <div className="flex flex-col cursor-pointer" onClick={() => setShowCommentsPopover(post)}>
                            <span className="text-gray-600">תגובות:</span>
                            <span className="text-[#8e44ad] font-medium">
                              {post.comments.new} / {post.comments.total}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-600">לייקים:</span>
                            <span className="text-[#8e44ad] font-medium">
                              {post.likes.new} / {post.likes.total}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 rounded-full hover:bg-[#8e44ad20]"
                            title="עריכה"
                          >
                            <Edit className="h-4 w-4 text-[#8e44ad]" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 rounded-full hover:bg-[#f39c1220]"
                            title={post.status === "טיוטה" ? "אישור" : "העתקה"}
                          >
                            <Copy className="h-4 w-4 text-[#f39c12]" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 rounded-full hover:bg-[#e74c3c20]"
                            title="מחיקה"
                          >
                            <Trash className="h-4 w-4 text-[#e74c3c]" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 flex items-center justify-center py-8 text-gray-500">
                  <p>אין פוסטים להצגה בסינון הנוכחי</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab !== "dashboard" && activeTab !== "posts" && (
          <div className="text-center py-6">
            <h2 className="text-lg font-bold text-[#333333] mb-2">
              {activeTab === "create"
                ? "יצירת תוכן חדש"
                : activeTab === "insights"
                  ? "תובנות AI"
                  : activeTab === "subscription"
                    ? "ניהול מנוי"
                    : activeTab === "questionnaire"
                      ? "שאלון"
                      : activeTab === "automations"
                        ? "אוטומציות"
                        : activeTab === "edit-post"
                          ? "עריכת פוסט"
                          : activeTab === "edit-article"
                            ? "עריכת מאמר"
                            : activeTab === "לידים"
                              ? "ניהול לידים"
                              : activeTab === "תגובות"
                                ? "ניהול תגובות"
                                : activeTab === "מאמרים"
                                  ? "ניהול מאמרים"
                                  : activeTab === "post-analytics"
                                    ? "ניתוח ביצועי פוסט"
                                    : activeTab === "leads"
                                      ? "ניהול לידים"
                                      : activeTab}
            </h2>

            {activeTab === "לידים" && activePostDetails ? (
              <div className="max-w-md mx-auto mt-4 text-right">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">לידים: {activePostDetails.postTitle}</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // חזרה לאיקון מאמרים
                      setActiveTab("dashboard")
                      setActivePostDetails(null)
                    }}
                    className="flex items-center gap-1"
                  >
                    <ChevronRight className="h-3 w-3" />
                    חזרה למאמרים
                  </Button>
                </div>
                <div className="space-y-2 p-2">
                  {[
                    {
                      name: "דוד כהן",
                      phone: "050-1234567",
                      email: "david@example.com",
                      date: "היום, 10:30",
                      isNew: true,
                    },
                    {
                      name: "שרה לוי",
                      phone: "052-7654321",
                      email: "sarah@example.com",
                      date: "היום, 09:15",
                      isNew: true,
                    },
                    {
                      name: "יוסי אברהם",
                      phone: "054-9876543",
                      email: "yossi@example.com",
                      date: "אתמול, 18:45",
                      isNew: false,
                    },
                    {
                      name: "רונית דוד",
                      phone: "053-1122334",
                      email: "ronit@example.com",
                      date: "אתמול, 14:20",
                      isNew: false,
                    },
                  ].map((lead, i) => (
                    <div key={i} className="p-2 hover:bg-gray-50 rounded-md border border-gray-200">
                      <p className="font-medium text-sm">
                        {lead.name} {lead.isNew && <span className="text-[#2ecc71] text-xs font-bold mr-1">(חדש)</span>}
                      </p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{lead.phone}</span>
                        <span>{lead.date}</span>
                      </div>
                      <div className="flex gap-2 mt-2 justify-end">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 rounded-full hover:bg-[#8e44ad20]"
                          onClick={() => console.log(`Send email to ${lead.email}`)}
                          title="שלח מייל"
                        >
                          <Mail className="h-3.5 w-3.5 text-[#8e44ad]" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 rounded-full hover:bg-[#25D36620]"
                          onClick={() => console.log(`Send WhatsApp to ${lead.phone}`)}
                          title="שלח הודעה בוואטסאפ"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#25D366"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3.5 w-3.5"
                          >
                            <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.2.301-.767.966-.94 1.164-.173.199-.347.223-.647.075-.3-.15-1.269-.467-2.416-1.483-.896-.795-1.497-1.77-1.676-2.07-.173-.3-.018-.465.13-.614.134-.135.301-.353.451-.528.146-.181.194-.301.297-.498.1-.2.05-.371-.025-.52-.075-.149-.673-1.62-.923-2.22-.242-.579-.487-.5-.673-.51-.173-.008-.371-.01-.57-.01-.2 0-.522.074-.796.372-.273.297-1.045 1.019-1.045 2.487 0 1.468 1.07 2.886 1.22 3.086.149.2 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 000-16 8 8 0 000 16z" />
                          </svg>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 rounded-full hover:bg-[#2ecc7120]"
                          onClick={() => console.log(`Call ${lead.phone}`)}
                          title="התקשר"
                        >
                          <Phone className="h-3.5 w-3.5 text-[#2ecc71]" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 rounded-full hover:bg-[#f39c1220]"
                          onClick={() => console.log(`Apply automation to ${lead.name}`)}
                          title="בחר אוטומציה"
                        >
                          <Zap className="h-3.5 w-3.5 text-[#f39c12]" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeTab === "תגובות" && activePostDetails ? (
              <div className="max-w-md mx-auto mt-4 text-right">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">תגובות: {activePostDetails.postTitle}</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // חזרה לאיקון מאמרים
                      setActiveTab("dashboard")
                      setActivePostDetails(null)
                    }}
                    className="flex items-center gap-1"
                  >
                    <ChevronRight className="h-3 w-3" />
                    חזרה למאמרים
                  </Button>
                </div>
                <div className="space-y-2 p-2">
                  {[
                    { text: "מעוניין בנכס, אפשר פרטים?", name: "יוסי לוי", date: "היום, 11:20", isNew: true },
                    { text: "האם יש חניה?", name: "מיכל כהן", date: "היום, 08:30", isNew: true },
                    { text: "מה המחיר למטר?", name: "דני אבני", date: "אתמול, 16:45", isNew: false },
                    { text: "האם יש מעלית בבניין?", name: "רותי כהן", date: "לפני יומיים, 09:15", isNew: false },
                  ].map((comment, i) => (
                    <div key={i} className="p-2 hover:bg-gray-50 rounded-md border border-gray-200">
                      <p className="text-sm">{comment.text}</p>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>
                          {comment.name}{" "}
                          {comment.isNew && <span className="text-[#2ecc71] text-xs font-bold mr-1">(חדש)</span>}
                        </span>
                        <span>{comment.date}</span>
                      </div>
                      <div className="flex gap-2 mt-2 justify-end">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 rounded-full hover:bg-[#8e44ad20]"
                          onClick={() => console.log(`Auto reply to comment`)}
                          title="מענה אוטומטי"
                        >
                          <Reply className="h-3.5 w-3.5 text-[#8e44ad]" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 rounded-full hover:bg-[#f39c1220]"
                          onClick={() => console.log(`Manual reply to comment`)}
                          title="הגב ידנית"
                        >
                          <ExternalLink className="h-3.5 w-3.5 text-[#f39c12]" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-600 mb-4 text-sm">מסך זה בפיתוח</p>
            )}

            <Button
              variant="outline"
              onClick={() => setActiveTab("dashboard")}
              className="flex items-center gap-1 mx-auto h-8 text-sm border-gray-200 text-[#333333] mt-4"
            >
              <ChevronRight className="h-3 w-3" />
              חזרה ללוח המחוונים
            </Button>
          </div>
        )}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 h-[56px] bg-white border-t border-gray-200 flex justify-around items-center z-10">
        <Button
          variant={activeTab === "dashboard" ? "default" : "ghost"}
          size="icon"
          onClick={() => setActiveTab("dashboard")}
          className={activeTab === "dashboard" ? "bg-[#8e44ad]" : ""}
        >
          <BarChart className="h-5 w-5" />
        </Button>
        <Button
          variant={activeTab === "posts" ? "default" : "ghost"}
          size="icon"
          onClick={handleShowPosts}
          className={activeTab === "posts" ? "bg-[#8e44ad]" : ""}
        >
          <Eye className="h-5 w-5" />
        </Button>
        <Button
          className="bg-[#8e44ad] text-white rounded-full h-10 w-10 flex items-center justify-center shadow-sm"
          onClick={() => handleShowTab("create")}
        >
          <Plus className="h-5 w-5" />
        </Button>
        <Button
          variant={activeTab === "insights" ? "default" : "ghost"}
          size="icon"
          onClick={() => handleShowTab("insights")}
          className={activeTab === "insights" ? "bg-[#8e44ad]" : ""}
        >
          <Sparkles className="h-5 w-5" />
        </Button>
        <Button
          variant={activeTab === "settings" ? "default" : "ghost"}
          size="icon"
          onClick={() => handleShowTab("settings")}
          className={activeTab === "settings" ? "bg-[#8e44ad]" : ""}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* פופאוברים */}
      {showLeadsPopover && <LeadsPopover post={showLeadsPopover} onClose={() => setShowLeadsPopover(null)} />}
      {showCommentsPopover && (
        <CommentsPopover post={showCommentsPopover} onClose={() => setShowCommentsPopover(null)} />
      )}
      <CalendarModal isOpen={showCalendar} onClose={() => setShowCalendar(false)} event={selectedEvent} />
    </div>
  )
}

