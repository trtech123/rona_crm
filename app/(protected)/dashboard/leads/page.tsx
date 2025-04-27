"use client"

import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
    ArrowLeft, ChevronDown, ChevronUp, Plus, Edit, Trash, Eye, Filter, Search, X, Users, Phone, Mail, MessageSquare, Link as LinkIcon
} from "lucide-react"; // Adjusted icons for leads
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Potentially import a DetailDialog or similar for viewing/editing leads inline
// import { DetailDialog } from "@/components/dashboard/shared/DetailDialog";

// Interface for Lead data (Adapt based on actual Supabase 'leads' table)
interface Lead {
    id: number;
    created_at: string;
    name: string;
    email?: string;
    phone?: string;
    status: string; // e.g., 'New', 'Contacted', 'Qualified', 'Lost', 'Won'
    source?: string; // e.g., 'Website Form', 'Facebook Ad', 'Referral'
    assigned_to?: string; // User ID or name
    last_contacted?: string;
    post_id?: number; // Link to the post that generated the lead, if any
    notes?: string;
    // Helper properties
    statusColor?: string;
    sourceColor?: string;
    icon?: React.ElementType; // Icon based on source?
}

// Adjusted FilterState for Leads
interface FilterState {
    searchTerm: string;
    status: string[];
    source: string[];
    sortBy: string;
    sortDirection: 'asc' | 'desc';
}

// Mappings for colors (adjust as needed for lead statuses and sources)
const leadStatusStyleMapping: { [key: string]: { color: string } } = {
    'חדש': { color: '#3498db' }, // Blue
    'נוצר קשר': { color: '#f39c12' }, // Orange
    'בטיפול': { color: '#9b59b6' }, // Purple
    'מוסמך': { color: '#2ecc71' }, // Green
    'אבוד': { color: '#e74c3c' }, // Red
    'סגור': { color: '#1abc9c' }, // Turquoise
    'לא רלוונטי': { color: '#95a5a6' }, // Gray
    'ברירת מחדל': { color: '#bdc3c7' }, // Light Gray
};

const leadSourceStyleMapping: { [key: string]: { color: string, icon: React.ElementType } } = {
    'טופס אתר': { color: '#3498db', icon: LinkIcon },
    'פייסבוק': { color: '#3b5998', icon: MessageSquare }, // Facebook Blue
    'אינסטגרם': { color: '#e1306c', icon: MessageSquare }, // Instagram Pink
    'ווטסאפ': { color: '#25d366', icon: MessageSquare }, // WhatsApp Green
    'טלפון': { color: '#f39c12', icon: Phone },
    'מייל': { color: '#e74c3c', icon: Mail },
    'הפניה': { color: '#9b59b6', icon: Users },
    'אחר': { color: '#7f8c8d', icon: Users },
};


