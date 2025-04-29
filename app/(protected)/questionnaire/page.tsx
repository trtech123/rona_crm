'use client'

import { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabaseClient"; // Remove global import if not used elsewhere
import { createBrowserClient } from '@supabase/ssr'; // Use browser client for consistency
import { useRouter } from "next/navigation";
// Import the questionnaire component
// Assuming the component file is directly accessible or using a correct path alias
import RealEstateQuestionnaire from "@/real-estate-questionnaire"; // Adjust the path if needed

export default function QuestionnairePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState<any>(null); // State for default values
  // const router = useRouter(); // router might not be needed here anymore

  // Create client instance here to pass down
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("[Questionnaire] Fetching user and existing data...");
        // Get current session/user first - protected layout should handle redirect if no user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
           console.error("[Questionnaire] Error getting user or no user found (should be handled by layout)", userError);
           // Optionally redirect if layout failed, though layout should handle this
           // router.replace('/signin'); 
           setIsLoading(false); // Stop loading even if there's an issue
           return;
        }
        
        console.log("[Questionnaire] User found:", user.email);
        
        // Fetch existing questionnaire response to pre-fill the form
        const { data: responseData, error: responseError } = await supabase
          .from("questionnaire_responses")
          .select("response")
          .eq("user_id", user.id)
          .single();
          
        if (responseError && responseError.code !== 'PGRST116') { // Ignore error if row not found
          console.error("[Questionnaire] Error fetching existing response:", responseError);
        }

        if (responseData) {
           console.log("[Questionnaire] Found existing response, setting default values.");
           setDefaultValues(responseData.response);
        } else {
           console.log("[Questionnaire] No existing response found.");
           setDefaultValues({}); // Set to empty object if no data
        }
        
        setIsLoading(false);
        
      } catch (error) {
        console.error("[Questionnaire] Error fetching data:", error);
        setIsLoading(false); // Ensure loading stops on any error
        // Optionally show an error message to the user on the page
      }
    }
    
    fetchData();
  }, [supabase]); // Removed router dependency as layout handles initial auth redirect

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-100px)] items-center justify-center"> {/* Adjust height based on layout */}
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">טוען שאלון...</h1>
           {/* Add a more visible loading indicator if needed */}
        </div>
      </div>
    );
  }

  // Render the questionnaire component, passing the supabase client
  return <RealEstateQuestionnaire 
            defaultValues={!isLoading ? defaultValues : undefined} 
            supabase={supabase} // Pass the client instance
         />;
} 