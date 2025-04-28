"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthLoading() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthLoadingContent />
    </Suspense>
  );
}

function AuthLoadingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuthAndRedirect() {
      try {
        console.log("[AuthLoading Client] Starting auth check");
        
        // Instead of trying to set a session, check if we already have one
        console.log("[AuthLoading Client] Checking current session");
        const { data: { session } } = await supabase.auth.getSession();
        
        // If we don't have a session, check if we need to go back to sign-in
        if (!session) {
          console.log("[AuthLoading Client] No session found, redirecting to signin");
          router.replace("/signin?error=session_not_found");
          return;
        }
        
        console.log("[AuthLoading Client] Session found:", session.user.email);
        
        // Check profile for questionnaire status
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("questionnaire_completed")
          .eq("id", session.user.id)
          .single();
          
        if (profileError && profileError.code !== "PGRST116") {
          console.error("[AuthLoading Client] Error fetching profile:", profileError);
        }
        
        console.log("[AuthLoading Client] Profile data:", profile);
        
        // Redirect based on questionnaire completion
        if (profile?.questionnaire_completed) {
          console.log("[AuthLoading Client] Redirecting to dashboard");
          router.replace("/dashboard");
        } else {
          console.log("[AuthLoading Client] Redirecting to questionnaire");
          router.replace("/questionnaire");
        }
      } catch (err) {
        console.error("[AuthLoading Client] Unexpected error:", err);
        setError("An unexpected error occurred");
        setIsLoading(false);
      }
    }

    checkAuthAndRedirect();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">שגיאת התחברות</h1>
          <p className="mt-4">{error}</p>
          <button 
            onClick={() => router.push("/signin")}
            className="mt-6 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            חזרה לדף ההתחברות
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">מאמת פרטי התחברות...</h1>
        <p className="mt-4">אנא המתן, אתה מועבר לאפליקציה...</p>
        <div className="mt-6 h-2 w-32 mx-auto bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-purple-600 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
} 