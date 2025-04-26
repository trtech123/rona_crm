"use client"

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Edit } from "lucide-react";
import Link from "next/link";
// TODO: Import Supabase client once created and add logout logic
// import { supabase } from '@/lib/supabase/client';
// import HebrewDashboard from '@/components/dashboard/hebrew-dashboard';

// Import the main Dashboard Layout component
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        console.log("[Dashboard] Checking auth...");
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("[Dashboard] No session found, redirecting to signin");
          router.replace("/signin");
          return;
        }
        
        console.log("[Dashboard] Session found for user:", session.user.email);
        setIsAuthenticated(true);
        setIsLoading(false);
        
      } catch (error) {
        console.error("[Dashboard] Error checking auth:", error);
        router.replace("/signin");
      }
    }
    
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/signin");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">טוען את הדאשבורד...</h1>
          <div className="h-2 w-32 mx-auto bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-purple-600 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Router will redirect, no need to render anything
  }

  // Render the DashboardLayout directly
  // DashboardLayout will handle rendering Header, Sidebar, and Main content area
  return (
    <>
      <div className="absolute top-4 right-4 z-50 flex space-x-2 space-x-reverse">
        {/* Edit Questionnaire Button */}
        <Link href="/questionnaire" passHref>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            ערוך שאלון
          </Button>
        </Link>
        {/* Logout Button */}
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          התנתק
        </Button>
      </div>
      <DashboardLayout />
    </>
  );
} 