"use client";

import React from 'react';
import { DashboardSection } from './DashboardLayout'; // Import the type
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { 
    ArrowLeft, 
    ArrowRight, 
    Users, 
    MessageSquare, 
    CheckSquare, 
    Calendar, 
    FileText, 
    Plus, 
    Edit, 
    Trash, 
    Link as LinkIcon, // Use alias for Link icon
    Filter, 
    Sparkles,
    User,
    Mail,
    Phone
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // For filtering
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import CommentsView from '../views/CommentsView'; // Import the new Comments view
// Import the tabbed dashboard component with an alias
import LeadsResponsesDashboard from '../DashboardMain'; 

interface MainProps {
    activeSection: DashboardSection;
    setActiveSection: (section: DashboardSection) => void; // Add this prop for navigation
    // We'll add data props later, e.g., leadsData, postsData, etc.
}

// --- Placeholder Components --- 

// --- Dashboard View Components ---
const DashboardSummaryRow = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 mb-6 md:mb-8">
        {/* Example Summary Cards */}
        <Card className="shadow-sm border border-gray-100 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4 px-4">
                <CardTitle className="text-sm font-medium text-gray-600">לידים (היום)</CardTitle>
                <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <div className="text-2xl font-bold text-gray-800">+5</div>
                <p className="text-xs text-gray-500">סה"כ 120</p>
            </CardContent>
        </Card>
         <Card className="shadow-sm border border-gray-100 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4 px-4">
                <CardTitle className="text-sm font-medium text-gray-600">תגובות (היום)</CardTitle>
                <MessageSquare className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <div className="text-2xl font-bold text-gray-800">+12</div>
                 <p className="text-xs text-gray-500">סה"כ 85</p>
            </CardContent>
        </Card>
        <Card className="shadow-sm border border-gray-100 rounded-xl">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4 px-4">
                <CardTitle className="text-sm font-medium text-gray-600">משימות להיום</CardTitle>
                <CheckSquare className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <div className="text-2xl font-bold text-gray-800">3</div>
                 <p className="text-xs text-gray-500">סה"כ 15 פתוחות</p>
            </CardContent>
        </Card>
        {/* Add placeholders for Articles, Events if needed */}
         <Card className="shadow-sm border border-gray-100 rounded-xl hidden md:block">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4 px-4">
                <CardTitle className="text-sm font-medium text-gray-600">אירועים קרובים</CardTitle>
                <Calendar className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <div className="text-2xl font-bold text-gray-800">2</div>
                 <p className="text-xs text-gray-500">החודש</p>
            </CardContent>
        </Card>
        <Card className="shadow-sm border border-gray-100 rounded-xl hidden lg:block">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4 px-4">
                <CardTitle className="text-sm font-medium text-gray-600">מאמרים פעילים</CardTitle>
                <FileText className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <div className="text-2xl font-bold text-gray-800">8</div>
                 <p className="text-xs text-gray-500">5 טיוטות</p>
            </CardContent>
        </Card>
    </div>
);

