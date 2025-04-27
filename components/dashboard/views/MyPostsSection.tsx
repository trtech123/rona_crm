"use client";

import React from 'react';
import { Post } from '@/app/(protected)/posts/page'; // Assuming Post type is exported from there, adjust path if needed
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { 
    Users, 
    MessageSquare, 
    Edit, 
    Trash, 
    Link as LinkIcon, // Use alias for Link icon
    Filter 
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge"; // Import Badge for status
import Link from 'next/link'; // Make sure Link is imported

interface MyPostsSectionProps {
    posts: Post[];
}

const MyPostsSection: React.FC<MyPostsSectionProps> = ({ posts }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('he-IL', { // Use Hebrew locale for formatting
            year: 'numeric', month: 'long', day: 'numeric' 
        });
    };

    return (
        <Card className="shadow-sm border border-gray-100 rounded-xl">
            <CardHeader className="p-4 md:p-5 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <CardTitle className="text-lg">הפוסטים שלי</CardTitle>
                    <div className="flex items-center gap-2 self-end sm:self-center">
                        <Select defaultValue="date">
                            <SelectTrigger className="w-[140px] h-9 text-xs border-gray-200 rounded-md">
                                <SelectValue placeholder="מיין לפי" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="date">תאריך (חדש לישן)</SelectItem>
                                {/* Add other sort options if needed */}
                                {/* <SelectItem value="success">הצלחה (גבוה לנמוך)</SelectItem> */}
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" className="h-9 text-xs border-gray-200 rounded-md">
                            <Filter className="h-3.5 w-3.5 ml-1" /> סינון
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {posts && posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post.id} className="p-4 md:p-5 border-b border-gray-100 last:border-none hover:bg-gray-50/50 transition-colors">
                            {/* Wrap Title/Content Preview with Link */}
                            <Link href={`/posts/${post.id}`} className="block hover:text-purple-700 transition-colors">
                                <div className="flex justify-between items-start mb-1.5 gap-2">
                                    <h4 className="font-semibold text-base text-gray-800 flex-1 truncate">
                                        {post.content?.substring(0, 50) || 'ללא כותרת'}
                                        {post.content?.length > 50 ? '...' : ''}
                                    </h4>
                                    {/* Status Badge */}
                                    <Badge variant="default" className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-0.5">
                                        פעיל
                                    </Badge>
                                </div>
                                <p className="text-sm text-gray-500 mb-3">פורסם: {formatDate(post.created_at)}</p>
                            </Link>
                            
                            {/* Stats & Actions remain below the link */}
                            <div className="flex justify-between items-center mt-2"> {/* Added mt-2 for spacing */}
                                <div className="flex gap-4 text-sm text-gray-600">
                                    {/* Placeholder Stats */}
                                    <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-blue-500"/><span className="font-medium">12</span></span>
                                    <span className="flex items-center gap-1.5"><MessageSquare className="h-4 w-4 text-orange-500"/><span className="font-medium">5</span></span>
                                </div>
                                <div className="flex gap-1">
                                    <TooltipProvider delayDuration={100}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md">
                                                    <LinkIcon className="h-4 w-4" />
                                                    <span className="sr-only">העתק קישור</span>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="top"><p>העתק קישור</p></TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md">
                                                    <Edit className="h-4 w-4" />
                                                    <span className="sr-only">ערוך</span>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="top"><p>ערוך</p></TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md">
                                                    <Trash className="h-4 w-4" />
                                                    <span className="sr-only">מחק</span>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="top"><p>מחק</p></TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-4 md:p-5 text-center text-gray-500">
                        לא נמצאו פוסטים.
                    </div>
                )}
                {/* Keep Load More button as placeholder */}
                 <div className="p-4 border-t border-gray-100">
                     <Button variant="outline" className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 rounded-md h-9 text-sm">טען עוד פוסטים</Button>
                 </div>
            </CardContent>
        </Card>
    );
};

export default MyPostsSection; 