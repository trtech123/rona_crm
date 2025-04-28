"use client"

import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
    ArrowLeft, ChevronDown, ChevronUp, Plus, Edit, Trash, Eye, Filter, Search, X, MessageSquare, User, Link as LinkIcon, ThumbsUp
} from "lucide-react"; // Adjusted icons for comments
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// import { DetailDialog } from "@/components/dashboard/shared/DetailDialog"; // Could be used for detailed view

// Interface for Comment data (Adapt based on actual Supabase 'comments' table)
interface Comment {
    id: number;
    created_at: string;
    post_id?: number; // Link to the related post
    post_title?: string; // Might be joined or fetched separately
    author_id?: string; // User ID if logged in
    author_name: string;
    author_avatar_url?: string;
    content: string;
    status: string; // e.g., 'Approved', 'Pending', 'Spam', 'Replied'
    platform?: string; // e.g., 'Facebook', 'Instagram', 'Blog'
    likes?: number;
    // Helper properties
    statusColor?: string;
    platformColor?: string;
    platformIcon?: React.ElementType;
}

// Adjusted FilterState for Comments
interface FilterState {
    searchTerm: string;
    status: string[];
    platform: string[];
    sortBy: string;
    sortDirection: 'asc' | 'desc';
}

// Mappings for colors (adjust as needed for comment statuses and platforms)
const commentStatusStyleMapping: { [key: string]: { color: string } } = {
    'ממתין לאישור': { color: '#f39c12' }, // Orange
    'מאושר': { color: '#2ecc71' }, // Green
    'ספאם': { color: '#e74c3c' }, // Red
    'נענה': { color: '#3498db' }, // Blue
    'ברירת מחדל': { color: '#bdc3c7' }, // Light Gray
};

const platformStyleMapping: { [key: string]: { color: string, icon: React.ElementType } } = {
    'פייסבוק': { color: '#3b5998', icon: MessageSquare },
    'אינסטגרם': { color: '#e1306c', icon: MessageSquare },
    'בלוג': { color: '#f39c12', icon: LinkIcon },
    'אחר': { color: '#7f8c8d', icon: MessageSquare },
};


