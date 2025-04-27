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

// Import the section components that were extracted
import DashboardSummaryRow from '../main-sections/DashboardSummaryRow';
import AIInsightsSection from '../main-sections/AIInsightsSection';
import LatestLeadsPanel from '../main-sections/LatestLeadsPanel';
import RecentCommentsPanel from '../main-sections/RecentCommentsPanel';
import QuickActionsPanel from '../main-sections/QuickActionsPanel';
// We likely DON'T want the hardcoded MyPostsSection imported or used here anymore
// import MyPostsSection from '../views/MyPostsSection'; 

interface MainProps {
    activeSection: DashboardSection;
    setActiveSection: (section: DashboardSection) => void;
    children?: React.ReactNode; // Add children as an optional prop
}

// Placeholder/fallback view
const PlaceholderView = ({ sectionName }: { sectionName: string }) => (
    <div className="p-6 bg-gray-100 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Placeholder: {sectionName}</h2>
        <p className="text-gray-500">This section content will be implemented soon.</p>
    </div>
);

// Simple Settings/Profile placeholders if needed by switch
const SettingsView = () => <PlaceholderView sectionName="Settings" />;
const ProfileView = () => <PlaceholderView sectionName="Profile" />;

const DashboardMain = ({ activeSection, setActiveSection, children }: MainProps) => {
    // If children are provided directly (e.g., from /posts page), render those children.
    if (children) {
        return <>{children}</>;
    }

    // --- Original logic BUT using imported components ---
    const renderMainContent = () => {
        switch (activeSection) {
            case 'dashboard':
                // This now constructs the main dashboard view using imported components
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                        <div className="lg:col-span-2 space-y-6 md:space-y-8">
                            <DashboardSummaryRow />
                            {/* Removed the hardcoded <MyPostsSection /> from here */}
                            <PlaceholderView sectionName="Main Content Area" /> 
                        </div>
                        <div className="lg:col-span-1 space-y-6 md:space-y-8">
                            {renderRightPanel()} 
                        </div>
                    </div>
                );
            // Other cases use specific views or placeholders
            case 'leads': return <PlaceholderView sectionName="Leads Management" />;
            case 'comments': return <CommentsView />;
            case 'tasks': return <PlaceholderView sectionName="Tasks Management" />;
            case 'events': return <PlaceholderView sectionName="Events Calendar" />;
            case 'articles': return <PlaceholderView sectionName="Article Editor" />;
            case 'settings': return <SettingsView />;
            case 'profile': return <ProfileView />;
            case 'aiAutomations': return <PlaceholderView sectionName="AI Automations" />;
            default: return <div>Select a section</div>;
        }
    };

    const renderRightPanel = () => {
        // Render the right panel only for the main dashboard view
        if (activeSection === 'dashboard') {
            return (
                <>
                    <AIInsightsSection />
                    <LatestLeadsPanel setActiveSection={setActiveSection} />
                    <RecentCommentsPanel setActiveSection={setActiveSection}/>
                    <QuickActionsPanel />
                </>
            );
        }
        return null; // No right panel for other sections by default
    };

    return <>{renderMainContent()}</>; 
};

export default DashboardMain; 