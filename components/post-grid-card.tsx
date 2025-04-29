"use client";

import React, { useTransition } from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Loader2, Link as LinkIcon } from 'lucide-react';
import { deletePostAction } from '@/app/actions/postActions';
import type { PostDisplayData } from '@/types/post';

interface PostGridCardProps {
  post: PostDisplayData;
}

export function PostGridCard({ post }: PostGridCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      startTransition(() => {
        deletePostAction(post.id).catch(err => {
          // Optional: Handle potential errors from the action if it doesn't redirect on error
          console.error("Delete action failed:", err);
          // Maybe show a toast notification
        });
        // The server action handles revalidation and redirection
      });
    }
  };

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow duration-200 ease-in-out border rounded-lg border-l-4`}
          style={{ borderLeftColor: post.platformColor }}
    >
        <CardContent className="p-3 space-y-2">
            <div className="flex justify-between items-start">
                <h3 className="font-semibold text-sm text-gray-800 mb-1 line-clamp-2" title={post.content?.substring(0, 100)}>
                    {post.content?.split(' ').slice(0, 10).join(' ') + (post.content?.split(' ').length > 10 ? '...' : '')}
                </h3>
                {post.icon && <post.icon className="h-4 w-4 text-gray-400 flex-shrink-0" title={post.platform}/>}
             </div>

             <p className="text-xs text-gray-600 line-clamp-3">
                {post.content?.substring(0, 150) + (post.content?.length > 150 ? '...' : '') || 'No content available'}
             </p>

             <div className="flex items-center justify-between pt-1 text-xs text-gray-500">
                 {post.platform && (
                    <Badge variant="secondary" className="py-0.5 px-1.5" style={{ backgroundColor: `${post.platformColor}20`, color: post.platformColor }}>
                         {post.platform}
                     </Badge>
                 )}
                 <span>{new Date(post.created_at).toLocaleDateString('he-IL')}</span>
             </div>

             <div className="flex justify-end gap-1 pt-2">
                 {post.original_url && (
                     <Button asChild size="icon" variant="ghost" className="h-7 w-7 rounded-full hover:bg-gray-100" title="צפה בפוסט המקורי">
                         <a href={post.original_url} target="_blank" rel="noopener noreferrer">
                             <LinkIcon className="h-4 w-4 text-gray-600" />
                         </a>
                     </Button>
                 )}
                 <Link href={`/posts/${post.id}/edit`} passHref>
                     <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full hover:bg-blue-100" title="עריכה">
                         <Edit className="h-4 w-4 text-blue-600" />
                     </Button>
                 </Link>
                 <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 rounded-full hover:bg-red-100"
                    title="מחיקה"
                    onClick={handleDelete}
                    disabled={isPending}
                 >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin text-red-600"/> : <Trash className="h-4 w-4 text-red-600" />}
                 </Button>
             </div>
         </CardContent>
     </Card>
  );
} 