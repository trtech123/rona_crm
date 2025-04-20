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
    Sparkles // Added for AI Automations
} from 'lucide-react';
import { DashboardSection } from './DashboardLayout'; // Import the type

interface SidebarProps {
    activeSection: DashboardSection;
    setActiveSection: (section: DashboardSection) => void;
}

// Define navigation items with explicit labels for tooltips
const navItems = [
    { id: 'dashboard', label: 'לוח בקרה', icon: Home },
    { id: 'profile', label: 'הפרופיל שלי', icon: User },
    { id: 'leads', label: 'לידים', icon: Users },
    { id: 'comments', label: 'תגובות', icon: MessageSquare },
    { id: 'tasks', label: 'משימות', icon: CheckSquare },
    { id: 'events', label: 'אירועים', icon: Calendar },
    { id: 'articles', label: 'מאמרים', icon: FileText },
    { id: 'aiAutomations', label: 'אוטומציות AI', icon: Sparkles }, // Added AI Automations
    // Add more sections here if needed
];

// Separate settings item for the bottom
const settingsItem = { id: 'settings', label: 'הגדרות', icon: Settings };

const DashboardSidebar = ({ activeSection, setActiveSection }: SidebarProps) => {
    return (
        <aside className="w-56 bg-white p-3 flex flex-col border-l border-gray-200 z-10" dir="rtl">
            {/* Top Logo */}
            <div className="mb-8 mt-2 flex justify-center">
                <Button
                    variant="ghost"
                    className={`rounded-full h-11 w-11 bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:opacity-90 transition-opacity flex items-center justify-center`}
                    onClick={() => setActiveSection('dashboard')}
                    aria-label="לוח בקרה" // Accessibility label
                >
                    <Heart className="h-5 w-5" />
                </Button>
            </div>

            {/* Main Navigation with Icons and Labels */}
            <nav className="flex-1 flex flex-col gap-1.5">
                {navItems.map((item) => (
                    <Button
                        key={item.id}
                        variant="ghost"
                        className={`justify-start px-3 py-2.5 h-auto relative rounded-lg transition-colors duration-150 ${ 
                            activeSection === item.id 
                            ? 'bg-blue-50 text-blue-600' 
                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                        }`}
                        onClick={() => setActiveSection(item.id as DashboardSection)}
                    >
                        {/* Active indicator */}
                        {activeSection === item.id && (
                            <span className="absolute right-0 top-1/2 h-5 w-1 rounded-r-full bg-blue-600 transform -translate-y-1/2"></span>
                        )}
                        <div className="flex items-center gap-3 mr-1">
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            <span className="text-sm font-medium">{item.label}</span>
                        </div>
                    </Button>
                ))}
            </nav>

            {/* Bottom Settings with Icon and Label */}
            <div className="mt-auto mb-2">
                <Button
                    variant="ghost"
                    className={`justify-start px-3 py-2.5 h-auto w-full relative rounded-lg transition-colors duration-150 ${ 
                        activeSection === settingsItem.id 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                    onClick={() => setActiveSection(settingsItem.id as DashboardSection)}
                >
                    {/* Active indicator */}
                    {activeSection === settingsItem.id && (
                        <span className="absolute right-0 top-1/2 h-5 w-1 rounded-r-full bg-blue-600 transform -translate-y-1/2"></span>
                    )}
                    <div className="flex items-center gap-3 mr-1">
                        <settingsItem.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="text-sm font-medium">{settingsItem.label}</span>
                    </div>
                </Button>
            </div>
        </aside>
    );
};

export default DashboardSidebar; 