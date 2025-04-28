"use client";

import React, { useTransition } from 'react';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Loader2, Send, ExternalLink } from 'lucide-react';
import { deletePostAction, publishToAyrshareAction } from '@/app/actions/postActions';
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
      toast.info('This post is already published to Facebook');
      return;
    }

    setIsPublishing(true);
    try {
      const result = await publishToAyrshareAction(post.id);
      if (result.success) {
        toast.success('Post published to Facebook successfully');
      } else {
        toast.error(result.message || 'Failed to publish post to Facebook');
      }
    } catch (error) {
      console.error('Error publishing post:', error);
      toast.error('An error occurred while publishing the post to Facebook');
    } finally {
      setIsPublishing(false);
    }
  };

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
                  {post.published && post.facebook_post_url ? (
                    <a 
                      href={post.facebook_post_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="h-6 w-6 rounded bg-blue-100 flex items-center justify-center hover:bg-blue-200"
                      title="צפה בפוסט בפייסבוק"
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-blue-600" />
                    </a>
                  ) : (
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 rounded hover:bg-green-100"
                        title="פרסום בפייסבוק"
                        onClick={handlePublish}
                        disabled={isPublishing}
                    >
                        {isPublishing ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-green-600" />
                        ) : (
                          <Send className="h-3.5 w-3.5 text-green-600" />
                        )}
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