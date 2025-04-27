"use client"

import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
    ArrowRight, ArrowLeft, ChevronDown, ChevronUp, Plus, Copy, Edit, Trash, Eye, Filter, Search, X, Calendar, Users, MessageSquare, Star, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { LeadsPopoverContent, CommentsPopoverContent } from "@/components/dashboard/PostInteractionPopovers"; // Assuming these are created/refactored
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Interface matching the data structure from Supabase 'posts' table
interface Post {
    id: number;
    created_at: string;
    title: string;
    content?: string; // Optional, might not be needed for list view
    status: string; // e.g., 'Published', 'Draft', 'Scheduled'
    type: string; // e.g., 'Post', 'Article', 'Event'
    effectiveness?: number; // Optional metric
    // Assuming relations or counts are handled separately or joined if needed
    // For simplicity, let's assume leads/comments counts might come from related tables later
    leads_count?: number;
    comments_count?: number;
    likes_count?: number;
    is_leading?: boolean;
    user_id?: string;
    date?: string; // For events
    location?: string; // For events
    platform?: string; // e.g., 'Facebook', 'Instagram', 'Blog'
    target_audience?: string;
    goals?: string[];
    // Helper properties added client-side
    statusColor?: string;
    typeColor?: string;
    leadingColor?: string;
    icon?: React.ElementType;
}

interface FilterState {
    searchTerm: string;
    status: string[];
    type: string[];
    sortBy: string;
    sortDirection: 'asc' | 'desc';
}

// Mappings for colors and icons based on type/status
const typeStyleMapping: { [key: string]: { color: string; icon: React.ElementType } } = {
    'פוסט': { color: '#3498db', icon: MessageSquare }, // Blue
    'מאמר': { color: '#8e44ad', icon: FileText }, // Purple
    'אירוע': { color: '#2ecc71', icon: Calendar }, // Green
    'חג': { color: '#f39c12', icon: Star }, // Orange
    'מערכת': { color: '#95a5a6', icon: Users }, // Gray
    'ברירת מחדל': { color: '#7f8c8d', icon: MessageSquare }, // Default Gray
};

const statusStyleMapping: { [key: string]: { color: string } } = {
    'פורסם': { color: '#2ecc71' }, // Green
    'טיוטה': { color: '#f39c12' }, // Orange
    'מתוזמן': { color: '#3498db' }, // Blue
    'נדחה': { color: '#e74c3c' }, // Red
    'בבדיקה': { color: '#95a5a6' }, // Gray
    'ברירת מחדל': { color: '#bdc3c7' }, // Light Gray
};

