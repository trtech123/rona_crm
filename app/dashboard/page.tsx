"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut } from "lucide-react";
// TODO: Import Supabase client once created and add logout logic
// import { supabase } from '@/lib/supabase/client';
// import HebrewDashboard from '@/components/dashboard/hebrew-dashboard';

// Import the main Dashboard Layout component
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout';

export default function DashboardPage() {
  // Render the DashboardLayout directly
  // DashboardLayout will handle rendering Header, Sidebar, and Main content area
  return <DashboardLayout />;
} 