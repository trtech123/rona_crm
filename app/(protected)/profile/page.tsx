"use client"; // Or remove if it's a Server Component initially

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr'; // Use browser client
import { User } from '@supabase/supabase-js'; // Import User type
import Link from 'next/link'; // Import Link for navigation
import { Button } from '@/components/ui/button'; // Import Button

// Mapping for questionnaire keys to Hebrew labels
const keyToHebrewMap: { [key: string]: string } = {
  fullName: 'שם מלא',
  businessName: 'שם העסק',
  profession: 'תחום עיסוק',
  otherProfession: 'תחום עיסוק אחר',
  website: 'אתר אינטרנט',
  facebookUrl: 'פייסבוק',
  instagramUrl: 'אינסטגרם',
  linkedinUrl: 'לינקדאין',
  youtubeUrl: 'יוטיוב',
  tiktokUrl: 'טיקטוק',
  googleBusinessUrl: 'גוגל לעסק',
  otherProfiles: 'קישורים נוספים',
  logo: 'לוגו', // Although we filter out objects, good to have
  profilePicture: 'תמונת פרופיל', // Although we filter out objects, good to have
  selfPresentation: 'הצגה עצמית',
  idealClient: 'לקוח אידיאלי',
  otherIdealClient: 'לקוח אידיאלי אחר',
  professionalBackground: 'רקע מקצועי',
  favoriteAspect: 'היבט אהוב בעבודה',
  additionalInfo: 'מידע נוסף',
  // Add any other keys from your questionnaire schema here
};

// Mapping for profession values
const professionValueMap: { [key: string]: string } = {
  realEstateAgent: "סוכן נדל״ן",
  developer: "יזם",
  architect: "אדריכל",
  interiorDesigner: "מעצב פנים",
  realEstateLawyer: "עו״ד מקרקעין",
  propertyManager: "מנהל נכסים",
  appraiser: "שמאי",
  taxConsultant: "יועץ מיסוי",
  projectMarketer: "משווק פרויקטים",
  other: "אחר",
};

// Mapping for idealClient values
const idealClientValueMap: { [key: string]: string } = {
  youngCouples: "זוגות צעירים",
  investors: "משקיעים",
  foreignResidents: "תושבי חוץ",
  developers: "יזמים",
  retirees: "גמלאים",
  pressuredSellers: "מוכרים לחוצים",
  other: "אחר",
};

// Updated helper function to use the map
const formatKey = (key: string): string => {
  return keyToHebrewMap[key] || key // Return Hebrew name or original key if not found
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [questionnaireData, setQuestionnaireData] = useState<any | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingQuestionnaire, setLoadingQuestionnaire] = useState(false);
  const [errorUser, setErrorUser] = useState<string | null>(null);
  const [errorQuestionnaire, setErrorQuestionnaire] = useState<string | null>(null);

  // Create Supabase client only once
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true);
      setErrorUser(null);
      try {
        const { data, error: getUserError } = await supabase.auth.getUser();
        if (getUserError) {
          throw getUserError;
        }
        setUser(data.user);
      } catch (err: any) {
        console.error("Error fetching user:", err);
        setErrorUser("שגיאה בטעינת פרטי המשתמש.");
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [supabase]); // Dependency array includes supabase client instance

  useEffect(() => {
    if (!user) return; // Don't fetch if user isn't loaded

    const fetchQuestionnaireData = async () => {
      setLoadingQuestionnaire(true);
      setErrorQuestionnaire(null);
      try {
        const { data, error: getQuestionnaireError } = await supabase
          .from('questionnaire_responses')
          .select('response')
          .eq('user_id', user.id)
          .single(); // Assuming one response per user

        if (getQuestionnaireError) {
           // Handle case where no response exists gracefully
           if (getQuestionnaireError.code === 'PGRST116') { 
             console.log('No questionnaire response found for user.');
             setQuestionnaireData(null); // Explicitly set to null if not found
           } else {
             throw getQuestionnaireError;
           }
        }
        if (data) {
          setQuestionnaireData(data.response);
        }
      } catch (err: any) {
        console.error("Error fetching questionnaire data:", err);
        setErrorQuestionnaire("שגיאה בטעינת נתוני השאלון.");
      } finally {
        setLoadingQuestionnaire(false);
      }
    };

    fetchQuestionnaireData();
  }, [user, supabase]); // Re-run if user or supabase changes

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold border-b pb-2">פרופיל משתמש</h1>

      {/* User Details Section */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">פרטים אישיים</h2>
        {loadingUser && <p>טוען פרטי משתמש...</p>}
        {errorUser && <p className="text-red-600">{errorUser}</p>}
        {user && (
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="font-medium w-24 text-gray-600">אימייל:</span>
              <span className="text-gray-800">{user.email}</span>
            </div>
            {/* Add more user details here if needed */}
          </div>
        )}
      </div>

      {/* Questionnaire Data Section */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-center mb-4">
           <h2 className="text-xl font-semibold">תשובות שאלון</h2>
           <Link href="/questionnaire" passHref>
              <Button variant="outline" size="sm">ערוך שאלון</Button>
           </Link>
        </div>
        {loadingQuestionnaire && <p>טוען נתוני שאלון...</p>}
        {errorQuestionnaire && <p className="text-red-600">{errorQuestionnaire}</p>}
        {questionnaireData ? (
          <div className="space-y-3 text-sm">
            {Object.entries(questionnaireData).map(([key, value]) => {
              // Skip empty values or file objects for cleaner display
              if (value === null || value === '' || (typeof value === 'object' && !(value instanceof Array) && value !== null)) return null;

              let displayValue: string | JSX.Element;

              if (key === 'profession' && typeof value === 'string') {
                 displayValue = professionValueMap[value] || value; // Translate profession value
              } else if (key === 'idealClient' && Array.isArray(value)) {
                 displayValue = value
                   .map(val => idealClientValueMap[val] || val) // Translate each ideal client value
                   .join(', ');
              } else if (Array.isArray(value)) {
                 displayValue = value.join(', '); // Default join for other arrays
              } else if (typeof value === 'boolean') {
                 displayValue = value ? 'כן' : 'לא';
              } else {
                 displayValue = String(value) || '-'; // Default string conversion
              }

              return (
                <div key={key} className="flex flex-col sm:flex-row border-b pb-2 last:border-b-0">
                  <span className="font-medium w-full sm:w-40 text-gray-600 mb-1 sm:mb-0">
                    {formatKey(key)}:
                  </span>
                  <span className="text-gray-800 flex-1 break-words">
                    {displayValue}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          !loadingQuestionnaire && !errorQuestionnaire && (
             <p className="text-gray-500">לא נמצאו נתוני שאלון. <Link href="/questionnaire" className="text-blue-600 hover:underline">מלא את השאלון</Link></p>
          )
        )}
      </div>
    </div>
  );
} 