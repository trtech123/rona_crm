"use client"

import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
    ArrowLeft, ChevronDown, ChevronUp, Plus, Edit, Trash, Eye, Filter, Search, X, CheckSquare, Clock, User, AlertTriangle, Calendar
} from "lucide-react"; // Adjusted icons for tasks
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // For assigned user

// Interface for Task data (Adapt based on actual Supabase 'tasks' table)
interface Task {
    id: number;
    created_at: string;
    title: string;
    description?: string;
    status: string; // e.g., 'To Do', 'In Progress', 'Done', 'Blocked'
    priority: string; // e.g., 'High', 'Medium', 'Low'
    due_date?: string;
    assigned_to_id?: string; // User ID
    assigned_to_name?: string; // Fetched/Joined?
    assigned_to_avatar_url?: string; // Fetched/Joined?
    related_entity_type?: string; // e.g., 'Lead', 'Post', 'Contact'
    related_entity_id?: number;
    // Helper properties
    statusColor?: string;
    priorityColor?: string;
    priorityIcon?: React.ElementType;
    isOverdue?: boolean;
}

// Adjusted FilterState for Tasks
interface FilterState {
    searchTerm: string;
    status: string[];
    priority: string[];
    assignedTo: string[]; // Filter by assigned user name/ID
    sortBy: string;
    sortDirection: 'asc' | 'desc';
}

// Mappings for colors/icons (adjust as needed for task statuses and priorities)
const taskStatusStyleMapping: { [key: string]: { color: string } } = {
    'לביצוע': { color: '#3498db' }, // Blue
    'בתהליך': { color: '#f39c12' }, // Orange
    'הושלם': { color: '#2ecc71' }, // Green
    'חסום': { color: '#e74c3c' }, // Red
    'ברירת מחדל': { color: '#bdc3c7' }, // Light Gray
};