export default function CommentsPage() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list'); // Default to list view for comments
    const [filters, setFilters] = useState<FilterState>({
        searchTerm: '',
        status: [],
        platform: [],
        sortBy: 'created_at',
        sortDirection: 'desc',
    });
    const router = useRouter();
    // const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
    // const [isDetailOpen, setIsDetailOpen] = useState(false);

    // --- Data Fetching ---
    useEffect(() => {
        const fetchComments = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // TODO: Adjust select query to join post title if needed
                const { data, error: dbError } = await supabase
                    .from('comments') // Fetch from 'comments' table
                    .select('*') // Might need: '*, posts(title)'
                    .order(filters.sortBy, { ascending: filters.sortDirection === 'asc' });

                if (dbError) {
                    throw new Error(`Comments fetch error: ${dbError.message}`);
                }

                // Add computed styles/icons
                const processedData = data?.map(comment => {
                    const statusStyle = commentStatusStyleMapping[comment.status] || commentStatusStyleMapping['ברירת מחדל'];
                    const platformStyle = platformStyleMapping[comment.platform] || platformStyleMapping['אחר'];
                    return {
                        ...comment,
                        // post_title: comment.posts?.title // If joined
                        statusColor: statusStyle.color,
                        platformColor: platformStyle.color,
                        platformIcon: platformStyle.icon,
                    };
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
    }, [filters.sortBy, filters.sortDirection]); // Re-fetch when sorting changes

    // --- Filtering Logic ---
    const filteredComments = useMemo(() => {
        return comments.filter(comment => {
            const searchTermMatch = filters.searchTerm === '' ||
                comment.author_name?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                comment.content?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                comment.post_title?.toLowerCase().includes(filters.searchTerm.toLowerCase()); // Search in post title too if available

            const statusMatch = filters.status.length === 0 || filters.status.includes(comment.status);
            const platformMatch = filters.platform.length === 0 || filters.platform.includes(comment.platform);

            return searchTermMatch && statusMatch && platformMatch;
        });
    }, [comments, filters.searchTerm, filters.status, filters.platform]);

    // --- Event Handlers (Similar to Leads/Posts) ---
    const handleFilterChange = (key: keyof FilterState, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleCheckboxFilterChange = (key: 'status' | 'platform', value: string) => {
        setFilters(prev => {
            const currentValues = prev[key];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(item => item !== value)
                : [...currentValues, value];
            return { ...prev, [key]: newValues };
        });
    };

    const handleSortChange = (newSortBy: string) => {
        setFilters(prev => {
            const newDirection = prev.sortBy === newSortBy && prev.sortDirection === 'desc' ? 'asc' : 'desc';
            return { ...prev, sortBy: newSortBy, sortDirection: newDirection };
        });
    };

    const clearFilters = () => {
        setFilters({
            searchTerm: '',
            status: [],
            platform: [],
            sortBy: 'created_at',
            sortDirection: 'desc',
        });
    };

    const getDistinctValues = (key: keyof Comment): string[] => {
        return Array.from(new Set(comments.map(comment => comment[key]).filter(value => value != null) as string[]));
    };

    // --- Render Logic ---
    const renderSortIcon = (column: string) => {
        if (filters.sortBy !== column) return null;
        return filters.sortDirection === 'desc' ? <ChevronDown className="h-4 w-4 ml-1" /> : <ChevronUp className="h-4 w-4 ml-1" />;
    };

    // --- Grid View Card (Adapted for Comments) ---
    const CommentGridCard = ({ comment }: { comment: Comment }) => (
        <Card className={`overflow-hidden hover:shadow-lg transition-shadow duration-200 ease-in-out border rounded-lg border-l-4`}
              style={{ borderLeftColor: comment.statusColor }}
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
                             {comment.platformIcon && <comment.platformIcon className="h-4 w-4 text-gray-400 flex-shrink-0" title={comment.platform}/>}
                         </div>
                        <p className="text-xs text-gray-500 truncate" title={comment.post_title}>על פוסט: {comment.post_title || `ID ${comment.post_id}`}</p>
                    </div>
                </div>

                <p className="text-sm text-gray-700 leading-snug max-h-20 overflow-hidden relative group">
                    {comment.content}
                    <span className="absolute bottom-0 right-0 bg-gradient-to-t from-white via-white to-transparent w-full h-5 group-hover:hidden"></span>
                </p>

                <div className="flex items-center justify-between pt-1">
                    <Badge variant="secondary" className="text-xs py-0.5 px-1.5" style={{ backgroundColor: `${comment.statusColor}20`, color: comment.statusColor }}>
                        {comment.status}
                    </Badge>
                    <span className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleDateString('he-IL')}</span>
                </div>

                 {/* Action Buttons */}
                 <div className="flex justify-end gap-1 pt-2">
                    {/* Actions might differ for comments - e.g., Reply, Approve, Mark as Spam */}
                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full hover:bg-blue-100" title="השב">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                    </Button>
                    {comment.status === 'ממתין לאישור' && (
                        <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full hover:bg-green-100" title="אשר">
                            <ThumbsUp className="h-4 w-4 text-green-600" />
                        </Button>
                    )}
                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full hover:bg-red-100" title="מחיקה/סמן כספאם">
                         <Trash className="h-4 w-4 text-red-600" />
                    </Button>
                 </div>
             </CardContent>
         </Card>
     );

     // --- List View Row (Adapted for Comments) ---
     const CommentListRow = ({ comment }: { comment: Comment }) => (
        <tr className="hover:bg-gray-50 border-b last:border-b-0 text-sm">
             <td className="px-3 py-2">
                 <div className="flex items-center gap-2">
                     <Avatar className="h-6 w-6 border">
                         <AvatarImage src={comment.author_avatar_url} alt={comment.author_name} />
                         <AvatarFallback className="text-[10px]">{comment.author_name?.charAt(0) || 'U'}</AvatarFallback>
                     </Avatar>
                     <span className="font-medium text-gray-800 truncate" title={comment.author_name}>{comment.author_name}</span>
                 </div>
             </td>
             <td className="px-3 py-2">
                 <p className="text-gray-700 truncate max-w-xs" title={comment.content}>{comment.content}</p>
             </td>
            <td className="px-3 py-2 text-gray-600 truncate" title={comment.post_title}>{comment.post_title || `פוסט ID ${comment.post_id}`}</td>
             <td className="px-3 py-2">
                  <Badge variant="secondary" className="text-xs" style={{ backgroundColor: `${comment.statusColor}20`, color: comment.statusColor }}>{comment.status}</Badge>
              </td>
              <td className="px-3 py-2 text-gray-600">
                 {comment.platformIcon && <comment.platformIcon className="h-4 w-4 inline-block mr-1" style={{color: comment.platformColor}} title={comment.platform}/>}
                 {comment.platform ?? '-'}
              </td>
              <td className="px-3 py-2 text-gray-600">{new Date(comment.created_at).toLocaleDateString('he-IL')}</td>
              <td className="px-3 py-2 text-right">
                  <div className="flex justify-end items-center gap-1">
                      <Button size="icon" variant="ghost" className="h-6 w-6 rounded hover:bg-blue-100" title="השב"><MessageSquare className="h-3.5 w-3.5 text-blue-600" /></Button>
                      {comment.status === 'ממתין לאישור' && (
                          <Button size="icon" variant="ghost" className="h-6 w-6 rounded hover:bg-green-100" title="אשר"><ThumbsUp className="h-3.5 w-3.5 text-green-600" /></Button>
                      )}
                      <Button size="icon" variant="ghost" className="h-6 w-6 rounded hover:bg-red-100" title="מחק"><Trash className="h-3.5 w-3.5 text-red-600" /></Button>
                  </div>
              </td>
         </tr>
     );

    return (
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

                         {/* Status Filter Dropdown */}
                          <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                                 <Button variant="outline" className="text-sm border-gray-200">
                                     סטטוס {filters.status.length > 0 ? `(${filters.status.length})` : ''}
                                     <ChevronDown className="mr-2 h-4 w-4" />
                                 </Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="start">
                                 {getDistinctValues('status').map((status) => (
                                     <DropdownMenuCheckboxItem
                                         key={status}
                                         checked={filters.status.includes(status)}
                                         onCheckedChange={() => handleCheckboxFilterChange('status', status)}
                                     >
                                         {status}
                                     </DropdownMenuCheckboxItem>
                                 ))}
                             </DropdownMenuContent>
                          </DropdownMenu>

                         {/* Platform Filter Dropdown */}
                          <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                                 <Button variant="outline" className="text-sm border-gray-200">
                                     פלטפורמה {filters.platform.length > 0 ? `(${filters.platform.length})` : ''}
                                     <ChevronDown className="mr-2 h-4 w-4" />
                                 </Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="start">
                                 {getDistinctValues('platform').map((platform) => (
                                     <DropdownMenuCheckboxItem
                                         key={platform}
                                         checked={filters.platform.includes(platform)}
                                         onCheckedChange={() => handleCheckboxFilterChange('platform', platform)}
                                     >
                                         {platform}
                                     </DropdownMenuCheckboxItem>
                                 ))}
                             </DropdownMenuContent>
                          </DropdownMenu>

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

                         {(filters.searchTerm || filters.status.length > 0 || filters.platform.length > 0) && (
                             <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-500 hover:text-red-700 h-8 px-2">
                                 <X className="ml-1 h-4 w-4" />
                                 נקה פילטרים
                             </Button>
                         )}
                    </div>
                </CardContent>
            </Card>

            {/* Loading and Error States */}
            {isLoading && (
                 <div className="flex justify-center items-center py-10">
                     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                     <p className="ml-3 text-purple-700">טוען תגובות...</p>
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
                                              <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('status')}>
                                                  <div className="flex items-center">סטטוס {renderSortIcon('status')}</div>
                                              </th>
                                              <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('platform')}>
                                                  <div className="flex items-center">פלטפורמה {renderSortIcon('platform')}</div>
                                              </th>
                                              <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('created_at')}>
                                                  <div className="flex items-center">תאריך יצירה {renderSortIcon('created_at')}</div>
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
                 </>
             )}
             {/* Add Detail Dialog if needed */}
         </div>
     );
 } 