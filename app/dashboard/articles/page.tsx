"use client"

import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
    ArrowLeft, ChevronDown, ChevronUp, Plus, Edit, Trash, Eye, Filter, Search, X, FileText, Users, ThumbsUp, BookOpen
} from "lucide-react"; // Adjusted icons for articles
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Interface for Article data (Adapt based on actual Supabase 'articles' table)
interface Article {
    id: number;
    created_at: string;
    title: string;
    content?: string; // Full content
    excerpt?: string; // Short summary
    status: string; // e.g., 'Published', 'Draft', 'Archived'
    category?: string; // e.g., 'Market Trends', 'Tips', 'Company News'
    author_id?: string;
    author_name?: string; // Joined?
    views?: number;
    likes?: number;
    // Helper properties
    statusColor?: string;
    categoryColor?: string;
    icon?: React.ElementType;
}

// Adjusted FilterState for Articles
interface FilterState {
    searchTerm: string;
    status: string[];
    category: string[];
    sortBy: string;
    sortDirection: 'asc' | 'desc';
}

// Mappings for colors (adjust as needed for article statuses and categories)
const articleStatusStyleMapping: { [key: string]: { color: string } } = {
    'פורסם': { color: '#2ecc71' }, // Green
    'טיוטה': { color: '#f39c12' }, // Orange
    'בארכיון': { color: '#95a5a6' }, // Gray
    'ברירת מחדל': { color: '#bdc3c7' }, // Light Gray
};

const articleCategoryStyleMapping: { [key: string]: { color: string, icon: React.ElementType } } = {
    'טרנדים בשוק': { color: '#3498db', icon: BarChart },
    'טיפים': { color: '#e74c3c', icon: Star },
    'חדשות החברה': { color: '#9b59b6', icon: Users },
    'סיפורי הצלחה': { color: '#f1c40f', icon: Award }, // Yellow
    'מדריכים': { color: '#1abc9c', icon: BookOpen }, // Turquoise
    'אחר': { color: '#7f8c8d', icon: FileText },
};


