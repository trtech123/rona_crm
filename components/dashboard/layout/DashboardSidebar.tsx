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
    PlusCircle // Added for Post Creation
} from 'lucide-react';
import { DashboardSection } from './DashboardLayout'; // Import the type
import Link from 'next/link'; // Import Link

interface SidebarProps {
    activeSection: DashboardSection;
    setActiveSection: (section: DashboardSection) => void;
}

// Define navigation items with explicit labels for tooltips
const navItems = [
    { id: 'dashboard', name: 'לוח בקרה', icon: Home },
    { id: 'leads', name: 'לידים', icon: Users },
    { id: 'comments', name: 'תגובות', icon: MessageSquare },
    { id: 'tasks', name: 'משימות', icon: ClipboardList },
    { id: 'events', name: 'אירועים', icon: Calendar },
    { id: 'articles', name: 'מאמרים', icon: FileText },
    { id: 'aiAutomations', name: 'אוטומציות AI', icon: Bot },
    { id: 'postCreation', name: 'יצירת פוסט', icon: PlusCircle, href: '/post-creation' },
    { id: 'settings', name: 'הגדרות', icon: Settings },
    { id: 'profile', name: 'פרופיל', icon: User },
];

// Separate settings item for the bottom
const settingsItem = { id: 'settings', name: 'הגדרות', icon: Settings };

const DashboardSidebar = ({ activeSection, setActiveSection }: SidebarProps) => {
    return (
        <aside className="w-64 bg-white shadow-md flex flex-col h-full">
            {/* Logo/Brand */}
            <div className="p-4 border-b border-gray-200">
                <h1 className="text-xl font-bold text-purple-700 text-center">מערכת ניהול</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 mt-4 space-y-1 px-2">
                {navItems.map((item) => {
                    // Use Link for items with an href
                    if (item.href) {
                        return (
                            <Link key={item.id} href={item.href} passHref>
                                <Button
                                    variant="ghost" // Use ghost variant like other buttons
                                    className={`w-full justify-start px-3 py-2.5 h-auto relative rounded-lg transition-colors duration-150 text-sm font-medium
                                        ${activeSection === item.id // Highlight if active (optional for external links)
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                    // onClick={() => setActiveSection(item.id as DashboardSection)} // Decide if clicking external link should change internal section
                                >
                                    <item.icon className="ml-3 h-5 w-5" /> {/* Use ml-3 for RTL */} 
                                    {item.name}
                                </Button>
                            </Link>
                        );
                    } else {
                        // Use Button for internal section switching
                        return (
                            <Button
                                key={item.id}
                                variant="ghost" // Use ghost variant
                                onClick={() => setActiveSection(item.id as DashboardSection)}
                                className={`w-full justify-start px-3 py-2.5 h-auto relative rounded-lg transition-colors duration-150 text-sm font-medium
                                    ${activeSection === item.id
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                            >
                                <item.icon className="ml-3 h-5 w-5" /> {/* Use ml-3 for RTL */} 
                                {item.name}
                            </Button>
                        );
                    }
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