"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    Users, // For Leads
    MessageSquare, // For Comments
    Calendar, // For Events
    FileText, // For Articles
    CheckSquare, // For Tasks (NEW)
    Settings, // For Settings (NEW)
    Home, // For Dashboard Home (NEW)
    LogOut, // For Logout/Settings
    Heart, // Placeholder icon, replace if needed
    User, // For Profile
    Sparkles, // Added for AI Automations
    ClipboardList, // Added for Post Creation
    Bot, // Added for AI Automations
    PlusCircle, // Added for Post Creation
    LayoutGrid // Example icon for "My Creations"
} from 'lucide-react';
// Removed DashboardSection import as setActiveSection might be removed or changed
// import { DashboardSection } from './DashboardLayout'; 
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import usePathname

// Removed SidebarProps interface as props might change
// interface SidebarProps {
//     activeSection: DashboardSection;
//     setActiveSection: (section: DashboardSection) => void;
// }

// Define navigation items with href for routing
// Map ids to likely routes based on folder structure
const navItems = [
    { id: 'dashboard', name: 'לוח בקרה', icon: Home, href: '/dashboard' },
    { id: 'posts', name: 'היצירות שלי', icon: LayoutGrid, href: '/posts' }, 
    { id: 'leads', name: 'לידים', icon: Users, href: '/dashboard/leads' }, // Assuming nested route
    { id: 'comments', name: 'תגובות', icon: MessageSquare, href: '/dashboard/comments' }, // Assuming nested route
    { id: 'tasks', name: 'משימות', icon: ClipboardList, href: '/dashboard/tasks' }, // Assuming nested route
    { id: 'events', name: 'אירועים', icon: Calendar, href: '/dashboard/events' }, // Placeholder route
    { id: 'articles', name: 'מאמרים', icon: FileText, href: '/dashboard/articles' }, // Assuming nested route
    { id: 'aiAutomations', name: 'אוטומציות AI', icon: Bot, href: '/dashboard/ai-automations' }, // Placeholder route
    { id: 'postCreation', name: 'יצירת פוסט', icon: PlusCircle, href: '/post-creation' },
    { id: 'settings', name: 'הגדרות', icon: Settings, href: '/settings' }, // Placeholder route
    { id: 'profile', name: 'פרופיל', icon: User, href: '/profile' }, // Placeholder route
];

// Separate settings item for the bottom
const settingsItem = { id: 'settings', name: 'הגדרות', icon: Settings };

// const DashboardSidebar = ({ activeSection, setActiveSection }: SidebarProps) => {
const DashboardSidebar = () => { // Remove props for now
    const pathname = usePathname(); // Get current pathname

    // Function to determine if a link is active (handles exact and partial matches)
    const isActive = (href: string) => {
        if (href === '/dashboard') {
             // Exact match for the main dashboard
             return pathname === href;
        }
        // StartsWith for nested routes, ensuring it doesn't match the main dashboard unintentionally
        return pathname.startsWith(href) && href !== '/dashboard';
    };

    return (
        <aside className="w-64 bg-white shadow-md flex flex-col h-full">
            {/* Logo/Brand */}
            <div className="p-4 border-b border-gray-200">
                <h1 className="text-xl font-bold text-purple-700 text-center">מערכת ניהול</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 mt-4 space-y-1 px-2">
                {navItems.map((item) => {
                    // ALL items should now be Links
                    return (
                        <Link key={item.id} href={item.href || '#'} passHref> {/* Add fallback href just in case */}
                            <Button
                                variant="ghost"
                                className={`w-full justify-start px-3 py-2.5 h-auto relative rounded-lg transition-colors duration-150 text-sm font-medium
                                    ${isActive(item.href || '#') // Use isActive function based on href
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                                // Removed onClick={setActiveSection}
                            >
                                <item.icon className="ml-3 h-5 w-5" /> 
                                {item.name}
                            </Button>
                        </Link>
                    );
                })}
            </nav>

            {/* Optional Footer/User Info */}
            <div className="p-4 mt-auto border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">© 2024 Rona AI</p>
            </div>
        </aside>
    );
};

export default DashboardSidebar; 