'use client'

import { useState, Suspense } from 'react'
// Remove direct supabase client import if no longer needed here
// import { supabase } from '@/lib/supabaseClient' 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signInAction } from '@/app/actions/authActions' // Import the Server Action

export default function Signin() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SigninContent />
    </Suspense>
  );
}

function SigninContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo')

  const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Create FormData from the form event
    const formData = new FormData(e.currentTarget);

    try {
      console.log("[Signin Page] Calling signInAction Server Action...");
      const result = await signInAction(formData); // Call the Server Action

      if (result.error) {
        console.error("[Signin Page] Server Action returned error:", result.error);
        setMessage(result.error);
        setLoading(false);
        return;
      }

      console.log("[Signin Page] Server Action successful.");

      // If Server Action is successful, the cookie should be set.
      // Now navigate the client.
      const targetPath = redirectTo || '/dashboard'; 
      console.log(`[Signin Page] Pushing to ${targetPath}...`);
      router.push(targetPath);
      // router.refresh(); // Optional: uncomment if you want to force a refresh after push

      // Keep loading until navigation (potentially) completes
      // setLoading(false); 

    } catch (catchError: any) {
      // This catch block might not be necessary if the server action handles its errors
      // but kept for safety.
      console.error("[Signin Page] Error calling Server Action:", catchError);
      setMessage(`An unexpected error occurred: ${catchError?.message || 'Unknown error'}`);
      setLoading(false);
    }
  }

  return (
    <div dir="rtl" className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">התחברות</CardTitle>
          <CardDescription>
            {message ? (
              <span className="text-red-500">{message}</span>
            ) : (
              "הכנס אימייל וסיסמה כדי להתחבר לחשבונך."
            )}
          </CardDescription>
        </CardHeader>
        
        {/* Pass the event to handleSignin */}
        <form onSubmit={handleSignin}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2 text-right">
              <Label htmlFor="email">אימייל</Label>
              <Input
                id="email"
                name="email" // Ensure name attribute is set for FormData
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
                name="password" // Ensure name attribute is set for FormData
                type="password"
                required
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                disabled={loading}
              />
            </div>
            {/* Removed explicit message display here as it's in CardDescription now */}
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
             <Button type="submit" className="w-full" disabled={loading}>
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
      </Card>
    </div>
  )
} 