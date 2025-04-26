"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage(`הרשמה נכשלה: ${error.message}`)
    } else {
      // Check if user exists and needs confirmation, or is already signed up
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setMessage('הרשמה הצליחה! אנא בדוק את האימייל שלך לאישור החשבון.')
      } else if (data.user) {
        setMessage('הרשמה הצליחה! כעת תוכל להתחבר.')
      } else {
         setMessage('תהליך הרשמה החל. בדוק את האימייל להוראות אישור.')
      }
      setEmail('')
      setPassword('')
    }
  }

  return (
    <div dir="rtl" className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">הרשמה</CardTitle>
          <CardDescription>
            הכנס את האימייל שלך למטה ליצירת חשבון.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2 text-right">
              <Label htmlFor="email">אימייל</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2 text-right">
              <Label htmlFor="password">סיסמה</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {message && <p className="text-sm text-center text-red-500">{message}</p>}
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <Button type="submit" className="w-full">הרשם</Button>
            <div className="text-sm">
              כבר יש לך חשבון?{' '}
              <Link href="/signin" className="underline text-blue-600 hover:text-blue-800">
                התחבר כאן
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}