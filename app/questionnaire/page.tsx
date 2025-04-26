"use client"

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
// Import the questionnaire component
// Assuming the component file is directly accessible or using a correct path alias
import RealEstateQuestionnaire from "@/real-estate-questionnaire"; // Adjust the path if needed

export default function QuestionnairePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        console.log("[Questionnaire] Checking auth...");
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("[Questionnaire] No session found, redirecting to signin");
          router.replace("/signin");
          return;
        }
        
        console.log("[Questionnaire] Session found for user:", session.user.email);
        
        // Check if user already completed the questionnaire
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("questionnaire_completed")
          .eq("id", session.user.id)
          .single();
          
        if (profile?.questionnaire_completed) {
          console.log("[Questionnaire] User already completed questionnaire, redirecting to dashboard");
          router.replace("/dashboard");
          return;
        }
        
        setIsAuthenticated(true);
        setIsLoading(false);
        
      } catch (error) {
        console.error("[Questionnaire] Error checking auth:", error);
        router.replace("/signin");
      }
    }
    
    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">טוען את השאלון...</h1>
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

  // Render the questionnaire component
  return <RealEstateQuestionnaire />;
} 