const MyPostsSection = () => (
    <Card className="shadow-sm border border-gray-100 rounded-xl">
        <CardHeader className="p-4 md:p-5 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <CardTitle className="text-lg">הפוסטים שלי</CardTitle>
                 <div className="flex items-center gap-2 self-end sm:self-center">
                    <Select defaultValue="date">
                         <SelectTrigger className="w-[140px] h-9 text-xs border-gray-200 rounded-md">
                            <SelectValue placeholder="מיין לפי" />
                         </SelectTrigger>
                         <SelectContent>
                            <SelectItem value="date">תאריך (חדש לישן)</SelectItem>
                            <SelectItem value="success">הצלחה (גבוה לנמוך)</SelectItem>
                         </SelectContent>
                     </Select>
                     <Button variant="outline" size="sm" className="h-9 text-xs border-gray-200 rounded-md">
                         <Filter className="h-3.5 w-3.5 ml-1" /> סינון
                     </Button>
                 </div>
             </div>
        </CardHeader>
        <CardContent className="p-0">
            {/* Placeholder Post List Item */}
            <div className="p-4 md:p-5 border-b border-gray-100 last:border-none hover:bg-gray-50/50 transition-colors">
                <div className="flex justify-between items-start mb-1.5">
                    <h4 className="font-semibold text-base text-gray-800">דירת גן מרווחת</h4>
                    <span className="text-xs font-medium text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full">פעיל</span>
                </div>
                 <p className="text-sm text-gray-500 mb-3">פורסם: 25 מרץ 2025</p>
                 {/* Placeholder Stats & Actions */}
                 <div className="flex justify-between items-center">
                    <div className="flex gap-4 text-sm text-gray-600">
                         <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-blue-500"/><span className="font-medium">12</span></span>
                         <span className="flex items-center gap-1.5"><MessageSquare className="h-4 w-4 text-orange-500"/><span className="font-medium">5</span></span>
                    </div>
                    <div className="flex gap-1">
                         <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md">
                                        <LinkIcon className="h-4 w-4" />
                                        <span className="sr-only">העתק קישור</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top"><p>העתק קישור</p></TooltipContent>
                            </Tooltip>
                             <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md">
                                        <Edit className="h-4 w-4" />
                                        <span className="sr-only">ערוך</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top"><p>ערוך</p></TooltipContent>
                             </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                     <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md">
                                         <Trash className="h-4 w-4" />
                                         <span className="sr-only">מחק</span>
                                     </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top"><p>מחק</p></TooltipContent>
                              </Tooltip>
                         </TooltipProvider>
                     </div>
                 </div>
            </div>
            {/* Repeat placeholder items... */}
             <div className="p-4 md:p-5 border-b border-gray-100 last:border-none hover:bg-gray-50/50 transition-colors">
                <h4 className="font-semibold text-base text-gray-800 mb-1.5">מאמר על השקעות</h4>
                <p className="text-sm text-gray-500 mb-3">פורסם: 05 מרץ 2025</p>
                 <div className="flex justify-between items-center">
                     <div className="flex gap-4 text-sm text-gray-600">
                         <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-blue-500"/><span className="font-medium">15</span></span>
                         <span className="flex items-center gap-1.5"><MessageSquare className="h-4 w-4 text-orange-500"/><span className="font-medium">7</span></span>
                     </div>
                     <div className="flex gap-1">...</div>
                 </div>
             </div>
             <div className="p-4 border-t border-gray-100">
                 <Button variant="outline" className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 rounded-md h-9 text-sm">טען עוד פוסטים</Button>
             </div>
        </CardContent>
    </Card>
);

const AIInsightsSection = () => (
     <Card className="shadow-sm border border-purple-100 rounded-xl bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <CardHeader className="p-4 md:p-5">
            <div className="flex items-center gap-2 mb-1">
                 <Sparkles className="h-5 w-5 text-purple-500" />
                 <CardTitle className="text-lg text-purple-800">תובנות AI</CardTitle>
            </div>
            <CardDescription className="text-purple-700/80">המלצות חכמות לשיפור הביצועים</CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-5 pt-0 space-y-2.5">
            {/* Placeholder Insight Item */}
            <div className="bg-white/70 p-3 rounded-lg shadow-xs flex justify-between items-center border border-purple-100/50 hover:bg-white transition-colors">
                 <div className="flex-1 pr-3">
                    <p className="text-sm font-medium text-gray-800 mb-0.5">הפוסט "דירת גן" מצליח במיוחד!</p>
                    <p className="text-xs text-gray-500">שקול ליצור תוכן דומה בנושא גינות.</p>
                 </div>
                 <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-800 h-8 px-2 rounded-md">פרטים <ArrowLeft className="h-3.5 w-3.5 mr-1"/></Button>
            </div>
             {/* Repeat placeholder items... */}
             <div className="bg-white/70 p-3 rounded-lg shadow-xs flex justify-between items-center border border-purple-100/50 hover:bg-white transition-colors">
                <div className="flex-1 pr-3">
                    <p className="text-sm font-medium text-gray-800 mb-0.5">זמן טוב לפרסום - הקהל שלך פעיל כעת.</p>
                    <p className="text-xs text-gray-500">פרסום בין 18:00-20:00 מומלץ.</p>
                 </div>
                 <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-800 h-8 px-2 rounded-md">צור פוסט <ArrowLeft className="h-3.5 w-3.5 mr-1"/></Button>
             </div>
             <div className="pt-1">
                 <Button variant="link" className="text-purple-600 hover:text-purple-800 p-0 h-auto text-sm">הצג את כל התובנות</Button>
             </div>
        </CardContent>
    </Card>
);

