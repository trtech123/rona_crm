"use client"

import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from './layout/DashboardLayout'; // Import the new layout

// Keep necessary imports if data/logic below uses them
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
} from "lucide-react";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function HebrewDashboard() {
  // --- Keep State and Data (Potentially unused for now) ---
  // Remove state related to old UI (tabs, popovers, filters if tied to old UI)
  // const [showAllPosts, setShowAllPosts] = useState(false); // Example removal
  // const [activeTab, setActiveTab] = useState("dashboard"); // Example removal
  // const [postFilter, setPostFilter] = useState("all"); // Example removal - Re-evaluate if needed for new sections
  // const [showCalendar, setShowCalendar] = useState(false); // Example removal
  // const [selectedEvent, setSelectedEvent] = useState(null); // Example removal
  // const [activePostDetails, setActivePostDetails] = useState(null); // Example removal
  // const [showLeadsPopover, setShowLeadsPopover] = useState(null); // Example removal
  // const [showCommentsPopover, setShowCommentsPopover] = useState(null); // Example removal

  // Keep potentially useful state/refs
  const [windowHeight, setWindowHeight] = useState(0)
  const [scrollPosition, setScrollPosition] = useState(0)
  const postsContainerRef = useRef(null)
  const [screenWidth, setScreenWidth] = useState(0)

  useEffect(() => {
    // Keep this effect if screenWidth/Height logic is still useful
    setWindowHeight(window.innerHeight)
    setScreenWidth(window.innerWidth)
    const handleResize = () => {
      setWindowHeight(window.innerHeight)
      setScreenWidth(window.innerWidth)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // --- Keep Sample Data (Will be passed down later) ---
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

  const newLeads = [
    { name: "דוד כהן", phone: "050-1234567", email: "david@example.com", date: "היום, 10:30" },
    { name: "שרה לוי", phone: "052-7654321", email: "sarah@example.com", date: "היום, 09:15" },
    { name: "יוסי אברהם", phone: "054-9876543", email: "yossi@example.com", date: "אתמול, 18:45" },
  ]

  const newComments = [
    { text: "מעוניין בנכס, אפשר פרטים?", post: "דירת גן מרווחת", postId: 1, date: "היום, 11:20" },
    { text: "האם יש חניה?", post: "פנטהאוז יוקרתי", postId: 2, date: "היום, 08:30" },
  ]

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
    {
      title: 'יום עיון נדל"ן',
      date: "25/05/2025",
      dateObj: new Date(2025, 4, 25),
      location: "באר שבע",
      canCreateContent: true,
    },
  ]

  // --- NEW Sample Data ---
  const tasks = [
    { id: 1, title: "פגישה עם לקוח - ישראלי", date: "היום, 13:00", status: "open" },
    { id: 2, title: "להכין מצגת - פרויקט גבעתיים", date: "מחר, 10:00", status: "open" },
    { id: 3, title: "טלפון ליזם - רוני כהן", date: "היום, 16:00", status: "open" },
    { id: 4, title: "לבדוק חוזה מכירה", date: "28/03/2025", status: "completed" },
  ];

  const insights = [
    { id: 1, title: 'הפוסט "דירת גן" מצליח במיוחד!', description: 'שקול ליצור תוכן דומה בנושא גינות.', actionLabel: 'פרטים', actionTarget: 'post-1' },
    { id: 2, title: 'זמן טוב לפרסום - הקהל שלך פעיל כעת.', description: 'פרסום בין 18:00-20:00 מומלץ.', actionLabel: 'צור פוסט', actionTarget: 'create' },
    { id: 3, title: '3 לידים חדשים ממתינים למענה.', description: 'מענה מהיר משפר את סיכויי הסגירה.', actionLabel: 'עבור ללידים', actionTarget: 'leads' },
    { id: 4, title: 'חסרים קישורים דיגיטליים בפרופיל', description: 'הוספת קישורים משפרת אמינות.', actionLabel: 'עדכן פרופיל', actionTarget: 'settings' },
  ];

  // --- Keep Helper Functions (Re-evaluate if needed for new UI) ---
  // const getFilteredPosts = () => { ... }; // Keep if needed for specific sections
  // const getInitialPostCount = () => { ... }; // Likely removable
  // const handleShowPosts = () => { ... }; // Removable
  // const handleShowTab = (tab) => { ... }; // Removable
  // const toggleShowAllPosts = () => { ... }; // Removable
  // const scrollPosts = (direction) => { ... }; // Removable
  // const scrollInsights = (direction) => { ... }; // Removable
  // const handleEventClick = (event) => { ... }; // Keep if event details are shown
  // const CalendarModal = ({ ... }) => { ... }; // Keep if calendar interaction is needed
  // const LeadsPopover = ({ ... }) => { ... }; // Likely removable
  // const CommentsPopover = ({ ... }) => { ... }; // Likely removable

  // --- Render the New Layout --- 
    return (
    <DashboardLayout>
       {/* 
         Data will be passed down later. Example:
         <DashboardLayout 
            data={{ 
                allPosts, 
                newLeads, 
                newComments, 
                articles, 
                events, 
                tasks, 
                insights 
            }}
         />
       */}
     </DashboardLayout>
  );
}