export default function PostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // Default to grid view
    const [filters, setFilters] = useState<FilterState>({
        searchTerm: '',
        status: [],
        type: [],
        sortBy: 'created_at',
        sortDirection: 'desc',
    });
    const router = useRouter();

    // --- Data Fetching ---
    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // TODO: Add user_id filter based on logged-in user
                const { data, error: dbError } = await supabase
                    .from('posts')
                    .select('*') // Select all columns for now
                    .order(filters.sortBy, { ascending: filters.sortDirection === 'asc' });

                if (dbError) {
                    throw new Error(`Posts fetch error: ${dbError.message}`);
                }

                // Add computed styles/icons client-side
                const processedData = data?.map(post => {
                    const typeStyle = typeStyleMapping[post.type] || typeStyleMapping['ברירת מחדל'];
                    const statusStyle = statusStyleMapping[post.status] || statusStyleMapping['ברירת מחדל'];
                    return {
                        ...post,
                        typeColor: typeStyle.color,
                        icon: typeStyle.icon,
                        statusColor: statusStyle.color,
                        leadingColor: post.is_leading ? '#e74c3c' : undefined, // Red for leading
                        // Fake counts for now until relations are set up
                        leads_count: Math.floor(Math.random() * 50),
                        comments_count: Math.floor(Math.random() * 30),
                        likes_count: Math.floor(Math.random() * 100),
                    };
                }) || [];

                setPosts(processedData);
            } catch (err: any) {
                console.error("Error fetching posts:", err);
                setError(err.message || "Failed to fetch posts");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [filters.sortBy, filters.sortDirection]); // Re-fetch when sorting changes

    // --- Filtering Logic ---
    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const searchTermMatch = filters.searchTerm === '' ||
                post.title?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                post.content?.toLowerCase().includes(filters.searchTerm.toLowerCase());

            const statusMatch = filters.status.length === 0 || filters.status.includes(post.status);
            const typeMatch = filters.type.length === 0 || filters.type.includes(post.type);

            return searchTermMatch && statusMatch && typeMatch;
        });
    }, [posts, filters.searchTerm, filters.status, filters.type]);

    // --- Event Handlers ---
    const handleFilterChange = (key: keyof FilterState, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleCheckboxFilterChange = (key: 'status' | 'type', value: string) => {
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
            type: [],
            sortBy: 'created_at',
            sortDirection: 'desc',
        });
    };

    // --- Helper to get distinct values for filters ---
    const getDistinctValues = (key: keyof Post): string[] => {
        return Array.from(new Set(posts.map(post => post[key]).filter(Boolean) as string[]));
    };

    // --- Render Logic ---
    const renderSortIcon = (column: string) => {
        if (filters.sortBy !== column) return null;
        return filters.sortDirection === 'desc' ? <ChevronDown className="h-4 w-4 ml-1" /> : <ChevronUp className="h-4 w-4 ml-1" />;
    };

    // --- Grid View Card ---
    const PostGridCard = ({ post }: { post: Post }) => (
       <Card
            className={`overflow-hidden hover:shadow-lg transition-shadow duration-200 ease-in-out border rounded-lg ${post.is_leading ? "border-[#e74c3c] border-2" : "border-gray-200"}`}
            style={{ borderColor: post.is_leading ? post.leadingColor : post.typeColor ? `${post.typeColor}40` : undefined }}
        >
            <CardContent className="p-0">
                {/* Placeholder for Image/Header */}
                <div className="h-[100px] bg-gradient-to-br from-gray-100 to-gray-200 relative flex items-center justify-center">
                     {post.icon && <post.icon className="h-10 w-10 text-gray-400" />}
                     <div className="absolute top-2 right-2 flex gap-1">
                        {post.type && <Badge variant="secondary" className="text-xs py-0.5 px-1.5" style={{ backgroundColor: `${post.typeColor}20`, color: post.typeColor }}>{post.type}</Badge>}
                    </div>
                    <div className="absolute top-2 left-2">
                        {post.status && <Badge variant="outline" className="text-xs py-0.5 px-1.5" style={{ backgroundColor: `${post.statusColor}20`, color: post.statusColor }}>{post.status}</Badge>}
                    </div>
                </div>
                <div className="p-3">
                    <h3 className="font-semibold text-sm text-gray-800 mb-1 truncate" title={post.title}>{post.title}</h3>
                    <p className="text-xs text-gray-500 mb-2">
                        {new Date(post.created_at).toLocaleDateString('he-IL')}
                        {post.date && post.type === 'אירוע' && ` (אירוע: ${new Date(post.date).toLocaleDateString('he-IL')})`}
                    </p>
                    {/* Interaction counts with Popovers */}
                    <div className="grid grid-cols-3 gap-1 text-xs mb-3">
                        <Popover>
                            <PopoverTrigger asChild>
                                <div className="flex items-center gap-1 cursor-pointer text-gray-600 hover:text-purple-600">
                                    <Users className="h-3.5 w-3.5 text-purple-600"/> <span>{post.leads_count ?? 0}</span>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-60 p-0">
                                <LeadsPopoverContent postId={post.id} postTitle={post.title} />
                            </PopoverContent>
                        </Popover>
                        <Popover>
                            <PopoverTrigger asChild>
                                <div className="flex items-center gap-1 cursor-pointer text-gray-600 hover:text-red-600">
                                    <MessageSquare className="h-3.5 w-3.5 text-red-600"/> <span>{post.comments_count ?? 0}</span>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-60 p-0">
                                <CommentsPopoverContent postId={post.id} postTitle={post.title} />
                            </PopoverContent>
                        </Popover>
                        <div className="flex items-center gap-1 text-gray-600">
                            <Star className="h-3.5 w-3.5 text-yellow-500"/> <span>{post.likes_count ?? 0}</span>
                        </div>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex justify-end gap-1">
                        <Link href={`/dashboard/posts/edit/${post.id}`} passHref>
                            <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full hover:bg-blue-100" title="עריכה">
                                <Edit className="h-4 w-4 text-blue-600" />
                            </Button>
                        </Link>
                        {/* Consider adding view/details button */}
                         <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full hover:bg-green-100" title="הצג פרטים">
                            <Eye className="h-4 w-4 text-green-600" />
                         </Button>
                        {/* TODO: Add Delete confirmation */}
                        <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full hover:bg-red-100" title="מחיקה">
                            <Trash className="h-4 w-4 text-red-600" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

     // --- List View Row ---
     const PostListRow = ({ post }: { post: Post }) => (
        <tr className="hover:bg-gray-50 border-b last:border-b-0 text-sm">
            <td className="px-3 py-2 whitespace-nowrap">
                <div className="flex items-center gap-2">
                   {post.icon && <post.icon className="h-4 w-4" style={{color: post.typeColor}} />}
                    <span className="font-medium text-gray-800 truncate" title={post.title}>{post.title}</span>
                     {post.is_leading && <Badge variant="destructive" className="text-[10px] px-1 py-0 leading-none">מוביל</Badge>}
                </div>
            </td>
             <td className="px-3 py-2">
                 <Badge variant="secondary" className="text-xs" style={{ backgroundColor: `${post.typeColor}20`, color: post.typeColor }}>{post.type}</Badge>
             </td>
             <td className="px-3 py-2">
                 <Badge variant="outline" className="text-xs" style={{ backgroundColor: `${post.statusColor}20`, color: post.statusColor }}>{post.status}</Badge>
             </td>
             <td className="px-3 py-2 text-gray-600">{new Date(post.created_at).toLocaleDateString('he-IL')}</td>
              {/* Interaction Counts - simplified for list view */}
             <td className="px-3 py-2 text-center text-gray-600">{post.leads_count ?? 0}</td>
             <td className="px-3 py-2 text-center text-gray-600">{post.comments_count ?? 0}</td>
             <td className="px-3 py-2 text-center text-gray-600">{post.likes_count ?? 0}</td>
             <td className="px-3 py-2 text-right">
                 <div className="flex justify-end items-center gap-1">
                     <Link href={`/dashboard/posts/edit/${post.id}`} passHref>
                        <Button size="icon" variant="ghost" className="h-6 w-6 rounded hover:bg-blue-100" title="עריכה"><Edit className="h-3.5 w-3.5 text-blue-600" /></Button>
                     </Link>
                     <Button size="icon" variant="ghost" className="h-6 w-6 rounded hover:bg-green-100" title="הצג"><Eye className="h-3.5 w-3.5 text-green-600" /></Button>
                     <Button size="icon" variant="ghost" className="h-6 w-6 rounded hover:bg-red-100" title="מחק"><Trash className="h-3.5 w-3.5 text-red-600" /></Button>
                 </div>
             </td>
        </tr>
    );

    return (
        <div className="p-4 md:p-6 space-y-6" dir="rtl">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">ניהול פוסטים</h1>
                 <div className="flex items-center gap-2">
                      <Link href="/dashboard/posts/create">
                          <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow-sm">
                              <Plus className="ml-1 h-4 w-4" />
                              צור פוסט חדש
                          </Button>
                      </Link>
                     <Link href="/dashboard">
                         <Button variant="outline" className="flex items-center gap-1 text-sm">
                            <ArrowLeft className="h-4 w-4" />
                             חזרה לדשבורד
                         </Button>
                     </Link>
                 </div>
            </div>

            {/* Filters and Search */}
            <Card className="bg-white shadow-sm border border-gray-100">
                <CardContent className="p-3 space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="חיפוש לפי כותרת או תוכן..."
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

                        {/* Type Filter Dropdown */}
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="text-sm border-gray-200">
                                    סוג {filters.type.length > 0 ? `(${filters.type.length})` : ''}
                                    <ChevronDown className="mr-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                {getDistinctValues('type').map((type) => (
                                    <DropdownMenuCheckboxItem
                                        key={type}
                                        checked={filters.type.includes(type)}
                                        onCheckedChange={() => handleCheckboxFilterChange('type', type)}
                                    >
                                        {type}
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
                                 תצוגת רשת
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

                         {(filters.searchTerm || filters.status.length > 0 || filters.type.length > 0) && (
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
                    <p className="ml-3 text-purple-700">טוען פוסטים...</p>
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
                    {filteredPosts.length === 0 ? (
                         <div className="text-center py-10 text-gray-500">
                            <p>לא נמצאו פוסטים התואמים את הסינון.</p>
                         </div>
                    ) : viewMode === 'grid' ? (
                        // Grid View
                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {filteredPosts.map(post => <PostGridCard key={post.id} post={post} />)}
                         </div>
                    ) : (
                         // List View
                         <Card className="overflow-hidden border border-gray-100 shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('title')}>
                                                <div className="flex items-center">כותרת {renderSortIcon('title')}</div>
                                            </th>
                                             <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('type')}>
                                                <div className="flex items-center">סוג {renderSortIcon('type')}</div>
                                            </th>
                                             <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('status')}>
                                                <div className="flex items-center">סטטוס {renderSortIcon('status')}</div>
                                            </th>
                                             <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('created_at')}>
                                                <div className="flex items-center">תאריך יצירה {renderSortIcon('created_at')}</div>
                                            </th>
                                            {/* Interaction Headers - Not sortable for now */}
                                             <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">לידים</th>
                                             <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">תגובות</th>
                                             <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">לייקים</th>
                                             <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">פעולות</th>
                                        </tr>
                                    </thead>
                                     <tbody className="bg-white divide-y divide-gray-100">
                                         {filteredPosts.map(post => <PostListRow key={post.id} post={post} />)}
                                     </tbody>
                                </table>
                            </div>
                         </Card>
                    )}
                     {/* TODO: Add Pagination if needed */}
                </>
             )}
        </div>
    );
}

// TODO: Create/Refactor Popover components if not already done
// Example: rona_crm/components/dashboard/PostInteractionPopovers.tsx

// export const LeadsPopoverContent = ({ postId, postTitle }: { postId: number, postTitle: string }) => {
//   const [leads, setLeads] = useState<any[]>([]); // Fetch actual leads
//   const [loading, setLoading] = useState(false);
//   useEffect(() => { /* Fetch leads for postId */ }, [postId]);
//   return ( <div className="p-2"> ... display leads ... </div>);
// };

// export const CommentsPopoverContent = ({ postId, postTitle }: { postId: number, postTitle: string }) => {
//   const [comments, setComments] = useState<any[]>([]); // Fetch actual comments
//   const [loading, setLoading] = useState(false);
//   useEffect(() => { /* Fetch comments for postId */ }, [postId]);
//   return ( <div className="p-2"> ... display comments ... </div>);
// };