const LatestLeadsPanel = ({ setActiveSection }: { setActiveSection: (section: DashboardSection) => void }) => (
    <Card className="shadow-sm border border-gray-100 rounded-xl">
        <CardHeader className="p-4 flex flex-row items-center justify-between">
            <CardTitle className="text-base">לידים אחרונים</CardTitle>
            <Button 
                variant="ghost" 
                size="sm" 
                className="text-blue-600 hover:text-blue-800 h-7 px-2 rounded text-xs font-medium"
                onClick={() => setActiveSection('leads')}
            >
                הצג הכל <ArrowLeft className="h-3 w-3 mr-1"/>
            </Button>
        </CardHeader>
        <CardContent className="p-4 pt-0">
            <ul className="space-y-3 mb-4">
                <li className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">ישראל ישראלי</span>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 h-7 px-1.5 rounded">פרטים <ArrowLeft className="h-3.5 w-3.5 mr-1"/></Button>
                </li>
                <li className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">דנה כהן</span>
                     <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 h-7 px-1.5 rounded">פרטים <ArrowLeft className="h-3.5 w-3.5 mr-1"/></Button>
                </li>
                 <li className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">אבי לוי</span>
                     <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 h-7 px-1.5 rounded">פרטים <ArrowLeft className="h-3.5 w-3.5 mr-1"/></Button>
                </li>
            </ul>
            <Button 
                className="w-full h-9 text-sm rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 hover:text-blue-700 flex items-center justify-center"
                onClick={() => setActiveSection('leads')}
            >
                <Users className="h-4 w-4 ml-1.5" />
                הצג את כל הלידים
            </Button>
        </CardContent>
    </Card>
);

const RecentCommentsPanel = ({ setActiveSection }: { setActiveSection: (section: DashboardSection) => void }) => (
    <Card className="shadow-sm border border-gray-100 rounded-xl">
        <CardHeader className="p-4 flex flex-row items-center justify-between">
            <CardTitle className="text-base">תגובות אחרונות</CardTitle>
             <Button 
                variant="ghost" 
                size="sm" 
                className="text-orange-600 hover:text-orange-800 h-7 px-2 rounded text-xs font-medium"
                onClick={() => setActiveSection('comments')}
            >
                הצג הכל <ArrowLeft className="h-3 w-3 mr-1"/>
            </Button>
        </CardHeader>
        <CardContent className="p-4 pt-0">
             <ul className="space-y-3 mb-4">
                <li className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">משה לוי: "...מחיר?"</span>
                    <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-800 h-7 px-1.5 rounded">הגב <ArrowLeft className="h-3.5 w-3.5 mr-1"/></Button>
                </li>
                 <li className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">שרה כהן: "אפשר עוד..."</span>
                     <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-800 h-7 px-1.5 rounded">הגב <ArrowLeft className="h-3.5 w-3.5 mr-1"/></Button>
                </li>
                {/* ... more comments ... */}
            </ul>
             <Button 
                className="w-full h-9 text-sm rounded-md bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200 hover:text-orange-700 flex items-center justify-center"
                onClick={() => setActiveSection('comments')}
            >
                 <MessageSquare className="h-4 w-4 ml-1.5" />
                 צפה בכל התגובות
            </Button>
        </CardContent>
    </Card>
);

