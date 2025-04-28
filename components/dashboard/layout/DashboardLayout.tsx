"use client";

import React, { useState } from 'react';
import DashboardHeader from './DashboardHeader';
import { DashboardSidebar } from './DashboardSidebar';
import DashboardMain from './DashboardMain'; // Import DashboardMain

// Define the possible sections
export type DashboardSection = 'dashboard' | 'leads' | 'comments' | 'tasks' | 'events' | 'articles' | 'settings' | 'profile' | 'aiAutomations';

const DashboardLayout = ({ children }: { children?: React.ReactNode }) => { // Make children optional for now
  // const [activeSection, setActiveSection] = useState<DashboardSection>('dashboard'); // Remove state, sidebar handles active state internally

  return (
    <div className="flex h-screen bg-gray-50" dir="rtl"> {/* Restored dir="rtl" to keep sidebar on right */}
      {/* Sidebar - Remove props as the component doesn't accept them */}
      <DashboardSidebar />

      {/* Main Content Area (Header + Main) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader />

        {/* Main Content - Should ONLY render children from the specific page route */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6 lg:p-8">
           {/* <DashboardMain activeSection={activeSection} setActiveSection={setActiveSection} /> */}
           {/* Render children passed from the page file (e.g., PostsPage content or DashboardPage content) */}
           {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 