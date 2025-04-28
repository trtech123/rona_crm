'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, MessageSquare, Send, Trash } from 'lucide-react';
import { createCommentAction, deleteCommentAction } from '@/app/actions/commentActions';
import { Comment } from '@/types/comment';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

interface PostCommentsProps {
  postId: string;
}

export function PostComments({ postId }: PostCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Fetch comments for the post
  useEffect(() => {
    async function fetchComments() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('comments')
          .select('*')
          .eq('post_id', postId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching comments:', error);
          toast.error('Failed to load comments');
          return;
        }

        setComments(data || []);
      } catch (error) {
        console.error('Error in fetchComments:', error);
        toast.error('An error occurred while loading comments');
      } finally {
        setIsLoading(false);
      }
    }

    fetchComments();

    // Set up real-time subscription for comments
    const commentsSubscription = supabase
      .channel('comments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setComments((prev) => [payload.new as Comment, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setComments((prev) => prev.filter((comment) => comment.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setComments((prev) =>
              prev.map((comment) =>
                comment.id === payload.new.id ? (payload.new as Comment) : comment
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      commentsSubscription.unsubscribe();
    };
  }, [postId]);

  // Handle submitting a new comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const result = await createCommentAction({
        post_id: postId,
        content: newComment,
      });

      if (!result.success) {
        toast.error(result.message || 'Failed to add comment');
        return;
      }

      // Clear the input field
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error in handleSubmitComment:', error);
      toast.error('An error occurred while adding the comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting a comment
  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      setIsDeleting(commentId);
      
      const result = await deleteCommentAction(commentId);

      if (!result.success) {
        toast.error(result.message || 'Failed to delete comment');
        return;
      }

      toast.success('Comment deleted successfully');
    } catch (error) {
      console.error('Error in handleDeleteComment:', error);
      toast.error('An error occurred while deleting the comment');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          <span>תגובות</span>
          <span className="text-xs text-gray-500">({comments.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Comment form */}
        <form onSubmit={handleSubmitComment} className="mb-4">
          <div className="flex gap-2">
            <Textarea
              placeholder="הוסף תגובה..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px]"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isSubmitting || !newComment.trim()}
              className="self-end"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>

        {/* Comments list */}
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-sm">
            אין תגובות עדיין. היה הראשון להגיב!
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border rounded-md p-3">
                <div className="flex justify-between items-start">
                  <div className="text-sm">{comment.content}</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteComment(comment.id)}
                    disabled={isDeleting === comment.id}
                  >
                    {isDeleting === comment.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(comment.created_at).toLocaleString('he-IL')}
                  {comment.source && (
                    <span className="ml-2">מקור: {comment.source}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 