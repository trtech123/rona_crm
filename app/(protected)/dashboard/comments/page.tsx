"use client"

import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
    ArrowLeft, ChevronDown, ChevronUp, Plus, Edit, Trash, Eye, Filter, Search, X, MessageSquare, User, Link as LinkIcon, ThumbsUp
} from "lucide-react"; // Adjusted icons for comments
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteCommentAction } from '@/app/actions/commentActions';
import { Comment } from '@/types/comment';
// import { DetailDialog } from "@/components/dashboard/shared/DetailDialog"; // Could be used for detailed view

// Interface for Comment data (Adapt based on actual Supabase 'comments' table)
interface CommentWithPost extends Comment {
    posts?: {
        content: string;
        platform: string;
        // title?: string; // Add if fetched
    };
    // Dynamically added properties
    // statusColor?: string; // Removed - based on non-existent status
    platformIcon?: React.ElementType; // Optional
}

// Adjusted FilterState for Comments
interface FilterState {
    searchTerm: string;
    platform: string;
    // status: string[]; // Removed - status does not exist on Comment type
    sortBy: string;
    sortDirection: 'asc' | 'desc';
}

// Mappings for colors (adjust as needed for comment statuses and platforms)
// const commentStatusStyleMapping: { [key: string]: { color: string } } = { ... }; // Removed

const platformStyleMapping: { [key: string]: { color: string, icon: React.ElementType } } = {
    'פייסבוק': { color: '#3b5998', icon: MessageSquare },
    'אינסטגרם': { color: '#e1306c', icon: MessageSquare },
    'בלוג': { color: '#f39c12', icon: LinkIcon },
    'אחר': { color: '#7f8c8d', icon: MessageSquare },
};