export default function ArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list'); // Default to list view
    const [filters, setFilters] = useState<FilterState>({
        searchTerm: '',
        status: [],
        category: [],
        sortBy: 'created_at',
        sortDirection: 'desc',
    });
    const router = useRouter();

    // --- Data Fetching ---
    useEffect(() => {
        const fetchArticles = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // TODO: Adjust select query if author name needs joining
                const { data, error: dbError } = await supabase
                    .from('articles') // Fetch from 'articles' table
                    .select('*')
                    .order(filters.sortBy, { ascending: filters.sortDirection === 'asc' });

                if (dbError) {
                    throw new Error(`Articles fetch error: ${dbError.message}`);
                }

                // Add computed styles/icons
                const processedData = data?.map(article => {
                    const statusStyle = articleStatusStyleMapping[article.status] || articleStatusStyleMapping['ברירת מחדל'];
                    const categoryStyle = articleCategoryStyleMapping[article.category] || articleCategoryStyleMapping['אחר'];
                    return {
                        ...article,
                        statusColor: statusStyle.color,
                        categoryColor: categoryStyle.color,
                        icon: categoryStyle.icon,
                    };
                }) || [];

                setArticles(processedData);
            } catch (err: any) {
                console.error("Error fetching articles:", err);
                setError(err.message || "Failed to fetch articles");
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticles();
    }, [filters.sortBy, filters.sortDirection]); // Re-fetch when sorting changes

    // --- Filtering Logic ---
    const filteredArticles = useMemo(() => {
        return articles.filter(article => {
            const searchTermMatch = filters.searchTerm === '' ||
                article.title?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                article.excerpt?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                article.content?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                article.author_name?.toLowerCase().includes(filters.searchTerm.toLowerCase());

            const statusMatch = filters.status.length === 0 || filters.status.includes(article.status);
            const categoryMatch = filters.category.length === 0 || filters.category.includes(article.category);

            return searchTermMatch && statusMatch && categoryMatch;
        });
    }, [articles, filters.searchTerm, filters.status, filters.category]);

    // --- Event Handlers (Similar) ---
    const handleFilterChange = (key: keyof FilterState, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleCheckboxFilterChange = (key: 'status' | 'category', value: string) => {
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
            category: [],
            sortBy: 'created_at',
            sortDirection: 'desc',
        });
    };

    const getDistinctValues = (key: keyof Article): string[] => {
        return Array.from(new Set(articles.map(article => article[key]).filter(value => value != null) as string[]));
    };

    // --- Render Logic ---
    const renderSortIcon = (column: string) => {
        if (filters.sortBy !== column) return null;
        return filters.sortDirection === 'desc' ? <ChevronDown className="h-4 w-4 ml-1" /> : <ChevronUp className="h-4 w-4 ml-1" />;
    };

    // --- Grid View Card (Adapted for Articles) ---
    const ArticleGridCard = ({ article }: { article: Article }) => (
        <Card className={`overflow-hidden hover:shadow-lg transition-shadow duration-200 ease-in-out border rounded-lg border-l-4`}
              style={{ borderLeftColor: article.statusColor }}
        >
            <CardContent className="p-3 space-y-2">
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-sm text-gray-800 mb-1 line-clamp-2" title={article.title}>{article.title}</h3>
                    {article.icon && <article.icon className="h-4 w-4 text-gray-400 flex-shrink-0" title={article.category}/>}
                 </div>

                 <p className="text-xs text-gray-600 line-clamp-3">
                    {article.excerpt || article.content?.substring(0, 100) + '...' || 'אין תיאור זמין'}
                 </p>

                 <div className="flex items-center justify-between pt-1 text-xs text-gray-500">
                    <Badge variant="secondary" className="py-0.5 px-1.5" style={{ backgroundColor: `${article.statusColor}20`, color: article.statusColor }}>
                         {article.status}
                     </Badge>
                     <span>{article.author_name || 'לא ידוע'}</span>
                     <span>{new Date(article.created_at).toLocaleDateString('he-IL')}</span>
                 </div>

                 <div className="flex items-center justify-between pt-1 text-xs text-gray-500">
                     <div className="flex items-center gap-2">
                         <div className="flex items-center gap-0.5" title="צפיות">
                            <Eye className="h-3.5 w-3.5"/> {article.views ?? 0}
                         </div>
                         <div className="flex items-center gap-0.5" title="לייקים">
                             <ThumbsUp className="h-3.5 w-3.5"/> {article.likes ?? 0}
                         </div>
                     </div>
                      {article.category && (
                        <Badge variant="outline" className="py-0.5 px-1.5" style={{ borderColor: article.categoryColor }}>
                            {article.category}
                        </Badge>
                    )}
                 </div>

                 {/* Action Buttons */}
                 <div className="flex justify-end gap-1 pt-2">
                     <Link href={`/dashboard/articles/edit/${article.id}`} passHref>
                         <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full hover:bg-blue-100" title="עריכה">
                             <Edit className="h-4 w-4 text-blue-600" />
                         </Button>
                     </Link>
                      <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full hover:bg-green-100" title="הצג">
                         <Eye className="h-4 w-4 text-green-600" />
                      </Button>
                      {/* TODO: Add Delete confirmation */}
                     <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full hover:bg-red-100" title="מחיקה">
                         <Trash className="h-4 w-4 text-red-600" />
                     </Button>
                 </div>
             </CardContent>
         </Card>
     );

     // --- List View Row (Adapted for Articles) ---
     const ArticleListRow = ({ article }: { article: Article }) => (
        <tr className="hover:bg-gray-50 border-b last:border-b-0 text-sm">
            <td className="px-3 py-2 whitespace-nowrap">
                 <div className="flex items-center gap-2">
                    {article.icon && <article.icon className="h-4 w-4" style={{color: article.categoryColor}} title={article.category}/>}
                     <span className="font-medium text-gray-800 truncate" title={article.title}>{article.title}</span>
                 </div>
            </td>
             <td className="px-3 py-2">
                 <Badge variant="secondary" className="text-xs" style={{ backgroundColor: `${article.statusColor}20`, color: article.statusColor }}>{article.status}</Badge>
             </td>
             <td className="px-3 py-2 text-gray-600">{article.category ?? '-'}</td>
             <td className="px-3 py-2 text-gray-600">{article.author_name ?? '-'}</td>
             <td className="px-3 py-2 text-center text-gray-600">{article.views ?? 0}</td>
             <td className="px-3 py-2 text-center text-gray-600">{article.likes ?? 0}</td>
             <td className="px-3 py-2 text-gray-600">{new Date(article.created_at).toLocaleDateString('he-IL')}</td>
             <td className="px-3 py-2 text-right">
                 <div className="flex justify-end items-center gap-1">
                      <Link href={`/dashboard/articles/edit/${article.id}`} passHref>
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
                 <h1 className="text-2xl font-bold text-gray-800">ניהול מאמרים</h1>
                  <div className="flex items-center gap-2">
                       <Link href="/dashboard/articles/create">
                           <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow-sm">
                               <Plus className="ml-1 h-4 w-4" />
                               צור מאמר חדש
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
                                 placeholder="חיפוש לפי כותרת, תוכן, מחבר..."
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

                         {/* Category Filter Dropdown */}
                         <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                                 <Button variant="outline" className="text-sm border-gray-200">
                                     קטגוריה {filters.category.length > 0 ? `(${filters.category.length})` : ''}
                                     <ChevronDown className="mr-2 h-4 w-4" />
                                 </Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="start">
                                 {getDistinctValues('category').map((category) => (
                                     <DropdownMenuCheckboxItem
                                         key={category}
                                         checked={filters.category.includes(category)}
                                         onCheckedChange={() => handleCheckboxFilterChange('category', category)}
                                     >
                                         {category}
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

                         {(filters.searchTerm || filters.status.length > 0 || filters.category.length > 0) && (
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
                     <p className="ml-3 text-purple-700">טוען מאמרים...</p>
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
                     {filteredArticles.length === 0 ? (
                         <div className="text-center py-10 text-gray-500">
                             <p>לא נמצאו מאמרים התואמים את הסינון.</p>
                         </div>
                     ) : viewMode === 'grid' ? (
                         // Grid View
                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                             {filteredArticles.map(article => <ArticleGridCard key={article.id} article={article} />)}
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
                                             <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('status')}>
                                                 <div className="flex items-center">סטטוס {renderSortIcon('status')}</div>
                                             </th>
                                              <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('category')}>
                                                  <div className="flex items-center">קטגוריה {renderSortIcon('category')}</div>
                                              </th>
                                              <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('author_name')}>
                                                  <div className="flex items-center">מחבר {renderSortIcon('author_name')}</div>
                                              </th>
                                              <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">צפיות</th>
                                              <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">לייקים</th>
                                              <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('created_at')}>
                                                  <div className="flex items-center">תאריך יצירה {renderSortIcon('created_at')}</div>
                                              </th>
                                              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">פעולות</th>
                                         </tr>
                                     </thead>
                                      <tbody className="bg-white divide-y divide-gray-100">
                                          {filteredArticles.map(article => <ArticleListRow key={article.id} article={article} />)}
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