const taskPriorityStyleMapping: { [key: string]: { color: string, icon: React.ElementType } } = {
    'גבוהה': { color: '#e74c3c', icon: AlertTriangle }, // Red
    'בינונית': { color: '#f39c12', icon: Clock }, // Orange
    'נמוכה': { color: '#3498db', icon: ChevronDown }, // Blue
    'ברירת מחדל': { color: '#7f8c8d', icon: ChevronDown },
};

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list'); // Default to list view
    const [filters, setFilters] = useState<FilterState>({
        searchTerm: '',
        status: [],
        priority: [],
        assignedTo: [],
        sortBy: 'due_date', // Sort by due date by default?
        sortDirection: 'asc',
    });
    const router = useRouter();
    const [allUsers, setAllUsers] = useState<{ id: string; name: string; avatar_url?: string }[]>([]); // To populate filter

    // --- Data Fetching ---
    useEffect(() => {
        // Fetch Users for filter dropdown (can be optimized)
        const fetchUsers = async () => {
            // TODO: Replace with your actual user fetching logic (e.g., from a 'profiles' table)
            // Example:
            // const { data, error } = await supabase.from('profiles').select('id, full_name, avatar_url');
            // if (!error && data) {
            //    setAllUsers(data.map(u => ({ id: u.id, name: u.full_name, avatar_url: u.avatar_url })));
            // }
            // Placeholder:
            setAllUsers([
                { id: 'user1', name: 'אליס', avatar_url: undefined },
                { id: 'user2', name: 'בוב', avatar_url: undefined },
            ]);
        };

        const fetchTasks = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // TODO: Adjust select query to join assigned user details if needed
                const { data, error: dbError } = await supabase
                    .from('tasks') // Fetch from 'tasks' table
                    .select('*') // Example: '*, assigned_user:profiles(full_name, avatar_url)'
                    .order(filters.sortBy, { ascending: filters.sortDirection === 'asc' });

                if (dbError) {
                    throw new Error(`Tasks fetch error: ${dbError.message}`);
                }

                // Add computed styles/icons & check overdue status
                const now = new Date();
                const processedData = data?.map(task => {
                    const statusStyle = taskStatusStyleMapping[task.status] || taskStatusStyleMapping['ברירת מחדל'];
                    const priorityStyle = taskPriorityStyleMapping[task.priority] || taskPriorityStyleMapping['ברירת מחדל'];
                    const isOverdue = task.due_date ? new Date(task.due_date) < now && task.status !== 'הושלם' : false;
                    // const assigned_to_name = task.assigned_user?.full_name; // If joined
                    // const assigned_to_avatar_url = task.assigned_user?.avatar_url; // If joined
                    return {
                        ...task,
                        statusColor: statusStyle.color,
                        priorityColor: priorityStyle.color,
                        priorityIcon: priorityStyle.icon,
                        isOverdue,
                        // assigned_to_name, // Assign fetched/joined name
                        // assigned_to_avatar_url, // Assign fetched/joined avatar
                    };
                }) || [];

                setTasks(processedData);
            } catch (err: any) {
                console.error("Error fetching tasks:", err);
                setError(err.message || "Failed to fetch tasks");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
        fetchTasks();
    }, [filters.sortBy, filters.sortDirection]); // Re-fetch when sorting changes

    // --- Filtering Logic ---
    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const searchTermMatch = filters.searchTerm === '' ||
                task.title?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                task.description?.toLowerCase().includes(filters.searchTerm.toLowerCase());

            const statusMatch = filters.status.length === 0 || filters.status.includes(task.status);
            const priorityMatch = filters.priority.length === 0 || filters.priority.includes(task.priority);
            const assignedMatch = filters.assignedTo.length === 0 || filters.assignedTo.includes(task.assigned_to_id || ''); // Match by ID

            return searchTermMatch && statusMatch && priorityMatch && assignedMatch;
        });
    }, [tasks, filters.searchTerm, filters.status, filters.priority, filters.assignedTo]);

    // --- Event Handlers ---
    const handleFilterChange = (key: keyof FilterState, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleCheckboxFilterChange = (key: 'status' | 'priority' | 'assignedTo', value: string) => {
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
            // Special case for due_date: nulls last when ascending
            if (newSortBy === 'due_date') {
                // This sorting logic happens client-side if data is already fetched,
                // or needs specific handling in Supabase query (e.g., using .order with nullsfirst/nullslast)
                // For simplicity, we just toggle direction here.
                // Actual nulls handling might need adjustment based on Supabase capabilities or client-side sort.
            }
            return { ...prev, sortBy: newSortBy, sortDirection: newDirection };
        });
        // Note: Supabase fetch might need { nullsfirst: newDirection === 'asc' } for due_date
    };

    const clearFilters = () => {
        setFilters({
            searchTerm: '',
            status: [],
            priority: [],
            assignedTo: [],
            sortBy: 'due_date',
            sortDirection: 'asc',
        });
    };

    const getDistinctValues = (key: 'status' | 'priority'): string[] => {
        return Array.from(new Set(tasks.map(task => task[key]).filter(value => value != null) as string[]));
    };

    // --- Render Logic ---
    const renderSortIcon = (column: string) => {
        if (filters.sortBy !== column) return null;
        return filters.sortDirection === 'desc' ? <ChevronDown className="h-4 w-4 ml-1" /> : <ChevronUp className="h-4 w-4 ml-1" />;
    };

    // --- Grid View Card (Adapted for Tasks) ---
    const TaskGridCard = ({ task }: { task: Task }) => (
        <Card className={`relative overflow-hidden hover:shadow-lg transition-shadow duration-200 ease-in-out border rounded-lg border-l-4 ${task.isOverdue ? 'border-red-500 bg-red-50/50' : 'border-gray-200'}`}
              style={{ borderLeftColor: task.isOverdue ? '#e74c3c' : task.statusColor }}
        >
            {task.priorityIcon && (
                <task.priorityIcon
                    className="absolute top-2 right-2 h-4 w-4 z-10"
                    style={{ color: task.priorityColor }}
                    title={`עדיפות: ${task.priority}`}
                />
            )}
            <CardContent className="p-3 space-y-2">
                <h3 className={`font-semibold text-sm text-gray-800 mb-1 line-clamp-2 ${task.status === 'הושלם' ? 'line-through text-gray-500' : ''}`} title={task.title}>{task.title}</h3>

                 <p className="text-xs text-gray-600 line-clamp-2" title={task.description || ''}>
                    {task.description || 'אין תיאור זמין'}
                 </p>

                 <div className="flex items-center justify-between pt-1 text-xs">
                     <Badge variant="secondary" className="py-0.5 px-1.5" style={{ backgroundColor: `${task.statusColor}20`, color: task.statusColor }}>
                          {task.status}
                      </Badge>
                     <div className="flex items-center gap-1 text-gray-500" title={task.due_date ? new Date(task.due_date).toLocaleDateString('he-IL') : 'אין תאריך יעד'}>
                         <Calendar className="h-3 w-3" />
                         <span className={task.isOverdue ? 'text-red-600 font-medium' : ''}>{task.due_date ? new Date(task.due_date).toLocaleDateString('he-IL') : 'N/A'}</span>
                     </div>
                 </div>

                 <div className="flex items-center justify-between pt-1 text-xs text-gray-500">
                     <div className="flex items-center gap-1" title={`משויך ל: ${task.assigned_to_name || 'לא משויך'}`}>
                         <Avatar className="h-5 w-5 border text-[10px]">
                             <AvatarImage src={task.assigned_to_avatar_url} alt={task.assigned_to_name} />
                             <AvatarFallback>{task.assigned_to_name?.charAt(0) || '?'}</AvatarFallback>
                         </Avatar>
                         <span className="truncate">{task.assigned_to_name || 'לא משויך'}</span>
                     </div>
                     {task.related_entity_type && (
                        <span className="text-gray-400 text-[10px]">{`קשור ל: ${task.related_entity_type} #${task.related_entity_id}`}</span>
                     )}
                 </div>

                 {/* Action Buttons */}
                 <div className="flex justify-end gap-1 pt-2">
                      {/* Complete/Reopen Button */}
                     {task.status !== 'הושלם' ? (
                        <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full hover:bg-green-100" title="סמן כהושלם">
                             <CheckSquare className="h-4 w-4 text-green-600" />
                         </Button>
                     ) : (
                        <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full hover:bg-yellow-100" title="פתח מחדש">
                             <Clock className="h-4 w-4 text-yellow-600" /> {/* Or Undo icon */}
                         </Button>
                     )}
                     <Link href={`/dashboard/tasks/edit/${task.id}`} passHref>
                         <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full hover:bg-blue-100" title="עריכה">
                             <Edit className="h-4 w-4 text-blue-600" />
                         </Button>
                     </Link>
                     {/* TODO: Add Delete confirmation */}
                     <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full hover:bg-red-100" title="מחיקה">
                         <Trash className="h-4 w-4 text-red-600" />
                     </Button>
                 </div>
             </CardContent>
         </Card>
     );

     // --- List View Row (Adapted for Tasks) ---
     const TaskListRow = ({ task }: { task: Task }) => (
        <tr className={`hover:bg-gray-50 border-b last:border-b-0 text-sm ${task.isOverdue ? 'bg-red-50/50' : ''}`}>
             <td className="px-3 py-2 whitespace-nowrap">
                <span className={`font-medium text-gray-800 truncate ${task.status === 'הושלם' ? 'line-through text-gray-500' : ''}`} title={task.title}>{task.title}</span>
             </td>
             <td className="px-3 py-2">
                 <Badge variant="secondary" className="text-xs" style={{ backgroundColor: `${task.statusColor}20`, color: task.statusColor }}>{task.status}</Badge>
             </td>
             <td className="px-3 py-2">
                 <div className="flex items-center gap-1" style={{ color: task.priorityColor }}>
                     {task.priorityIcon && <task.priorityIcon className="h-3.5 w-3.5"/>} {task.priority}
                 </div>
             </td>
             <td className={`px-3 py-2 text-gray-600 whitespace-nowrap ${task.isOverdue ? 'text-red-600 font-medium' : ''}`}> {task.due_date ? new Date(task.due_date).toLocaleDateString('he-IL') : '-'}</td>
             <td className="px-3 py-2 text-gray-600 whitespace-nowrap">
                <div className="flex items-center gap-1">
                    <Avatar className="h-5 w-5 border text-[10px]">
                        <AvatarImage src={task.assigned_to_avatar_url} alt={task.assigned_to_name} />
                        <AvatarFallback>{task.assigned_to_name?.charAt(0) || '?'}</AvatarFallback>
                    </Avatar>
                    <span>{task.assigned_to_name ?? '-'}</span>
                </div>
             </td>
             <td className="px-3 py-2 text-gray-600">{new Date(task.created_at).toLocaleDateString('he-IL')}</td>
             <td className="px-3 py-2 text-right">
                 <div className="flex justify-end items-center gap-1">
                     {task.status !== 'הושלם' ? (
                         <Button size="icon" variant="ghost" className="h-6 w-6 rounded hover:bg-green-100" title="השלם"><CheckSquare className="h-3.5 w-3.5 text-green-600" /></Button>
                     ) : (
                         <Button size="icon" variant="ghost" className="h-6 w-6 rounded hover:bg-yellow-100" title="פתח מחדש"><Clock className="h-3.5 w-3.5 text-yellow-600" /></Button>
                     )}
                      <Link href={`/dashboard/tasks/edit/${task.id}`} passHref>
                         <Button size="icon" variant="ghost" className="h-6 w-6 rounded hover:bg-blue-100" title="ערוך"><Edit className="h-3.5 w-3.5 text-blue-600" /></Button>
                      </Link>
                      <Button size="icon" variant="ghost" className="h-6 w-6 rounded hover:bg-red-100" title="מחק"><Trash className="h-3.5 w-3.5 text-red-600" /></Button>
                 </div>
             </td>
        </tr>
    );

    return (
        <div className="p-4 md:p-6 space-y-6" dir="rtl">
            {/* Header */}
            <div className="flex justify-between items-center">
                 <h1 className="text-2xl font-bold text-gray-800">ניהול משימות</h1>
                  <div className="flex items-center gap-2">
                       <Link href="/dashboard/tasks/create">
                           <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow-sm">
                               <Plus className="ml-1 h-4 w-4" />
                               צור משימה חדשה
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
                                 placeholder="חיפוש לפי כותרת, תיאור..."
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

                         {/* Priority Filter Dropdown */}
                         <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                                 <Button variant="outline" className="text-sm border-gray-200">
                                     עדיפות {filters.priority.length > 0 ? `(${filters.priority.length})` : ''}
                                     <ChevronDown className="mr-2 h-4 w-4" />
                                 </Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="start">
                                 {getDistinctValues('priority').map((priority) => (
                                     <DropdownMenuCheckboxItem
                                         key={priority}
                                         checked={filters.priority.includes(priority)}
                                         onCheckedChange={() => handleCheckboxFilterChange('priority', priority)}
                                     >
                                         {priority}
                                     </DropdownMenuCheckboxItem>
                                 ))}
                             </DropdownMenuContent>
                         </DropdownMenu>

                         {/* Assigned To Filter Dropdown */}
                         <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                                 <Button variant="outline" className="text-sm border-gray-200">
                                     משויך ל {filters.assignedTo.length > 0 ? `(${filters.assignedTo.length})` : ''}
                                     <ChevronDown className="mr-2 h-4 w-4" />
                                 </Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="start">
                                 {allUsers.map((user) => (
                                     <DropdownMenuCheckboxItem
                                         key={user.id}
                                         checked={filters.assignedTo.includes(user.id)}
                                         onCheckedChange={() => handleCheckboxFilterChange('assignedTo', user.id)}
                                     >
                                         <div className="flex items-center gap-2">
                                             <Avatar className="h-5 w-5 border text-[10px]">
                                                 <AvatarImage src={user.avatar_url} alt={user.name} />
                                                 <AvatarFallback>{user.name?.charAt(0) || '?'}</AvatarFallback>
                                             </Avatar>
                                             {user.name}
                                         </div>
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

                         {(filters.searchTerm || filters.status.length > 0 || filters.priority.length > 0 || filters.assignedTo.length > 0) && (
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
                     <p className="ml-3 text-purple-700">טוען משימות...</p>
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
                     {filteredTasks.length === 0 ? (
                         <div className="text-center py-10 text-gray-500">
                             <p>לא נמצאו משימות התואמות את הסינון.</p>
                         </div>
                     ) : viewMode === 'grid' ? (
                         // Grid View
                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                             {filteredTasks.map(task => <TaskGridCard key={task.id} task={task} />)}
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
                                              <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('priority')}>
                                                  <div className="flex items-center">עדיפות {renderSortIcon('priority')}</div>
                                              </th>
                                              <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('due_date')}>
                                                 <div className="flex items-center">תאריך יעד {renderSortIcon('due_date')}</div>
                                              </th>
                                              <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('assigned_to_id')}>
                                                   <div className="flex items-center">משויך ל {renderSortIcon('assigned_to_id')}</div>
                                               </th>
                                               <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('created_at')}>
                                                   <div className="flex items-center">תאריך יצירה {renderSortIcon('created_at')}</div>
                                               </th>
                                              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">פעולות</th>
                                         </tr>
                                     </thead>
                                      <tbody className="bg-white divide-y divide-gray-100">
                                          {filteredTasks.map(task => <TaskListRow key={task.id} task={task} />)}
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