"use client";

import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Bell, Phone, Plus } from 'lucide-react';

const DashboardHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between gap-4" dir="rtl">
      {/* Right Side */}
      <div className="flex items-center gap-3 sm:gap-4">
         {/* Placeholder Logo */}
         <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-sm">
           M+
         </div>
         {/* Create New Post Button */}
         <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 h-9 shadow-sm hidden sm:flex items-center gap-1.5">
            <Plus className="h-4 w-4" />
            <span className="text-sm font-medium">צור פוסט חדש</span>
         </Button>
          {/* Icon only button for smaller screens */}
         <Button size="icon" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-9 w-9 shadow-sm sm:hidden flex-shrink-0">
            <Plus className="h-5 w-5" />
             <span className="sr-only">צור פוסט חדש</span> { /* Accessibility */}
         </Button>
      </div>

      {/* Center (Search Bar) - Slightly softer background */}
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

      {/* Left Side - Adjusted gap, consistent icon button size */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <Button variant="ghost" size="icon" className="rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 h-9 w-9">
           <span className="sr-only">טלפון</span>
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 relative h-9 w-9">
           <span className="sr-only">התראות</span>
          <Bell className="h-5 w-5" />
          {/* <span className="absolute -top-0.5 -right-0.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-1 ring-white" /> */}
        </Button>
        <Avatar className="h-9 w-9 border border-gray-200">
          <AvatarImage src="/placeholder-user.jpg" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default DashboardHeader; 