'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

export default function Signin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo')

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setMessage(error.message)
        setLoading(false)
        return
      }

      console.log("[Signin Page] Sign in successful, session:", data.session)

      // If there's a specific redirect path, use it
      if (redirectTo) {
        console.log("[Signin Page] Redirecting to:", redirectTo)
        // Use router.push instead of window.location for better navigation
        router.push(redirectTo)
        return
      }

      // Check profile for questionnaire status
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error("No user found after successful signin")
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("questionnaire_completed")
        .eq("id", user.id)
        .single()

      // Use router.push instead of window.location for better navigation
      if (profile?.questionnaire_completed) {
        console.log("[Signin Page] User has completed questionnaire, redirecting to dashboard")
        router.push('/dashboard')
      } else {
        console.log("[Signin Page] User needs to complete questionnaire")
        router.push('/questionnaire')
      }

    } catch (catchError: any) {
      console.error("[Signin Page] Unexpected error in handleSignin:", catchError)
      setMessage(`שגיאה לא צפויה: ${catchError?.message || 'Unknown error'}`)
      setLoading(false)
    }
  }

  return (
    <div dir="rtl" className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">התחברות</CardTitle>
          {message && (
             <CardDescription>
               הכנס אימייל וסיסמה כדי להתחבר לחשבונך.
             </CardDescription>
          )}
        </CardHeader>
        
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