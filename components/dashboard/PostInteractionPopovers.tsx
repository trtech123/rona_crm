"use client"

import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabaseClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExternalLink, MessageSquare, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

interface PopoverContentProps {
  postId: number;
  postTitle: string;
}

// Placeholder Interface for Leads (Adapt based on actual schema)
interface Lead {
  id: string;
  created_at: string;
  name: string;
  email?: string;
  phone?: string;
  status: string; // e.g., 'New', 'Contacted', 'Converted'
  avatar_url?: string;
}

// Placeholder Interface for Comments (Adapt based on actual schema)
interface Comment {
  id: string;
  created_at: string;
  author_name: string;
  content: string;
  avatar_url?: string;
}

// Placeholder implementation for Leads Popover
export const LeadsPopoverContent = ({ postId, postTitle }: PopoverContentProps) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      setError(null);
      // --- TODO: Implement actual Supabase fetch for leads related to postId ---
      // Example (replace with actual logic):
      // const { data, error: dbError } = await supabase
      //   .from('leads')
      //   .select('*')
      //   .eq('post_id', postId)
      //   .limit(5); // Limit results for popover

      // Simulating fetch delay and fake data
      await new Promise(resolve => setTimeout(resolve, 1000));
      const fakeLeads: Lead[] = [
        { id: '1', created_at: new Date().toISOString(), name: 'ישראל ישראלי', email: 'israel@example.com', status: 'New', avatar_url: 'https://api.dicebear.com/6.x/initials/svg?seed=Israel' },
        { id: '2', created_at: new Date().toISOString(), name: 'רונה כהן', phone: '050-1234567', status: 'Contacted', avatar_url: 'https://api.dicebear.com/6.x/initials/svg?seed=Rona' },
      ];
      setLeads(fakeLeads);
      // if (dbError) { setError(dbError.message); }
      // else { setLeads(data || []); }
      // --- End TODO ---
      setLoading(false);
    };

    fetchLeads();
  }, [postId]);

  return (
    <Card className="border-0 shadow-none rounded-none" dir="rtl">
      <CardHeader className="p-3 border-b bg-gray-50">
        <CardTitle className="text-sm font-semibold">לידים עבור: "{postTitle}"</CardTitle>
      </CardHeader>
      <CardContent className="p-3 max-h-60 overflow-y-auto">
        {loading && <p className="text-xs text-gray-500">טוען לידים...</p>}
        {error && <p className="text-xs text-red-500">שגיאה: {error}</p>}
        {!loading && !error && (
          leads.length === 0 ? (
            <p className="text-xs text-gray-500">אין לידים להצגה.</p>
          ) : (
            <ul className="space-y-2">
              {leads.map(lead => (
                <li key={lead.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={lead.avatar_url} alt={lead.name} />
                      <AvatarFallback className="text-[10px]">{lead.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-gray-700">{lead.name}</span>
                    <span className="text-gray-400">({lead.status})</span>
                  </div>
                   {/* Add action/link to lead details */}
                   <Button variant="ghost" size="icon" className="h-5 w-5 text-blue-600 hover:bg-blue-100">
                      <ExternalLink className="h-3 w-3" />
                   </Button>
                </li>
              ))}
            </ul>
          )
        )}
      </CardContent>
       {/* Optional Footer Link */}
      {/* <CardFooter className="p-2 border-t">
        <Button variant="link" size="sm" className="text-xs w-full justify-center">הצג את כל הלידים</Button>
      </CardFooter> */}
    </Card>
  );
};

// Placeholder implementation for Comments Popover
export const CommentsPopoverContent = ({ postId, postTitle }: PopoverContentProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError(null);
      // --- TODO: Implement actual Supabase fetch for comments related to postId ---
      // Example (replace with actual logic):
      // const { data, error: dbError } = await supabase
      //   .from('comments') // Assuming a 'comments' table
      //   .select('*')
      //   .eq('post_id', postId)
      //   .order('created_at', { ascending: false })
      //   .limit(3); // Limit results for popover

       // Simulating fetch delay and fake data
       await new Promise(resolve => setTimeout(resolve, 800));
       const fakeComments: Comment[] = [
         { id: 'c1', created_at: new Date().toISOString(), author_name: 'דניאל', content: 'פוסט מעולה!', avatar_url: 'https://api.dicebear.com/6.x/initials/svg?seed=Daniel' },
         { id: 'c2', created_at: new Date().toISOString(), author_name: 'שרה', content: 'מסכים, תודה רבה.', avatar_url: 'https://api.dicebear.com/6.x/initials/svg?seed=Sarah' },
       ];
       setComments(fakeComments);
      // if (dbError) { setError(dbError.message); }
      // else { setComments(data || []); }
      // --- End TODO ---
      setLoading(false);
    };

    fetchComments();
  }, [postId]);

  return (
    <Card className="border-0 shadow-none rounded-none" dir="rtl">
      <CardHeader className="p-3 border-b bg-gray-50">
        <CardTitle className="text-sm font-semibold">תגובות עבור: "{postTitle}"</CardTitle>
      </CardHeader>
      <CardContent className="p-3 max-h-60 overflow-y-auto">
        {loading && <p className="text-xs text-gray-500">טוען תגובות...</p>}
        {error && <p className="text-xs text-red-500">שגיאה: {error}</p>}
        {!loading && !error && (
          comments.length === 0 ? (
            <p className="text-xs text-gray-500">אין תגובות להצגה.</p>
          ) : (
            <ul className="space-y-3">
              {comments.map(comment => (
                <li key={comment.id} className="flex items-start gap-2 text-xs">
                  <Avatar className="h-5 w-5 mt-0.5">
                    <AvatarImage src={comment.avatar_url} alt={comment.author_name} />
                    <AvatarFallback className="text-[10px]">{comment.author_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-800">{comment.author_name}</p>
                    <p className="text-gray-600">{comment.content}</p>
                    <p className="text-gray-400 text-[10px] mt-0.5">{new Date(comment.created_at).toLocaleTimeString('he-IL', { hour: '2-digit', minute:'2-digit' })}</p>
                  </div>
                </li>
              ))}
            </ul>
          )
        )}
      </CardContent>
      {/* Optional Footer Link */}
      {/* <CardFooter className="p-2 border-t">
        <Button variant="link" size="sm" className="text-xs w-full justify-center">הצג את כל התגובות</Button>
      </CardFooter> */}
    </Card>
  );
}; 