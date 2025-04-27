"use client"

import React, { useState, useEffect, useRef } from "react"; // Import React
import { supabase } from "@/lib/supabaseClient";
import type { PostgrestError } from "@supabase/supabase-js";
import {
    // ... Keep necessary icons like ArrowUp, Bell, User, BarChart, Plus, Sparkles, Settings, etc.
    ArrowUp, Bell, User, BarChart, Plus, Sparkles, Settings,
    ChevronLeft, ChevronRight, Copy, Edit, Trash, Eye,
    ArrowRight, ArrowLeft, Calendar, CheckSquare, MessageSquare, Users,
    FileText, Mail, Zap, Reply, ExternalLink, Star, Award, FileCheck, FilePlus, Filter, Phone, Clock, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Keep if used for Popovers
import Link from 'next/link'; // Keep Link import
import { Badge } from "@/components/ui/badge"; // Keep Badge import
import { useRouter } from 'next/navigation'; // Import useRouter for programmatic navigation

// --- Interfaces (Keep or move to shared types file) ---
interface Post { id: number; title: string; status: string; statusColor?: string; effectiveness: number; date: string; leads: { new: number; total: number }; comments: { new: number; total: number }; likes: { new: number; total: number }; type: string; typeColor?: string; isLeading: boolean; leadingColor?: string; created_at?: string; content?: string; user_id?: string; }
interface Lead { id: number; name: string; phone: string; email: string; date: string; created_at?: string; source?: string; status?: string; post_id?: number; user_id?: string; }
interface Comment { id: number; text: string; post_id: number; post_title?: string; date: string; created_at?: string; platform?: string; status?: string; user_id?: string; profile_name?: string; }
interface Article { id: number; title: string; status: string; date: string; created_at?: string; content?: string; user_id?: string; post_id?: number; }
interface Event { id: number; title: string; date: string; dateObj?: Date; location?: string; canCreateContent?: boolean; type?: string; created_at?: string; user_id?: string; post_id?: number; }
// --- End Interfaces ---

export default function HebrewDashboard() {
    // --- State Management --- 
    // Remove activeTab state
    // const [activeTab, setActiveTab] = useState("dashboard"); 
    const [showAllPosts, setShowAllPosts] = useState(false);
    const [windowHeight, setWindowHeight] = useState(0);
    const [scrollPosition, setScrollPosition] = useState(0);
    const postsContainerRef = useRef<HTMLDivElement>(null); // Added type
    const [screenWidth, setScreenWidth] = useState(0);
    // Remove state related to modal/popovers that are now handled on separate pages?
    // Keep popover states for *interactions* on this dashboard (e.g., quick view leads/comments on post card)
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [activePostDetails, setActivePostDetails] = useState<Post | null>(null);
    const [showLeadsPopoverForPost, setShowLeadsPopoverForPost] = useState<Post | null>(null);
    const [showCommentsPopoverForPost, setShowCommentsPopoverForPost] = useState<Post | null>(null);
    const [showCalendar, setShowCalendar] = useState(false);

    // Keep Supabase data states needed for the overview dashboard
    const [posts, setPosts] = useState<Post[]>([]); // Keep for recent posts display
    const [leads, setLeads] = useState<Lead[]>([]); // Keep for stats/quick view
    const [comments, setComments] = useState<Comment[]>([]); // Keep for stats/quick view
    const [events, setEvents] = useState<Event[]>([]); // Keep for upcoming events
    const [tasks, setTasks] = useState<any[]>([]); // Keep mock tasks for now
    const [articles, setArticles] = useState<Article[]>([]); // Keep for quick view/stats

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter(); // Initialize router

    // --- useEffect for resize --- 
    useEffect(() => {
        setWindowHeight(window.innerHeight);
        setScreenWidth(window.innerWidth);
        const handleResize = () => {
            setWindowHeight(window.innerHeight);
            setScreenWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // --- useEffect for data fetching (fetch only data needed for dashboard overview) ---
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Fetch limited recent posts (e.g., 10)
                const { data: postsData, error: postsError } = await supabase
                    .from('posts')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(10); // Fetch limited posts for overview
                if (postsError) throw new Error(`Posts fetch error: ${postsError.message}`);
                setPosts((postsData as Post[]) || []);

                // Fetch recent leads (e.g., last 7 days or count)
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                const { data: leadsData, error: leadsError } = await supabase
                    .from('leads')
                    .select('id, name, email, phone, created_at, post_id') // Select only needed fields for popover/stats
                    .gte('created_at', sevenDaysAgo.toISOString())
                    .order('created_at', { ascending: false });
                if (leadsError) throw new Error(`Leads fetch error: ${leadsError.message}`);
                setLeads((leadsData as Lead[]) || []);

                // Fetch recent comments (e.g., last 7 days or count)
                const { data: commentsData, error: commentsError } = await supabase
                    .from('comments') // Adjust table name if needed
                    .select('id, text, profile_name, created_at, post_id') // Select needed fields
                    .gte('created_at', sevenDaysAgo.toISOString())
                    .order('created_at', { ascending: false });
                if (commentsError) throw new Error(`Comments fetch error: ${commentsError.message}`);
                setComments((commentsData as Comment[]) || []);
                
                // Fetch upcoming events (e.g., next 30 days)
                const today = new Date().toISOString().split('T')[0];
                const thirtyDaysFromNow = new Date();
                thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                const { data: eventsData, error: eventsError } = await supabase
                    .from('posts') // Assuming events are in posts
                    .select('id, title, date, location, type, canCreateContent')
                    .in('type', ['אירוע', 'חג', 'מערכת'])
                    .gte('date', today)
                    .lte('date', thirtyDaysFromNow.toISOString().split('T')[0])
                    .order('date', { ascending: true });
                if (eventsError) throw new Error(`Events fetch error: ${eventsError.message}`);
                setEvents(((eventsData as Event[]) || []).map(e => ({...e, dateObj: new Date(e.date)})));

                // Fetch articles for stats/quick view (e.g., last 5)
                const { data: articlesData, error: articlesError } = await supabase
                    .from('posts')
                    .select('id, title, status, created_at')
                    .eq('type', 'מאמר')
                    .order('created_at', { ascending: false })
                    .limit(5);
                if (articlesError) throw new Error(`Articles fetch error: ${articlesError.message}`);
                setArticles((articlesData as Article[]) || []);

                // Keep mock tasks for now
                setTasks([
                     { id: 1, title: "מעקב ליד - ישראל ישראלי", status: "דחוף", dueDate: "היום", dueTime: "14:00", isDaily: true },
                     { id: 2, title: "פרסום פוסט חדש", status: "בתהליך", dueDate: "היום", dueTime: "16:00", isDaily: true },
                ]);

            } catch (err: any) {
                console.error("Error fetching dashboard overview data:", err);
                setError(err.message || "Failed to fetch dashboard data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- Helper Functions & Derived State --- 
    // Keep getFilteredPosts for the horizontal scroll view
    const getFilteredPosts = () => {
        let filtered = [...posts]; // Use the limited posts fetched for overview
        // Add filtering if needed for the overview display
        return filtered.sort((a, b) => {
            if (a.isLeading && !b.isLeading) return -1;
            if (!a.isLeading && b.isLeading) return 1;
            const dateA = a.created_at || a.date;
            const dateB = b.created_at || b.date;
            return new Date(dateB).getTime() - new Date(dateA).getTime();
        });
    };
    
    const getInitialPostCount = () => {
        if (screenWidth < 640) return 1;
        if (screenWidth < 768) return 2;
        if (screenWidth < 1024) return 3;
        return 4;
    };
    const displayedPosts = showAllPosts ? getFilteredPosts() : getFilteredPosts().slice(0, getInitialPostCount());

    const upcomingEvents = events; // Already filtered in fetch

    const toggleShowAllPosts = () => setShowAllPosts(!showAllPosts);

    const scrollPosts = (direction: 'left' | 'right') => {
        if (postsContainerRef.current) {
            const scrollAmount = direction === "right" ? -300 : 300;
            postsContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
            // setScrollPosition(postsContainerRef.current.scrollLeft + scrollAmount); // Optional: Track scroll position
        }
    };
    
     const scrollInsights = (direction: 'left' | 'right') => {
        const container = document.getElementById("insights-container");
        if (container) {
            const scrollAmount = direction === "right" ? -300 : 300;
            container.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    const handleEventClick = (event: Event) => {
        setSelectedEvent(event);
        setShowCalendar(true); // Show modal calendar
    };

    // --- Popover/Modal Components (Keep these for quick views on dashboard) --- 
    const CalendarModal = ({ isOpen, onClose, event }: { isOpen: boolean, onClose: () => void, event: Event | null }) => {
        // ... CalendarModal JSX ... 
         if (!isOpen) return null;

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
    
              {/* Placeholder for actual calendar */} 
              <div className="bg-gray-100 rounded-lg p-4 h-64 flex items-center justify-center">
                <p className="text-gray-500">תצוגת יומן (בפיתוח)</p>
              </div>
    
              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={onClose} className="mr-2">
                  סגור
                </Button>
                {event && event.canCreateContent && (
                   <Link href="/dashboard/posts/create" passHref> {/* Link to create page */}
                       <Button>
                         צור תוכן
                       </Button>
                    </Link>
                )}
              </div>
            </div>
          </div>
        );
    };

    const LeadsPopoverContent = ({ post }: { post: Post | null }) => {
         if (!post) return null;
         const postLeads = leads.filter(l => l.post_id === post.id);
         
         return (
             <>
                <div className="p-3 border-b">
                    <h4 className="font-medium text-sm text-center">לידים מפוסט: {post.title}</h4>
                </div>
                <div className="max-h-60 overflow-y-auto p-2 space-y-2">
                    {postLeads.length > 0 ? (
                        postLeads.map((lead) => (
                            <div key={lead.id} className="p-2 hover:bg-gray-50 rounded-md text-xs">
                                <p className="font-medium text-xs flex justify-between items-center">
                                    {lead.name}
                                    <Button variant="ghost" size="sm" className="h-6 px-1">
                                        <Phone className="h-3 w-3 text-green-600" />
                                    </Button>
                                </p>
                                <p className="text-gray-500">{lead.email}</p>
                                <p className="text-gray-500">{new Date(lead.created_at!).toLocaleString('he-IL')}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-gray-500 text-center p-4">אין לידים מפוסט זה</p>
                    )}
                </div>
                 <div className="p-2 border-t flex justify-end">
                     <Link href="/dashboard/leads" passHref>
                         <Button variant="link" size="sm" className="text-xs h-6 text-purple-600">הצג את כל הלידים</Button>
                     </Link>
                 </div>
             </>
         );
    };

    const CommentsPopoverContent = ({ post }: { post: Post | null }) => {
         if (!post) return null;
         const postComments = comments.filter(c => c.post_id === post.id);

         return (
             <>
                <div className="p-3 border-b">
                    <h4 className="font-medium text-sm text-center">תגובות לפוסט: {post.title}</h4>
                </div>
                <div className="max-h-60 overflow-y-auto p-2 space-y-2">
                    {postComments.length > 0 ? (
                        postComments.map((comment) => (
                            <div key={comment.id} className="p-2 hover:bg-gray-50 rounded-md text-xs">
                                <p className="font-medium text-xs flex justify-between items-center">
                                    {comment.profile_name || `תגובה ${comment.id}`}
                                    <Button variant="ghost" size="sm" className="h-6 px-1">
                                        <Reply className="h-3 w-3 text-purple-600" />
                                    </Button>
                                </p>
                                <p className="text-gray-700 mt-1 text-xs">{comment.text}</p>
                                <p className="text-gray-500 mt-1 text-xs">{new Date(comment.created_at!).toLocaleString('he-IL')}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-gray-500 text-center p-4">אין תגובות לפוסט זה</p>
                    )}
                </div>
                 <div className="p-2 border-t flex justify-end">
                      <Link href="/dashboard/comments" passHref>
                         <Button variant="link" size="sm" className="text-xs h-6 text-purple-600">הצג את כל התגובות</Button>
                     </Link>
                 </div>
             </>
         );
    };
    // --- End Popover/Modal Components ---
    
    // --- Derived data for insights cards (use fetched data) --- 
    const insightsData = [
        {
            title: "סיכום מהיר", icon: BarChart, color: "#3498db",
            data: [
                { label: "לידים חדשים (7 ימים)", value: leads.length, change: "" },
                { label: "תגובות חדשות (7 ימים)", value: comments.length, change: "" },
                { label: "סה"כ פוסטים", value: posts.length, change: "" }, // Or fetch total count
            ],
        },
        {
            title: "פוסט מוביל", icon: Award, color: "#e74c3c",
            data: posts.find(p => p.isLeading) || (posts.length > 0 ? posts[0] : null),
            actions: [
                 { label: "הצג פוסט", icon: Eye, onClick: () => {/* Maybe link to post page? */ } },
                 { label: "צור דומה", icon: Copy, onClick: () => router.push('/dashboard/posts/create') },
            ],
        },
        {
            title: "לוח שנה", icon: Calendar, color: "#2ecc71",
            data: upcomingEvents,
            actions: [
                 { label: "הצג הכל", icon: Calendar, onClick: () => router.push('/dashboard/events') },
                 { label: "הוסף אירוע", icon: Plus, onClick: () => {/* Open add event modal or page */} },
            ],
        },
        {
            title: "משימות לביצוע", icon: FileCheck, color: "#1abc9c",
            data: tasks, // Use mock tasks for now
            actions: [
                 { label: "הצג הכל", icon: CheckSquare, onClick: () => router.push('/dashboard/tasks') },
                 { label: "הוסף משימה", icon: Plus, onClick: () => {/* Open add task modal or page */} },
            ],
        },
    ];
    // --- End Derived Data --- 

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50" dir="rtl">
            {/* Header - Update profile/logo links */}
            <div className="container mx-auto pt-4 pb-2 border-b border-gray-100">
                <div className="flex items-center justify-between">
                     {/* ... User greeting ... */}
                     <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 bg-[#f8f8f8] rounded-full p-1 shadow-sm border border-gray-200">
                            <Image src="/images/owl-mascot.png" alt="Owl Mascot" width={56} height={56} className="object-contain" />
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-[#333333]">שלום, אני סוכן המדיה האישי שלך</h1>
                             <div className="flex gap-1 items-center">
                                 <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                 <span className="text-xs text-gray-500">פעיל</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                         {/* Logo/Questionnaire Links */ 
                         <div className="flex items-center gap-2 ml-2">
                            {/* TODO: Fetch actual logo_url from profile */}
                             <div className="h-10 w-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                                <Image src="/placeholder.svg?height=40&width=40" alt="לוגו אישי" width={40} height={40} className="object-cover" />
                             </div>
                             <Link href="/dashboard/questionnaire" passHref>
                                <Button variant="ghost" size="sm" className="text-xs text-[#8e44ad] font-medium">
                                    שאלון אישי
                                </Button>
                              </Link>
                         </div>
                         {/* Notification/Profile Buttons */ 
                         <div className="flex gap-2">
                             <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-gray-200">
                                <Bell className="h-4 w-4 text-gray-600" />
                             </Button>
                             {/* TODO: Link to actual profile page or settings */}
                             <Link href="/dashboard/settings" passHref>
                                <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-gray-200">
                                    <User className="h-4 w-4 text-gray-600" />
                                </Button>
                             </Link>
                         </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                {/* Loading and Error States */}
                 {isLoading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
                        <p className="ml-4 text-purple-700">טוען נתונים...</p>
                    </div>
                 )}
                 {error && (
                    <Card className="bg-red-100 border-red-500">
                        <CardContent className="p-4 text-red-700">
                            <p><strong>שגיאה:</strong> {error}</p>
                        </CardContent>
                    </Card>
                 )}

                 {!isLoading && !error && (
                    <>
                        {/* insights section - Renders overview cards */}
                        <div className="relative">
                           <Button variant="ghost" size="icon" className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-90 rounded-full h-8 w-8 shadow-sm" onClick={() => scrollInsights("right")}> <ArrowRight className="h-4 w-4 text-gray-600" /></Button>
                           <div id="insights-container" className="flex overflow-x-auto pb-2 gap-3 px-8 hide-scrollbar" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                            {insightsData.map((insight, i) => (
                                <Card key={i} className="p-3 flex-shrink-0 w-[200px] md:w-[240px] bg-white rounded-lg shadow-sm border border-gray-100">
                                    <div className="flex items-center mb-2">
                                         <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2`} style={{ backgroundColor: `${insight.color}20` }}>
                                             <insight.icon className="h-4 w-4" style={{ color: insight.color }} />
                                         </div>
                                         <p className="font-semibold text-sm">{insight.title}</p>
                                    </div>
                                     {/* Render insight data - simplified */}
                                     <div className="space-y-1 text-xs text-gray-700 pl-1">
                                         {insight.title === "פוסט מוביל" && insight.data ? (
                                             <p className="truncate">{(insight.data as Post).title}</p>
                                         ) : insight.title === "לוח שנה" ? (
                                             <p>{upcomingEvents.length > 0 ? `${upcomingEvents.length} אירועים קרובים` : "אין אירועים"}</p>
                                         ) : insight.title === "משימות לביצוע" ? (
                                             <p>{tasks.length > 0 ? `${tasks.length} משימות פתוחות` : "אין משימות"}</p>
                                         ) : Array.isArray(insight.data) ? (
                                            (insight.data as { label: string; value: number | string; change?: string }[]).map((item, idx) => (
                                                <div key={idx} className="flex justify-between">
                                                    <span>{item.label}:</span>
                                                    <span className="font-medium">{item.value}</span>
                                                </div>
                                            ))
                                         ) : null}
                                     </div>
                                     <div className="mt-2 pt-2 border-t border-gray-100 flex justify-end gap-1">
                                        {insight.actions?.map((action, idx) => (
                                             <Button key={idx} variant="ghost" size="xs" className="h-6 px-1 text-purple-600 hover:bg-purple-50" onClick={action.onClick}>
                                                 <action.icon className="h-3 w-3 ml-1" />{action.label}
                                             </Button>
                                        ))}
                                     </div>
                                </Card>
                            ))}
                            </div>
                             <Button variant="ghost" size="icon" className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-90 rounded-full h-8 w-8 shadow-sm" onClick={() => scrollInsights("left")}> <ArrowLeft className="h-4 w-4 text-gray-600" /> </Button>
                        </div>

                        {/* Stats Icons Row - Update links */}
                        {/* This section seems removed in previous edits, re-adding simplified version with links */}
                         <div className="flex justify-around items-center mb-4 bg-white p-3 rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
                              {/* Example Link for Leads */}
                              <Link href="/dashboard/leads" className="flex flex-col items-center text-center px-2 cursor-pointer transition-transform hover:scale-105">
                                 <div className="w-12 h-12 rounded-full flex items-center justify-center mb-1 bg-purple-100">
                                     <Users className="h-6 w-6 text-purple-600" />
                                 </div>
                                 <h3 className="text-xs font-medium text-gray-700">לידים</h3>
                                 {/* Optionally show count */} 
                                 <span className="text-xs text-gray-500">({leads.length})</span>
                              </Link>
                              {/* Example Link for Comments */}
                              <Link href="/dashboard/comments" className="flex flex-col items-center text-center px-2 cursor-pointer transition-transform hover:scale-105">
                                 <div className="w-12 h-12 rounded-full flex items-center justify-center mb-1 bg-red-100">
                                     <MessageSquare className="h-6 w-6 text-red-600" />
                                 </div>
                                 <h3 className="text-xs font-medium text-gray-700">תגובות</h3>
                                 <span className="text-xs text-gray-500">({comments.length})</span>
                              </Link>
                               {/* Example Link for Articles */}
                              <Link href="/dashboard/articles" className="flex flex-col items-center text-center px-2 cursor-pointer transition-transform hover:scale-105">
                                 <div className="w-12 h-12 rounded-full flex items-center justify-center mb-1 bg-blue-100">
                                     <FileText className="h-6 w-6 text-blue-600" />
                                 </div>
                                 <h3 className="text-xs font-medium text-gray-700">מאמרים</h3>
                                  <span className="text-xs text-gray-500">({articles.length})</span>
                              </Link>
                              {/* Example Link for Tasks */}
                              <Link href="/dashboard/tasks" className="flex flex-col items-center text-center px-2 cursor-pointer transition-transform hover:scale-105">
                                 <div className="w-12 h-12 rounded-full flex items-center justify-center mb-1 bg-yellow-100">
                                     <CheckSquare className="h-6 w-6 text-yellow-600" />
                                 </div>
                                 <h3 className="text-xs font-medium text-gray-700">משימות</h3>
                                  <span className="text-xs text-gray-500">({tasks.length})</span>
                              </Link>
                               {/* Example Link for Events */}
                              <Link href="/dashboard/events" className="flex flex-col items-center text-center px-2 cursor-pointer transition-transform hover:scale-105">
                                 <div className="w-12 h-12 rounded-full flex items-center justify-center mb-1 bg-green-100">
                                     <Calendar className="h-6 w-6 text-green-600" />
                                 </div>
                                 <h3 className="text-xs font-medium text-gray-700">אירועים</h3>
                                  <span className="text-xs text-gray-500">({events.length})</span>
                              </Link>
                          </div>

                        {/* Create Content Button & Filters - Keep similar structure */}
                        <div className="flex justify-between items-center mb-4">
                           <Link href="/dashboard/posts/create" passHref>
                               <Button className="bg-[#8e44ad] hover:bg-[#7d3c98] text-white rounded-full px-6 py-1 h-10 shadow-sm">
                                   <Plus className="mr-1 h-4 w-4" />
                                   <span className="text-sm">צור תוכן חדש</span>
                               </Button>
                           </Link>
                           {/* Keep Post Filters for the horizontal view? Optional. */}
                            {/* <div className="flex gap-2 overflow-x-auto pb-1">
                                <Button size="sm" variant="outline" ...>הכל</Button>...
                            </div> */} 
                        </div>

                        {/* Posts Section - Horizontal Scrollable */} 
                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-base font-bold text-[#333333]">הפוסטים האחרונים</h2>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" onClick={toggleShowAllPosts} className="hover:bg-gray-100 h-7 w-7 rounded-full">
                                        <ArrowUp className={`h-4 w-4 transition-transform text-gray-600 ${showAllPosts ? "rotate-180" : ""}`} />
                                    </Button>
                                    <Link href="/dashboard/posts" passHref>
                                        <Button variant="link" className="text-[#8e44ad] p-0 h-7">
                                            <span className="text-sm">הצג הכל</span>
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                             <div className="relative">
                               <Button variant="ghost" size="icon" className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-90 rounded-full h-8 w-8 shadow-sm" onClick={() => scrollPosts("right")}> <ArrowRight className="h-4 w-4 text-gray-600" /> </Button>
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
                                                    post.isLeading ? "border-[#e74c3c] border-[3px]" : post.type === "מאמר" ? "border-[#8e44ad] border-[2px]" : "border-gray-200"
                                                }`}
                                                 style={{borderColor: post.isLeading ? "#e74c3c" : post.type === "מאמר" ? "#8e44ad" : ""}}
                                            >
                                                <CardContent className="p-0">
                                                     {/* Simplified Post Card Content for Overview */}
                                                     <div className="h-[80px] bg-gray-100 relative"> {/* Image placeholder */}
                                                         <div className="absolute top-1 right-1">
                                                             <Badge variant="secondary" className="text-xs" style={{backgroundColor: `${post.typeColor || '#3498db'}20`, color: post.typeColor || '#3498db'}}>{post.type}</Badge>
                                                         </div>
                                                          <div className="absolute top-1 left-1">
                                                             <Badge variant="outline" className="text-xs" style={{backgroundColor: `${post.statusColor || '#2ecc71'}20`, color: post.statusColor || '#2ecc71'}}>{post.status}</Badge>
                                                         </div>
                                                     </div>
                                                    <div className="p-2">
                                                        <h3 className="font-semibold text-xs text-[#333333] mb-1 truncate">{post.title}</h3>
                                                        <div className="grid grid-cols-3 gap-1 text-[10px] mb-2">
                                                            {/* Popover Triggers for Leads/Comments */}
                                                             <Popover>
                                                                 <PopoverTrigger asChild>
                                                                    <div className="flex items-center gap-1 cursor-pointer">
                                                                         <Users className="h-3 w-3 text-purple-600"/> <span className="text-gray-600">{post.leads?.total ?? 0}</span>
                                                                    </div>
                                                                 </PopoverTrigger>
                                                                 <PopoverContent className="w-60 p-0"><LeadsPopoverContent post={post} /></PopoverContent>
                                                             </Popover>
                                                              <Popover>
                                                                 <PopoverTrigger asChild>
                                                                     <div className="flex items-center gap-1 cursor-pointer">
                                                                         <MessageSquare className="h-3 w-3 text-red-600"/> <span className="text-gray-600">{post.comments?.total ?? 0}</span>
                                                                     </div>
                                                                 </PopoverTrigger>
                                                                  <PopoverContent className="w-60 p-0"><CommentsPopoverContent post={post} /></PopoverContent>
                                                             </Popover>
                                                            <div className="flex items-center gap-1">
                                                                 <Star className="h-3 w-3 text-yellow-500"/> <span className="text-gray-600">{post.likes?.total ?? 0}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-end gap-1">
                                                              <Link href={`/dashboard/posts/edit/${post.id}`} passHref>
                                                                <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full hover:bg-[#8e44ad20]" title="עריכה"><Edit className="h-3 w-3 text-[#8e44ad]" /></Button>
                                                               </Link>
                                                               <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full hover:bg-[#f39c1220]" title={post.status === "טיוטה" ? "אישור" : "העתקה"}><Copy className="h-3 w-3 text-[#f39c12]" /></Button>
                                                               <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full hover:bg-[#e74c3c20]" title="מחיקה"><Trash className="h-3 w-3 text-[#e74c3c]" /></Button>
                                                         </div>
                                                     </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                    ) : (
                                        <div className="flex items-center justify-center w-full py-8 text-gray-500">
                                            <p>אין פוסטים אחרונים להצגה</p>
                                        </div>
                                    )}
                                </div>
                               <Button variant="ghost" size="icon" className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-90 rounded-full h-8 w-8 shadow-sm" onClick={() => scrollPosts("left")}> <ArrowLeft className="h-4 w-4 text-gray-600" /> </Button>
                           </div>
                        </div>

                         {/* AI Insights - Keep */}
                         <div className="mb-4">
                             <div className="flex justify-between items-center mb-3">
                                 <h2 className="text-base font-bold text-[#333333]">תובנות AI</h2>
                              </div>
                              {/* ... AI Insights scroll container JSX ... */}
                         </div>

                        {/* Quick Access Circles - Update links */}
                         <div className="flex justify-center gap-6 mb-2">
                             {/* Subscription */}
                             <Link href="/dashboard/subscription" className="flex flex-col items-center cursor-pointer">
                                <div className="w-[45px] h-[45px] bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-sm"><span className="text-lg">💎</span></div><span className="text-xs text-[#333333] mt-1 font-medium">מנוי</span>
                             </Link>
                             {/* Questionnaire */}
                              <Link href="/dashboard/questionnaire" className="flex flex-col items-center cursor-pointer">
                                 <div className="w-[45px] h-[45px] bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-sm"><span className="text-lg">📝</span></div><span className="text-xs text-[#333333] mt-1 font-medium">שאלון</span>
                              </Link>
                             {/* Automations */}
                             <Link href="/dashboard/automations" className="flex flex-col items-center cursor-pointer">
                                 <div className="w-[45px] h-[45px] bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-sm"><span className="text-lg">⚙️</span></div><span className="text-xs text-[#333333] mt-1 font-medium">אוטומציות</span>
                             </Link>
                         </div>
                     </>
                 )}

                 {/* Remove the large block for rendering different tabs */}
                 {/* {activeTab !== "dashboard" && activeTab !== "posts" && (...)} */}
            </main>

            {/* Bottom Navigation - Update links */}
            <div className="fixed bottom-0 left-0 right-0 h-[56px] bg-white border-t border-gray-200 flex justify-around items-center z-10">
                 {/* Dashboard */} 
                 <Link href="/dashboard" passHref>
                    <Button variant={router.pathname === '/dashboard' ? 'secondary' : 'ghost'} size="icon">
                         <BarChart className="h-5 w-5" />
                     </Button>
                 </Link>
                 {/* Posts */} 
                 <Link href="/dashboard/posts" passHref>
                     <Button variant={router.pathname === '/dashboard/posts' ? 'secondary' : 'ghost'} size="icon">
                         <Eye className="h-5 w-5" />
                     </Button>
                 </Link>
                 {/* Create */} 
                 <Link href="/dashboard/posts/create" passHref> {/* Or /post-creation */}
                     <Button className="bg-[#8e44ad] text-white rounded-full h-10 w-10 flex items-center justify-center shadow-sm">
                         <Plus className="h-5 w-5" />
                     </Button>
                 </Link>
                 {/* Insights - Link to dashboard or dedicated page? */}
                  <Link href="/dashboard#insights" passHref> {/* Example linking to section */}
                     <Button variant={router.pathname === '/dashboard/insights' ? 'secondary' : 'ghost'} size="icon">
                          <Sparkles className="h-5 w-5" />
                      </Button>
                  </Link>
                 {/* Settings */} 
                 <Link href="/dashboard/settings" passHref>
                     <Button variant={router.pathname === '/dashboard/settings' ? 'secondary' : 'ghost'} size="icon">
                         <Settings className="h-5 w-5" />
                     </Button>
                 </Link>
            </div>

            {/* Keep Popovers for dashboard interactions */}
             {showLeadsPopoverForPost && (
                <Popover open={!!showLeadsPopoverForPost} onOpenChange={() => setShowLeadsPopoverForPost(null)}>
                   <PopoverTrigger asChild>
                       {/* This trigger needs to be attached to the leads count in the post card */}
                       <span className="hidden"></span> 
                   </PopoverTrigger>
                    <PopoverContent className="w-60 p-0"><LeadsPopoverContent post={showLeadsPopoverForPost} /></PopoverContent>
                </Popover>
            )}
            {showCommentsPopoverForPost && (
                <Popover open={!!showCommentsPopoverForPost} onOpenChange={() => setShowCommentsPopoverForPost(null)}>
                    <PopoverTrigger asChild>
                       {/* This trigger needs to be attached to the comments count in the post card */}
                       <span className="hidden"></span> 
                   </PopoverTrigger>
                    <PopoverContent className="w-60 p-0"><CommentsPopoverContent post={showCommentsPopoverForPost} /></PopoverContent>
                 </Popover>
            )}
            <CalendarModal isOpen={showCalendar} onClose={() => setShowCalendar(false)} event={selectedEvent} />
        </div>
    );
}

