"use client";

import React, { useState, useTransition } from 'react';
import { Post } from '@/types/post';
import { updatePostAction } from '@/app/actions/postActions';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"; // For loading spinner

interface EditPostFormProps {
  post: Post;
}

export default function EditPostForm({ post }: EditPostFormProps) {
  const [content, setContent] = useState(post.content || '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null); // Clear previous errors

    if (!content.trim()) {
        setErrorMessage("Post content cannot be empty.");
        return;
    }

    startTransition(async () => {
      const result = await updatePostAction(post.id, content);

      if (!result.success) {
        console.error("Error updating post:", result.message);
        setErrorMessage(result.message || "An unknown error occurred.");
        // Note: If updatePostAction uses redirect on success, we won't reach here
        // If it returned success, we could handle UI updates or navigation here.
      }
      // On success, the server action should redirect, so no client-side redirect needed here
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-muted-foreground mb-1">
          Post Content
        </label>
        <Textarea
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Edit your post content here..."
          rows={10} // Adjust rows as needed
          className="w-full bg-background" // Use theme variable
          disabled={isPending}
          required
        />
      </div>

      {errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p> // Use theme variable
      )}

      <Button type="submit" disabled={isPending} className="flex items-center gap-2">
        {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
        ) : (
          'Save Changes'
        )}
      </Button>
    </form>
  );
} 