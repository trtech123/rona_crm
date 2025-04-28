import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Facebook, Instagram, Linkedin, Twitter, Globe } from 'lucide-react';
import type { PostDisplayData } from '@/types/post';

interface PostPublishStatusProps {
  post: PostDisplayData;
}

export function PostPublishStatus({ post }: PostPublishStatusProps) {
  // Map platform names to icons
  const platformIcons: Record<string, React.ElementType> = {
    facebook: Facebook,
    instagram: Instagram,
    linkedin: Linkedin,
    twitter: Twitter,
    general: Globe,
  };

  // Get the appropriate icon for the platform
  const PlatformIcon = post.platform ? 
    (platformIcons[post.platform.toLowerCase()] || Globe) : 
    Globe;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">סטטוס פרסום</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Publishing Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PlatformIcon className="h-4 w-4" style={{ color: post.platformColor }} />
              <span className="text-sm font-medium">{post.platform || 'כללי'}</span>
            </div>
            {post.published ? (
              <Badge className="bg-green-100 text-green-800">מפורסם</Badge>
            ) : (
              <Badge variant="outline" className="text-gray-500">לא מפורסם</Badge>
            )}
          </div>

          {/* Publishing Date */}
          {post.published_at && (
            <div className="text-xs text-gray-500">
              <span>תאריך פרסום: </span>
              <span>{new Date(post.published_at).toLocaleDateString('he-IL')}</span>
            </div>
          )}

          {/* Make.com Integration Note */}
          <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded">
            <p>פרסום מתבצע באמצעות Make.com. לאחר לחיצה על כפתור הפרסום, התוכן יישלח ל-Make.com ויפורסם בפייסבוק.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 