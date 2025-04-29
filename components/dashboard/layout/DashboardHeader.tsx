"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Bell, Phone, Plus, LogOut } from 'lucide-react';

const DashboardHeader = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
      // Optionally show an error message to the user
    } else {
      // Redirect to login or landing page after logout
      router.push('/signin');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between gap-4" dir="rtl">
      {/* Right Side - Remove M+ logo */}
      <div className="flex items-center gap-3 sm:gap-4">
         {/* Create New Post Button (Keep this) */}
         <Button 
           className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 h-9 shadow-sm hidden sm:flex items-center gap-1.5"
           onClick={() => router.push('/post-creation')}
         >
            <Plus className="h-4 w-4" />
            <span className="text-sm font-medium">צור פוסט חדש</span>
         </Button>
          {/* Icon only button for smaller screens (Keep this) */}
         <Button 
           size="icon" 
           className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-9 w-9 shadow-sm sm:hidden flex-shrink-0"
           onClick={() => router.push('/post-creation')}
         >
            <Plus className="h-5 w-5" />
             <span className="sr-only">צור פוסט חדש</span> { /* Accessibility */}
         </Button>
      </div>

      {/* Center (Search Bar) - Keep this */}
      <div className="flex-1 min-w-0 max-w-md lg:max-w-lg mx-auto px-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input
            type="search"
            placeholder="חיפוש..."
            className="w-full pl-10 pr-4 py-2 rounded-full border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-300 focus:ring-blue-500 h-9 text-sm"
          />
        </div>
      </div>

      {/* Left Side - Remove Phone & Bell, Add text to Logout */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0"> {/* Increased gap slightly */} 
        <Avatar className="h-9 w-9 border border-gray-200">
          <AvatarImage src="/placeholder-user.jpg" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        {/* Updated Logout Button */}
        <Button 
          variant="ghost" 
          className="text-gray-500 hover:text-red-600 hover:bg-red-50 h-9 px-3 rounded-md" // Adjust padding and rounding
          onClick={handleLogout} 
          title="התנתק"
        >
          <LogOut className="h-4 w-4 ml-2" /> {/* Icon on the left in RTL */}
          <span className="text-sm font-medium">התנתק</span>
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader; 