export default function CommentsPage() {
    const [comments, setComments] = useState<CommentWithPost[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list'); // Default to list view for comments
    const [filters, setFilters] = useState<FilterState>({
        searchTerm: '',
        platform: 'all',
        // status: [], // Removed
        sortBy: 'created_at',
        sortDirection: 'desc',
    });
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    // --- Data Fetching ---
    useEffect(() => {
        const fetchComments = async () => {
            setIsLoading(true);
            setError(null);
            try {
                let query = supabase
                    .from('comments')
                    .select('*, posts(content, platform)')
                    .order(filters.sortBy, { ascending: filters.sortDirection === 'asc' });

                if (filters.platform !== 'all') {
                    query = query.eq('posts.platform', filters.platform);
                }

                if (filters.searchTerm) {
                    query = query.ilike('content', `%${filters.searchTerm}%`);
                }

                const { data, error: dbError } = await query;

                if (dbError) {
                    throw new Error(`Comments fetch error: ${dbError.message}`);
                }

                // Add computed styles/icons
                const processedData = data?.map(comment => {
                    // const statusStyle = ...; // Removed
                    const platformStyle = comment.posts?.platform ? (platformStyleMapping[comment.posts.platform] || platformStyleMapping['אחר']) : platformStyleMapping['אחר'];
                    return {
                        ...comment,
                        // statusColor: statusStyle.color, // Removed
                        platformIcon: platformStyle.icon,
                    } as CommentWithPost;
                }) || [];

                setComments(processedData);
            } catch (err: any) {
                console.error("Error fetching comments:", err);
                setError(err.message || "Failed to fetch comments");
            } finally {
                setIsLoading(false);
            }
        };

        fetchComments();

        // Set up real-time subscription for comments
        const commentsSubscription = supabase
            .channel('comments')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'comments'
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setComments((prev) => [payload.new as CommentWithPost, ...prev]);
                    } else if (payload.eventType === 'DELETE') {
                        setComments((prev) => prev.filter((comment) => comment.id !== payload.old.id));
                    } else if (payload.eventType === 'UPDATE') {
                        setComments((prev) =>
                            prev.map((comment) =>
                                comment.id === payload.new.id ? (payload.new as CommentWithPost) : comment
                            )
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            commentsSubscription.unsubscribe();
        };
    }, [filters]);

    // --- Filtering Logic ---
    const filteredComments = useMemo(() => {
        return comments.filter(comment => {
            const searchTermMatch = filters.searchTerm === '' ||
                comment.author_name?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                comment.content?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                comment.posts?.content?.toLowerCase().includes(filters.searchTerm.toLowerCase());

            const platformMatch = filters.platform === 'all' || filters.platform === comment.posts?.platform;

            // const statusMatch = filters.status.length === 0 || filters.status.includes(comment.status); // Removed

            return searchTermMatch && platformMatch; // Removed statusMatch
        });
    }, [comments, filters.searchTerm, filters.platform]); // Removed filters.status dependency

    // --- Event Handlers (Similar to Leads/Posts) ---
    const handleFilterChange = (key: keyof FilterState, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // const handleCheckboxFilterChange = (value: string) => { ... }; // Removed entirely

    const handleSortChange = (newSortBy: string) => {
        setFilters(prev => {
            const newDirection = prev.sortBy === newSortBy && prev.sortDirection === 'desc' ? 'asc' : 'desc';
            return { ...prev, sortBy: newSortBy, sortDirection: newDirection };
        });
    };

    const clearFilters = () => {
        setFilters({
            searchTerm: '',
            platform: 'all',
            // status: [], // Removed
            sortBy: 'created_at',
            sortDirection: 'desc',
        });
    };

    // Adjusted to handle potential nested property
    const getDistinctValues = (key: keyof Comment | 'posts.platform'): string[] => {
        const values = comments.map(comment => {
            if (key === 'posts.platform') {
                return comment.posts?.platform;
            } else if (key in comment) {
                 // Type assertion needed because key is keyof Comment | 'posts.platform'
                 return comment[key as keyof Comment];
            }
            return null;
        }).filter(value => value != null) as string[];
        return Array.from(new Set(values));
    };

    // --- Render Logic ---
    const renderSortIcon = (column: string) => {
        if (filters.sortBy !== column) return null;
        return filters.sortDirection === 'desc' ? <ChevronDown className="h-4 w-4 ml-1" /> : <ChevronUp className="h-4 w-4 ml-1" />;
    };

    // --- Grid View Card (Adapted for Comments) ---
    const CommentGridCard = ({ comment }: { comment: CommentWithPost }) => (
        <Card className={`overflow-hidden hover:shadow-lg transition-shadow duration-200 ease-in-out border rounded-lg`}
              // style={{ borderLeftColor: ... }} // Removed
        >
            <CardContent className="p-3 space-y-2">
                <div className="flex items-start gap-2">
                    <Avatar className="h-8 w-8 border">
                        <AvatarImage src={comment.author_avatar_url} alt={comment.author_name} />
                        <AvatarFallback>{comment.author_name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                             <span className="font-semibold text-sm text-gray-800 truncate" title={comment.author_name}>{comment.author_name}</span>
                             {comment.platformIcon && <comment.platformIcon className="h-4 w-4 text-gray-400 flex-shrink-0" title={comment.posts?.platform}/>}
                        </div>
                        <p className="text-xs text-gray-500 truncate" title={comment.posts?.content}>על פוסט: {comment.posts?.content ? comment.posts.content.substring(0, 50) + '...' : `ID ${comment.post_id}`}</p>
                    </div>
                </div>
                 <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mt-1" title={comment.content}>{comment.content}</p>
                 {comment.posts && (
                     <Link href={`/dashboard/articles?view=${comment.post_id}`} className="text-xs text-purple-600 hover:underline truncate block mt-1">
                         קשור לפוסט
                     </Link>
                 )}
                 <p className="text-xs text-gray-400 mt-2">{new Date(comment.created_at).toLocaleString('he-IL')}</p>
                  <div className="flex justify-end mt-2 gap-1">
                     {/* Add View/Approve actions if needed */}
                     <Button 
                         variant="ghost" 
                         size="sm" 
                         className="text-red-600 hover:text-red-800 disabled:opacity-50 h-7 px-2"
                         onClick={() => handleDeleteComment(comment.id)}
                         disabled={isDeleting === comment.id}
                         title="מחק תגובה"
                     >
                         {isDeleting === comment.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
                     </Button>
                 </div>
            </CardContent>
        </Card>
    );

    // --- List View Row (Adapted for Comments) ---
    const CommentListRow = ({ comment }: { comment: CommentWithPost }) => (
        <tr className="hover:bg-gray-50">
             <td className="px-3 py-2 whitespace-nowrap">
                 <div className="flex items-center gap-2">
                     <Avatar className="h-7 w-7 border">
                         <AvatarImage src={comment.author_avatar_url} alt={comment.author_name} />
                         <AvatarFallback>{comment.author_name?.charAt(0) || 'U'}</AvatarFallback>
                     </Avatar>
                     <span className="text-sm font-medium text-gray-800 truncate" title={comment.author_name}>{comment.author_name || 'אלמוני'}</span>
                 </div>
             </td>
             <td className="px-3 py-2 text-sm text-gray-700">
                <p className="truncate max-w-xs" title={comment.content}>{comment.content}</p>
            </td>
             <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                {comment.posts ? (
                    <Link href={`/dashboard/articles?view=${comment.post_id}`} className="text-purple-600 hover:underline truncate block max-w-[150px]" title={comment.posts.content}>
                        {comment.posts.content ? `${comment.posts.content.substring(0, 30)}...` : `ID: ${comment.post_id}`}
                    </Link>
                ) : (
                    '-'
                )}
            </td>
            {/* Status cell removed */}
            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                {comment.posts?.platform || '-'}
            </td>
             <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{new Date(comment.created_at).toLocaleDateString('he-IL')}</td>
             <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{new Date(comment.updated_at).toLocaleDateString('he-IL')}</td>
             <td className="px-3 py-2 whitespace-nowrap text-left text-sm font-medium">
                 <Button 
                     variant="ghost" 
                     size="sm" 
                     className="text-red-600 hover:text-red-800 disabled:opacity-50 h-7 px-2"
                     onClick={() => handleDeleteComment(comment.id)}
                     disabled={isDeleting === comment.id}
                     title="מחק תגובה"
                 >
                     {isDeleting === comment.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
                 </Button>
                 {/* Add other actions like View/Edit if needed */}
             </td>
        </tr>
    );

    // Handle deleting a comment
    const handleDeleteComment = async (commentId: string) => {
        if (!confirm('האם אתה בטוח שברצונך למחוק תגובה זו?')) {
            return;
        }

        try {
            setIsDeleting(commentId);
            
            const result = await deleteCommentAction(commentId);

            if (!result.success) {
                toast.error(result.message || 'Failed to delete comment');
                return;
            }

            toast.success('התגובה נמחקה בהצלחה');
        } catch (error) {
            console.error('Error in handleDeleteComment:', error);
            toast.error('An error occurred while deleting the comment');
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        <span>תגובות</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Filters */}
                    <div className="mb-4 flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <Input
                                placeholder="חיפוש תגובות..."
                                value={filters.searchTerm}
                                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <Select
                            value={filters.platform}
                            onValueChange={(value) => handleFilterChange('platform', value)}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="פלטפורמה" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">כל הפלטפורמות</SelectItem>
                                {/* Use 'posts.platform' for distinct values */}
                                {getDistinctValues('posts.platform').map(platform => (
                                    <SelectItem key={platform} value={platform}>
                                        {platform}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={filters.sortBy}
                            onValueChange={(value) => handleSortChange(value)}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="מיין לפי" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="created_at">תאריך יצירה</SelectItem>
                                <SelectItem value="content">תוכן</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            onClick={() => handleSortChange(filters.sortBy)}
                        >
                            {filters.sortDirection === 'asc' ? '↑' : '↓'}
                        </Button>
                    </div>

                    {/* Loading and Error States */}
                    {isLoading && (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        </div>
                    )}
                    {error && (
                        <div className="text-red-600 bg-red-50 border border-red-200 rounded p-4 text-center">
                           <p>{error}</p>
                        </div>
                    )}

                    {/* Content Display Area */}
                    {!isLoading && !error && (
                        <>
                            <div className="p-4 md:p-6 space-y-6" dir="rtl">
                                {/* Header */}
                                <div className="flex justify-between items-center">
                                    <h1 className="text-2xl font-bold text-gray-800">ניהול תגובות</h1>
                                    {/* Add Create button? Or are comments only created via posts? */}
                                    <Link href="/dashboard">
                                        <Button variant="outline" className="flex items-center gap-1 text-sm">
                                            <ArrowLeft className="h-4 w-4" />
                                            חזרה לדשבורד
                                        </Button>
                                    </Link>
                                </div>

                                {/* Filters and Search */}
                                <Card className="bg-white shadow-sm border border-gray-100">
                                    <CardContent className="p-3 space-y-3">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    type="text"
                                                    placeholder="חיפוש לפי מחבר, תוכן, פוסט..."
                                                    value={filters.searchTerm}
                                                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                                                    className="pl-10 pr-3 py-2 text-sm border-gray-200 rounded-md focus:border-purple-400 focus:ring-purple-400"
                                                />
                                            </div>

                                            {/* Status Filter Dropdown Removed */}
                                            
                                            {/* Platform Filter Dropdown - Replaced with Select above */}

                                            {/* View Mode Toggle */}
                                            <div className="flex items-center gap-1 border border-gray-200 rounded-md p-0.5">
                                                <Button
                                                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                                                    size="sm"
                                                    onClick={() => setViewMode('grid')}
                                                    className="h-7 px-2"
                                                >
                                                    תצוגת כרטיסיות
                                                </Button>
                                                <Button
                                                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                                                    size="sm"
                                                    onClick={() => setViewMode('list')}
                                                    className="h-7 px-2"
                                                >
                                                    תצוגת רשימה
                                                </Button>
                                            </div>

                                            {/* Clear Filters Button - Moved above */}
                                            {(filters.searchTerm || filters.platform !== 'all') && (
                                                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-500 hover:text-red-700 h-8 px-2">
                                                    <X className="ml-1 h-4 w-4" />
                                                    נקה פילטרים
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            
                                {/* Content Display based on view mode */}
                                {filteredComments.length === 0 ? (
                                    <div className="text-center py-10 text-gray-500">
                                        <p>לא נמצאו תגובות התואמות את הסינון.</p>
                                    </div>
                                ) : viewMode === 'grid' ? (
                                    // Grid View
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {filteredComments.map(comment => <CommentGridCard key={comment.id} comment={comment} />)}
                                    </div>
                                ) : (
                                    // List View
                                    <Card className="overflow-hidden border border-gray-100 shadow-sm">
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                         <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('author_name')}>
                                                             <div className="flex items-center">מחבר {renderSortIcon('author_name')}</div>
                                                         </th>
                                                         <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">תוכן</th>
                                                         <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('post_id')}>
                                                              <div className="flex items-center">פוסט מקושר {renderSortIcon('post_id')}</div>
                                                          </th>
                                                          {/* Status header removed */}
                                                          <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('posts.platform')}>
                                                              <div className="flex items-center">פלטפורמה {renderSortIcon('posts.platform')}</div>
                                                          </th>
                                                          <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('created_at')}>
                                                              <div className="flex items-center">תאריך יצירה {renderSortIcon('created_at')}</div>
                                                          </th>
                                                          <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('updated_at')}>
                                                             <div className="flex items-center">תאריך עדכון {renderSortIcon('updated_at')}</div>
                                                         </th>
                                                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">פעולות</th>
                                                     </tr>
                                                 </thead>
                                                <tbody className="bg-white divide-y divide-gray-100">
                                                    {filteredComments.map(comment => <CommentListRow key={comment.id} comment={comment} />)}
                                                </tbody>
                                            </table>
                                        </div>
                                    </Card>
                                )}
                                {/* TODO: Add Pagination if needed */}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
} 