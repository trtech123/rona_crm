"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { supabase } from '@/lib/supabase/client';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // This automatically sends a confirmation email
          // You might want to set up an email redirect URL in Supabase settings
          // emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        setError(error.message);
      } else if (data.user && data.user.identities && data.user.identities.length === 0) {
        // Handle case where user might already exist but is unconfirmed
        setError("User already exists but is unconfirmed. Please check your email for verification link or try logging in.");
      } else if (data.session) {
        // User is signed up and logged in (if email confirmation is disabled)
         setMessage('Signup successful! Redirecting...');
         router.push('/dashboard');
      } else if (data.user) {
        // User is signed up but needs email confirmation (default Supabase behavior)
        setMessage('Signup successful! Please check your email to verify your account.');
         // Optionally clear the form or redirect to a confirmation pending page
         setEmail('');
         setPassword('');
         setConfirmPassword('');
      } else {
          setError('An unexpected issue occurred during signup.');
      }
    } catch (err: any) {
        console.error("Signup Error:", err);
        setError(err.message || 'An unexpected error occurred during signup.');
    } finally {
        setLoading(false);
    }

  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#E6E0FF] flex items-center justify-center p-4 font-sans">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
           <div className="flex justify-center items-center mb-4">
             <svg className="h-8 w-8 text-[#111827]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
               <path strokeLinecap="round" strokeLinejoin="round" d="M3 15l5-7 4 4 6-8 4 5" />
             </svg>
             <span className="text-2xl font-bold text-[#111827] mr-2">hoogi</span>
          </div>
          <CardTitle className="text-2xl font-bold">הרשמה</CardTitle>
          <CardDescription>צור חשבון חדש</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2 text-right">
              <Label htmlFor="email">אימייל</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2 text-right">
              <Label htmlFor="password">סיסמה</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
             <div className="space-y-2 text-right">
              <Label htmlFor="confirm-password">אימות סיסמה</Label>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {message && <p className="text-green-500 text-sm text-center">{message}</p>}
            <Button
              type="submit"
              className="w-full bg-lime-300 hover:bg-lime-400 text-black font-bold"
              disabled={loading}
            >
              {loading ? 'יוצר חשבון...' : <> <UserPlus className="ml-2 h-4 w-4" /> הרשמה </>}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm space-y-2">
          <p>
            כבר יש לך חשבון?{' '}
            <Link href="/login" className="underline text-blue-600 hover:text-blue-800">
              התחבר כאן
            </Link>
          </p>
           <div className="mt-4 text-center text-gray-500 text-xs">
                © {new Date().getFullYear()} hoogi. כל הזכויות שמורות.<br />
                <span className="text-xs">מבית היוצר של ai-4biz</span>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
} 