const QuickActionsPanel = () => (
    <Card className="shadow-sm border border-gray-100 rounded-xl">
        <CardHeader className="p-4">
            <CardTitle className="text-base">פעולות מהירות</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 grid grid-cols-2 gap-2">
             <Button variant="outline" className="h-10 border-gray-200 rounded-md"><Plus className="h-4 w-4 ml-1"/> פוסט חדש</Button>
             <Button variant="outline" className="h-10 border-gray-200 rounded-md"><Plus className="h-4 w-4 ml-1"/> מאמר חדש</Button>
             <Button variant="outline" className="h-10 border-gray-200 rounded-md"><Plus className="h-4 w-4 ml-1"/> משימה חדשה</Button>
             <Button variant="outline" className="h-10 border-gray-200 rounded-md"><Plus className="h-4 w-4 ml-1"/> אירוע חדש</Button>
        </CardContent>
    </Card>
);

// --- Placeholder Section Views ---
const PlaceholderView = ({ sectionName }: { sectionName: string }) => (
    <div className="p-6 bg-gray-100 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Placeholder: {sectionName}</h2>
        <p className="text-gray-500">This section content will be implemented soon.</p>
    </div>
);

const LeadsOverview = () => (
    <div>
        <h2 className="text-xl font-semibold mb-4">Leads Overview</h2>
        <p>Placeholder for Leads Table and Filters...</p>
        {/* We will replace this with the actual LeadsTabView component later */}
    </div>
);
const LeadsDetails = () => (
    <div>
        <h2 className="text-xl font-semibold mb-4">Lead Details</h2>
        <p>Placeholder for displaying details of a specific lead...</p>
    </div>
);

const TasksOverview = () => (
     <div>
        <h2 className="text-xl font-semibold mb-4">Tasks Overview</h2>
        <p>Placeholder for Tasks List...</p>
    </div>
);
const TasksDetails = () => (
    <div>
        <h2 className="text-xl font-semibold mb-4">Task Details</h2>
        <p>Placeholder for displaying details of a specific task...</p>
    </div>
);

const EventsOverview = () => (
    <div>
        <h2 className="text-xl font-semibold mb-4">Events Overview</h2>
        <p>Placeholder for Events Calendar/List...</p>
    </div>
);
const EventsDetails = () => (
    <div>
        <h2 className="text-xl font-semibold mb-4">Event Details</h2>
        <p>Placeholder for displaying details of a specific event...</p>
    </div>
);

const ArticlesOverview = () => (
    <div>
        <h2 className="text-xl font-semibold mb-4">Articles Overview</h2>
        <p>Placeholder for Articles List...</p>
    </div>
);
const ArticlesDetails = () => (
    <div>
        <h2 className="text-xl font-semibold mb-4">Article Details</h2>
        <p>Placeholder for displaying details of a specific article...</p>
    </div>
);

// Simple Settings View Placeholder
const SettingsView = () => (
    <Card className="shadow-sm border border-gray-100 rounded-xl">
        <CardHeader>
            <CardTitle>הגדרות</CardTitle>
            <CardDescription>נהל את הגדרות החשבון והמערכת שלך.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <h3 className="font-medium mb-1">הגדרות פרופיל</h3>
                <p className="text-sm text-gray-600">עדכן את שם המשתמש, האימייל והסיסמה שלך.</p>
                <Button variant="outline" size="sm" className="mt-2">ערוך פרופיל</Button>
            </div>
             <div>
                <h3 className="font-medium mb-1">התראות</h3>
                <p className="text-sm text-gray-600">קבע אילו התראות תרצה לקבל.</p>
                <Button variant="outline" size="sm" className="mt-2">נהל התראות</Button>
            </div>
            <div>
                <h3 className="font-medium mb-1">חיבורים</h3>
                <p className="text-sm text-gray-600">חבר את חשבונות המדיה החברתית שלך.</p>
                <Button variant="outline" size="sm" className="mt-2">נהל חיבורים</Button>
            </div>
        </CardContent>
    </Card>
);