export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list'); // Default to list view for leads?
    const [filters, setFilters] = useState<FilterState>({
        searchTerm: '',
        status: [],
        source: [],
        sortBy: 'created_at',
        sortDirection: 'desc',
    });
    const router = useRouter();
    // State for potential detail view dialog
    // const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    // const [isDetailOpen, setIsDetailOpen] = useState(false);

    // --- Data Fetching ---
    useEffect(() => {
        const fetchLeads = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // TODO: Add user_id/permission filters if necessary
                const { data, error: dbError } = await supabase
                    .from('leads') // Fetch from 'leads' table
                    .select('*')
                    .order(filters.sortBy, { ascending: filters.sortDirection === 'asc' });

                if (dbError) {
                    throw new Error(`Leads fetch error: ${dbError.message}`);
                }

                // Add computed styles/icons
                const processedData = data?.map(lead => {
                    const statusStyle = leadStatusStyleMapping[lead.status] || leadStatusStyleMapping['ברירת מחדל'];
                    const sourceStyle = leadSourceStyleMapping[lead.source] || leadSourceStyleMapping['אחר'];
                    return {
                        ...lead,
                        statusColor: statusStyle.color,
                        sourceColor: sourceStyle.color,
                        icon: sourceStyle.icon,
                    };
                }) || [];

                setLeads(processedData);
            } catch (err: any) {
                console.error("Error fetching leads:", err);
                setError(err.message || "Failed to fetch leads");
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeads();
    }, [filters.sortBy, filters.sortDirection]); // Re-fetch when sorting changes

    // --- Filtering Logic ---
    const filteredLeads = useMemo(() => {
        return leads.filter(lead => {
            const searchTermMatch = filters.searchTerm === '' ||
                lead.name?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                lead.email?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                lead.phone?.includes(filters.searchTerm) ||
                lead.notes?.toLowerCase().includes(filters.searchTerm.toLowerCase());

            const statusMatch = filters.status.length === 0 || filters.status.includes(lead.status);
            const sourceMatch = filters.source.length === 0 || filters.source.includes(lead.source);

            return searchTermMatch && statusMatch && sourceMatch;
        });
    }, [leads, filters.searchTerm, filters.status, filters.source]);

    // --- Event Handlers ---
    const handleFilterChange = (key: keyof FilterState, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleCheckboxFilterChange = (key: 'status' | 'source', value: string) => {
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
            source: [],
            sortBy: 'created_at',
            sortDirection: 'desc',
        });
    };

    // --- Helper to get distinct values for filters ---
    const getDistinctValues = (key: keyof Lead): string[] => {
        // Ensure we handle potential null/undefined values before creating the Set
        return Array.from(new Set(leads.map(lead => lead[key]).filter(value => value != null) as string[]));
    };


    // --- Render Logic ---
    const renderSortIcon = (column: string) => {
        if (filters.sortBy !== column) return null;
        return filters.sortDirection === 'desc' ? <ChevronDown className="h-4 w-4 ml-1" /> : <ChevronUp className="h-4 w-4 ml-1" />;
    };

    // --- Grid View Card (Adapted for Leads) ---
    const LeadGridCard = ({ lead }: { lead: Lead }) => (
       <Card className={`overflow-hidden hover:shadow-lg transition-shadow duration-200 ease-in-out border rounded-lg border-l-4`}
             style={{ borderLeftColor: lead.statusColor }}
       >
            <CardContent className="p-3 space-y-2">
                 <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-sm text-gray-800 truncate pr-2" title={lead.name}>{lead.name}</h3>
                    {lead.icon && <lead.icon className="h-4 w-4 text-gray-400 flex-shrink-0" title={lead.source}/>}
                 </div>

                 <div className="text-xs text-gray-600 space-y-1">
                     {lead.email && (
                         <div className="flex items-center gap-1 truncate" title={lead.email}>
                             <Mail className="h-3 w-3 text-gray-400"/>
                             <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>
                         </div>
                     )}
                      {lead.phone && (
                         <div className="flex items-center gap-1" title={lead.phone}>
                             <Phone className="h-3 w-3 text-gray-400"/>
                             <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                         </div>
                     )}
                 </div>

                 <div className="flex items-center justify-between pt-1">
                    <Badge variant="secondary" className="text-xs py-0.5 px-1.5" style={{ backgroundColor: `${lead.statusColor}20`, color: lead.statusColor }}>
                        {lead.status}
                    </Badge>
                    <span className="text-xs text-gray-400">{new Date(lead.created_at).toLocaleDateString('he-IL')}</span>
                 </div>

                 {/* Action Buttons */}
                 <div className="flex justify-end gap-1 pt-2">
                     <Link href={`/dashboard/leads/edit/${lead.id}`} passHref>
                         <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full hover:bg-blue-100" title="עריכה">
                             <Edit className="h-4 w-4 text-blue-600" />
                         </Button>
                     </Link>
                      <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full hover:bg-green-100" title="הצג פרטים" /*onClick={() => {setSelectedLead(lead); setIsDetailOpen(true);}}*/>
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

     // --- List View Row (Adapted for Leads) ---
     const LeadListRow = ({ lead }: { lead: Lead }) => (
        <tr className="hover:bg-gray-50 border-b last:border-b-0 text-sm">
            <td className="px-3 py-2 whitespace-nowrap">
                 <div className="flex items-center gap-2">
                    {lead.icon && <lead.icon className="h-4 w-4" style={{color: lead.sourceColor}} title={lead.source}/>}
                     <span className="font-medium text-gray-800 truncate" title={lead.name}>{lead.name}</span>
                </div>
            </td>
            <td className="px-3 py-2 text-gray-600 truncate" title={lead.email}>{lead.email ?? '-'}</td>
            <td className="px-3 py-2 text-gray-600">{lead.phone ?? '-'}</td>
             <td className="px-3 py-2">
                 <Badge variant="secondary" className="text-xs" style={{ backgroundColor: `${lead.statusColor}20`, color: lead.statusColor }}>{lead.status}</Badge>
             </td>
             <td className="px-3 py-2 text-gray-600">{lead.source ?? '-'}</td>
             <td className="px-3 py-2 text-gray-600">{new Date(lead.created_at).toLocaleDateString('he-IL')}</td>
             <td className="px-3 py-2 text-right">
                 <div className="flex justify-end items-center gap-1">
                      <Link href={`/dashboard/leads/edit/${lead.id}`} passHref>
                         <Button size="icon" variant="ghost" className="h-6 w-6 rounded hover:bg-blue-100" title="עריכה"><Edit className="h-3.5 w-3.5 text-blue-600" /></Button>
                      </Link>
                      <Button size="icon" variant="ghost" className="h-6 w-6 rounded hover:bg-green-100" title="הצג" /*onClick={() => {setSelectedLead(lead); setIsDetailOpen(true);}}*/>
                          <Eye className="h-3.5 w-3.5 text-green-600" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-6 w-6 rounded hover:bg-red-100" title="מחק"><Trash className="h-3.5 w-3.5 text-red-600" /></Button>
                 </div>
             </td>
        </tr>
    );

    return (
        <div className="p-4 md:p-6 space-y-6" dir="rtl">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">ניהול לידים</h1>
                 <div className="flex items-center gap-2">
                      <Link href="/dashboard/leads/create">
                          <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow-sm">
                              <Plus className="ml-1 h-4 w-4" />
                              צור ליד חדש
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
                                placeholder="חיפוש לפי שם, מייל, טלפון..."
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

                        {/* Source Filter Dropdown */}
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="text-sm border-gray-200">
                                    מקור {filters.source.length > 0 ? `(${filters.source.length})` : ''}
                                    <ChevronDown className="mr-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                {getDistinctValues('source').map((source) => (
                                    <DropdownMenuCheckboxItem
                                        key={source}
                                        checked={filters.source.includes(source)}
                                        onCheckedChange={() => handleCheckboxFilterChange('source', source)}
                                    >
                                        {source}
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

                         {(filters.searchTerm || filters.status.length > 0 || filters.source.length > 0) && (
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
                    <p className="ml-3 text-purple-700">טוען לידים...</p>
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
                    {filteredLeads.length === 0 ? (
                         <div className="text-center py-10 text-gray-500">
                            <p>לא נמצאו לידים התואמים את הסינון.</p>
                         </div>
                    ) : viewMode === 'grid' ? (
                        // Grid View
                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {filteredLeads.map(lead => <LeadGridCard key={lead.id} lead={lead} />)}
                         </div>
                    ) : (
                         // List View
                         <Card className="overflow-hidden border border-gray-100 shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('name')}>
                                                <div className="flex items-center">שם {renderSortIcon('name')}</div>
                                            </th>
                                            <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('email')}>
                                                <div className="flex items-center">אימייל {renderSortIcon('email')}</div>
                                            </th>
                                             <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('phone')}>
                                                <div className="flex items-center">טלפון {renderSortIcon('phone')}</div>
                                            </th>
                                             <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('status')}>
                                                <div className="flex items-center">סטטוס {renderSortIcon('status')}</div>
                                            </th>
                                             <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('source')}>
                                                <div className="flex items-center">מקור {renderSortIcon('source')}</div>
                                            </th>
                                            <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('created_at')}>
                                                 <div className="flex items-center">תאריך יצירה {renderSortIcon('created_at')}</div>
                                             </th>
                                             <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">פעולות</th>
                                        </tr>
                                    </thead>
                                     <tbody className="bg-white divide-y divide-gray-100">
                                         {filteredLeads.map(lead => <LeadListRow key={lead.id} lead={lead} />)}
                                     </tbody>
                                </table>
                            </div>
                         </Card>
                    )}
                     {/* TODO: Add Pagination if needed */}
                </>
             )}

            {/* TODO: Add Detail Dialog Component if needed
             {selectedLead && (
                <DetailDialog
                    isOpen={isDetailOpen}
                    setIsOpen={setIsDetailOpen}
                    item={selectedLead}
                    itemType="lead"
                    // Pass other necessary props like handlers for notes, automations etc.
                />
             )}
            */}
        </div>
    );
} 