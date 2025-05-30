"use client";

import React, { useTransition } from 'react';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Loader2, Send, Facebook, Link as LinkIcon } from 'lucide-react';
import { deletePostAction, publishToMakeAction } from '@/app/actions/postActions';
import type { PostDisplayData } from '@/types/post'; // Import from types file
import { toast } from 'sonner';

interface PostListRowProps {
  post: PostDisplayData;
  // Add callback prop for viewing post details
  onViewPost: (post: PostDisplayData) => void;
}

export function PostListRow({ post, onViewPost }: PostListRowProps) {
  const [isPending, startTransition] = useTransition();
  const [isPublishing, setIsPublishing] = React.useState(false);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      startTransition(() => {
        deletePostAction(post.id).catch(err => {
          console.error("Delete action failed:", err);
        });
      });
    }
  };

  const handleViewClick = () => {
    onViewPost(post);
  };

  const handlePublish = async () => {
    if (post.published) {
      toast.info('This post is already published');
      return;
    }

    setIsPublishing(true);
    try {
      const result = await publishToMakeAction(post.id);
      if (result.success) {
        toast.success('Post sent to Make.com for publishing to Facebook');
      } else {
        toast.error(result.message || 'Failed to publish post');
      }
    } catch (error) {
      console.error('Error publishing post:', error);
      toast.error('An error occurred while publishing the post');
    } finally {
      setIsPublishing(false);
    }
  };

  console.log("Post Data:", post);

  return (
    <tr className="hover:bg-gray-50 border-b last:border-b-0 text-sm">
        {/* Make content cell clickable */}
        <td className="px-3 py-2 whitespace-nowrap cursor-pointer" onClick={handleViewClick}>
             <div className="flex items-center gap-2">
                 {post.icon && <post.icon className="h-4 w-4" style={{color: post.platformColor}} title={post.platform}/>}
                 <span className="font-medium text-gray-800 truncate" title={post.content}>
                     {post.content?.substring(0, 50) + (post.content?.length > 50 ? '...' : '')}
                 </span>
             </div>
        </td>
         <td className="px-3 py-2">
             {post.platform ? (
                <Badge variant="secondary" className="text-xs" style={{ backgroundColor: `${post.platformColor}20`, color: post.platformColor }}>
                    {post.platform}
                </Badge>
             ) : '-'}
         </td>
         <td className="px-3 py-2 text-gray-600">{new Date(post.created_at).toLocaleDateString('he-IL')}</td>
         <td className="px-3 py-2 text-gray-600">{post.updated_at ? new Date(post.updated_at).toLocaleDateString('he-IL') : '-'}</td>
         <td className="px-3 py-2 text-right">
             <div className="flex justify-end items-center gap-1">
                  {/* Conditionally render Facebook publish button (assuming existing logic is for FB) */}
                  {post.platform?.toLowerCase() === 'facebook' && (
                    <Button
                        size="icon"
                        variant="ghost"
                        className={`h-6 w-6 rounded ${post.published ? 'bg-green-100' : 'hover:bg-green-100'}`}
                        title={post.published ? "מפורסם בפייסבוק" : "פרסום בפייסבוק"}
                        onClick={handlePublish}
                        disabled={isPublishing || post.published}
                    >
                        {isPublishing ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-green-600" />
                        ) : (
                          <Facebook className={`h-3.5 w-3.5 ${post.published ? 'text-green-600' : 'text-green-600'}`} />
                        )}
                    </Button>
                  )}
                  {/* View Original Post Link */}
                  {post.original_post_url && (
                     <Button asChild size="icon" variant="ghost" className="h-6 w-6 rounded hover:bg-gray-100" title="צפה בפוסט המקורי">
                         <a href={post.original_post_url} target="_blank" rel="noopener noreferrer">
                             <LinkIcon className="h-3.5 w-3.5 text-gray-600" />
                         </a>
                     </Button>
                  )}
                  <Link href={`/posts/${post.id}/edit`} passHref>
                     <Button size="icon" variant="ghost" className="h-6 w-6 rounded hover:bg-blue-100" title="עריכה"><Edit className="h-3.5 w-3.5 text-blue-600" /></Button>
                  </Link>
                  <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 rounded hover:bg-red-100"
                      title="מחיקה"
                      onClick={handleDelete}
                      disabled={isPending}
                  >
                      {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin text-red-600"/> : <Trash className="h-3.5 w-3.5 text-red-600" />}
                  </Button>
             </div>
         </td>
    </tr>
  );
} 