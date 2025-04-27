"use client"

import React from 'react';

// Import the necessary dashboard section components
import DashboardSummaryRow from '@/components/dashboard/main-sections/DashboardSummaryRow';
import AIInsightsSection from '@/components/dashboard/main-sections/AIInsightsSection';
import LatestLeadsPanel from '@/components/dashboard/main-sections/LatestLeadsPanel';
import RecentCommentsPanel from '@/components/dashboard/main-sections/RecentCommentsPanel';
import QuickActionsPanel from '@/components/dashboard/main-sections/QuickActionsPanel';

// Dummy function for panels requiring setActiveSection
const dummySetActiveSection = (section: string) => { 
    console.log(`setActiveSection called with: ${section}`);
};

export default function DashboardPage() {
  // Layout: Summary row spans full width, then a grid for the main content area.
  // The main content area itself will contain a 2x2 grid of panels.

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Summary Row - Full Width */}
      <DashboardSummaryRow />

      {/* Main Content Area - Now contains a 2x2 grid of panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Arrange the 4 panels in a 2x2 structure */}
        <AIInsightsSection />
        <LatestLeadsPanel setActiveSection={dummySetActiveSection} />
        <RecentCommentsPanel setActiveSection={dummySetActiveSection}/>
        <QuickActionsPanel />
      </div>

      {/* Original Grid structure removed as panels moved to main area */}
      {/* 
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-1 space-y-6 md:space-y-8">
           ... sidebar panels were here ...
        </div>
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
           ... main content area was here ...
        </div>
      </div>
      */}
    </div>
  );
} 