// Simple Profile View Placeholder
const ProfileView = () => (
    <Card className="shadow-sm border border-gray-100 rounded-xl">
        <CardHeader>
            <CardTitle className="text-center mb-2">הפרופיל שלי</CardTitle>
            <div className="flex justify-center mb-4">
                <Avatar className="h-20 w-20">
                    <AvatarFallback>YY</AvatarFallback> {/* Initials */}
                </Avatar>
            </div>
            <CardDescription className="text-center">יאיר יונגרמן</CardDescription>
            <CardDescription className="text-center text-xs text-gray-500">מנהל חשבון</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
            <div className="text-center">
                <Button variant="outline" size="sm" className="mb-4">ערוך פרופיל</Button>
            </div>
            <div className="border-t pt-4">
                <h3 className="font-medium mb-2 text-sm">פרטי התקשרות</h3>
                 <div className="flex items-center text-sm text-gray-700 mb-1.5">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    <span>yair@example.com</span>
                </div>
                 <div className="flex items-center text-sm text-gray-700">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <span>050-1234567</span>
                </div>
            </div>
            <div className="border-t pt-4">
                <h3 className="font-medium mb-2 text-sm">סטטיסטיקות</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <p>פוסטים: <span className="font-medium">25</span></p>
                    <p>לידים שנוצרו: <span className="font-medium">120</span></p>
                    <p>תגובות שנוצרו: <span className="font-medium">85</span></p>
                    <p>משימות שהושלמו: <span className="font-medium">45</span></p>
                </div>
            </div>
             <div className="border-t pt-4 text-center">
                <Button variant="link" className="text-red-600 p-0 h-auto text-sm">התנתק</Button>
            </div>
        </CardContent>
    </Card>
);

// --- Main Component --- 
const DashboardMain = ({ activeSection, setActiveSection }: MainProps) => {

    const renderMainContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return (
                    <div className="space-y-6">
                        <DashboardSummaryRow />
                        <MyPostsSection />
                        {/* Add more dashboard widgets here */}
                    </div>
                );
            case 'leads':
                 // Render the imported Leads/Responses Dashboard component
                return <LeadsResponsesDashboard />;
            case 'comments':
                return <CommentsView />; // Use the imported Comments view
            case 'tasks':
                return <TasksOverview />;
            case 'events':
                return <EventsOverview />;
            case 'articles':
                return <ArticlesOverview />;
            case 'settings':
                return <SettingsView />;
            case 'profile':
                return <ProfileView />;
            case 'aiAutomations':
                 return <PlaceholderView sectionName="AI Automations" />;
            default:
                return <PlaceholderView sectionName={activeSection} />;
        }
    };

    const renderRightPanel = () => {
        switch (activeSection) {
            case 'dashboard':
                 return (
                    <div className="space-y-6">
                         <AIInsightsSection />
                         <LatestLeadsPanel setActiveSection={setActiveSection} />
                         <RecentCommentsPanel setActiveSection={setActiveSection} />
                         <QuickActionsPanel />
                    </div>
                );
            // Return null or specific panels for other sections if needed
             case 'settings':
             case 'profile':
                 return null; // No right panel for settings/profile by default
            default:
                 return (
                    <div className="space-y-6">
                        <PlaceholderView sectionName={`${activeSection} - Right Panel`} />
                    </div>
                );
        }
    };

    // Determine grid layout based on whether the right panel should be shown
    const showRightPanel = ['dashboard', 'leads', 'comments', 'tasks', 'events', 'articles', 'aiAutomations'].includes(activeSection);
    const gridColsClass = showRightPanel ? "lg:grid-cols-3" : "lg:grid-cols-1";

    return (
         <div className={`grid grid-cols-1 ${gridColsClass} gap-6 md:gap-8`}>
            {/* Main Content Area */}
            <div className={showRightPanel ? "lg:col-span-2" : "lg:col-span-1"}>
                {renderMainContent()}
            </div>

            {/* Right Panel (conditionally rendered) */}
            {showRightPanel && (
                <div className="lg:col-span-1">
                    {renderRightPanel()}
                </div>
            )}
        </div>
    );
};

export default DashboardMain; 