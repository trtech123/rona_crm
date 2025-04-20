"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { supabase } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setError(error.message);
      } else {
        setMessage('Login successful! Redirecting...');
        router.push('/questionnaire');
      }
    } catch (err: any) {
       console.error("Login Error:", err);
       setError(err.message || 'An unexpected error occurred during login.');
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
          <CardTitle className="text-2xl font-bold">התחברות</CardTitle>
          <CardDescription>הזן את פרטי ההתחברות שלך</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {message && <p className="text-green-500 text-sm text-center">{message}</p>}
            <Button
              type="submit"
              className="w-full bg-lime-300 hover:bg-lime-400 text-black font-bold"
              disabled={loading}
            >
              {loading ? 'מתחבר...' : <> <LogIn className="ml-2 h-4 w-4" /> התחברות </>}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm space-y-2">
          <p>
            אין לך חשבון?{' '}
            <Link href="/signup" className="underline text-blue-600 hover:text-blue-800">
              הירשם כאן
            </Link>
          </p>
          <Link href="/forgot-password" className="underline text-gray-600 hover:text-gray-800">
            שכחת סיסמה?
          </Link>
           <div className="mt-4 text-center text-gray-500 text-xs">
                © {new Date().getFullYear()} hoogi. כל הזכויות שמורות.<br />
                <span className="text-xs">מבית היוצר של ai-4biz</span>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
} 