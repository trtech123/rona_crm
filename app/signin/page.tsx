'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'

export default function Signin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [signInSuccess, setSignInSuccess] = useState(false)

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)
    setSignInSuccess(false)
    console.log("[Signin Page] handleSignin started..."); 

    try {
      console.log("[Signin Page] Calling signInWithPassword..."); 
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      console.log("[Signin Page] signInWithPassword completed."); 

      if (error) {
        console.error("[Signin Page] Sign in error object:", error); 
        setMessage(`התחברות נכשלה: ${error.message}`)
        setLoading(false) 
        return
      }

      // Success! Show success message
      console.log("[Signin Page] Sign in successful!"); 
      setMessage("התחברות הצליחה!");
      setSignInSuccess(true);
      
      // Check user's profile directly here to decide where to redirect
      try {
        // Get the session we just created
        const session = data.session;
        if (!session) {
          console.error("[Signin Page] No session after successful login");
          setMessage("התחברות הצליחה, אך לא נוצר סשן. נסה שוב.");
          setLoading(false);
          return;
        }
        
        console.log("[Signin Page] Checking profile for user:", session.user.id);
        
        // Check profile for questionnaire status
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("questionnaire_completed")
          .eq("id", session.user.id)
          .single();
          
        if (profileError && profileError.code !== "PGRST116") {
          console.error("[Signin Page] Error fetching profile:", profileError);
        }
        
        console.log("[Signin Page] Profile data:", profile);
        
        // Wait a moment to ensure UI updates
        setTimeout(() => {
          // Direct navigation based on profile data
          if (profile?.questionnaire_completed) {
            console.log("[Signin Page] User has completed questionnaire, redirecting to dashboard");
            window.location.href = '/dashboard';
          } else {
            console.log("[Signin Page] User needs to complete questionnaire");
            window.location.href = '/questionnaire';
          }
        }, 1000);
        
      } catch (profileError) {
        console.error("[Signin Page] Error checking profile:", profileError);
        // If we can't check the profile, just go to dashboard as fallback
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      }

    } catch (catchError: any) {
        console.error("[Signin Page] Unexpected error in handleSignin:", catchError);
        setMessage(`שגיאה לא צפויה: ${catchError?.message || 'Unknown error'}`);
        setLoading(false); 
    } 
  };

  return (
    <div dir="rtl" className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">התחברות</CardTitle>
          {!signInSuccess && (
             <CardDescription>
               הכנס אימייל וסיסמה כדי להתחבר לחשבונך.
             </CardDescription>
          )}
        </CardHeader>
        
        {signInSuccess ? (
          <CardContent className="text-center py-8">
            <p className="text-green-600 mb-4">התחברות בוצעה בהצלחה! מעביר...</p>
            {/* Loading spinner */}
            <div className="mt-6 h-2 w-32 mx-auto bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-purple-600 animate-pulse"></div>
            </div>
          </CardContent>
        ) : (
          <form onSubmit={handleSignin}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2 text-right">
                <Label htmlFor="email">אימייל</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2 text-right">
                <Label htmlFor="password">סיסמה</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  disabled={loading}
                />
              </div>
              {message && (
                  <p className="text-sm text-center text-red-500" aria-live="polite">
                      {message}
                  </p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col items-center space-y-2">
               <Button type="submit" className="w-full" disabled={loading || signInSuccess}>
                   {loading ? 'מתחבר...' : 'התחבר'}
               </Button>
              <div className="text-sm">
                אין לך חשבון?{' '}
                <Link href="/signup" className="underline text-blue-600 hover:text-blue-800">
                  הרשם כאן
                </Link>
              </div>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
} 