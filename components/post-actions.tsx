"use client";

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { deletePostAction } from '@/app/actions/postActions'; // Import the server action
import { Post } from '@/types/post'; // Assuming Post type definition exists
import { Clipboard, Trash2, FileEdit, Check } from 'lucide-react'; // Icons

interface PostActionsProps {
  post: Post; // Pass the whole post object for context
}

export function PostActions({ post }: PostActionsProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isPending, startTransition] = useTransition(); // For delete loading state

  // Function to handle copying content
  const handleCopy = async () => {
    if (!post.content) return;
    try {
      await navigator.clipboard.writeText(post.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Maybe show an error state to the user
    }
  };

  // Function to handle deletion confirmation and action
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      startTransition(() => {
        deletePostAction(post.id);
        // The server action handles redirection, no need for client-side redirect here
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {/* Edit Button - Links to a hypothetical edit page */}
      <Link href={`/posts/${post.id}/edit`} passHref>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <FileEdit className="h-4 w-4" />
          Edit
        </Button>
      </Link>

      {/* Copy Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        disabled={isCopied || !post.content}
        className="flex items-center gap-1"
      >
        {isCopied ? (
          <>
            <Check className="h-4 w-4 text-green-500" />
            Copied!
          </>
        ) : (
          <>
            <Clipboard className="h-4 w-4" />
            Copy Content
          </>
        )}
      </Button>

      {/* Delete Button - Uses a form for the Server Action */}
       {/*
         Using a form is technically correct for Server Actions without JS,
         but since we're already in a client component and want confirmation + loading state,
         calling the action directly within `handleDelete` after confirmation is more practical.
         We'll handle loading/disabled state with `useTransition`.
       */}
       <Button
         variant="destructive"
         size="sm"
         onClick={handleDelete}
         disabled={isPending} // Disable button while deleting
         className="flex items-center gap-1"
       >
         <Trash2 className="h-4 w-4" />
         {isPending ? 'Deleting...' : 'Delete'}
       </Button>
    </div>
  );
} 