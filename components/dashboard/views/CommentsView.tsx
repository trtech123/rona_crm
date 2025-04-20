"use client";

import React, { useState, useMemo } from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    ColumnFiltersState,
    getFilteredRowModel,
    RowSelectionState,
    Table as TanstackTable,
    Row,
    Column
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
    ArrowUpDown,
    ChevronDown,
    MoreHorizontal,
    MessageSquare,
    Trash2,
    Reply,
    Link as LinkIcon,
    Bot,
    Sparkles,
    Copy,
    Share2,
    Mail,
    Phone,
    ArrowRight,
    ArrowLeft,
    Users
} from 'lucide-react';
import { Post, Response } from "@/lib/types";
import { PostPreview } from "@/components/dashboard/shared/PostPreview";
import { PostHoverCard } from "@/components/dashboard/shared/PostHoverCard";
import { DetailDialog } from "@/components/dashboard/shared/DetailDialog";

const placeholderPosts: Post[] = [
    { id: 1, type: "image", content: "דירת גן מרווחת למכירה בשכונה שקטה", date: "2024-07-20" },
    { id: 2, type: "text", content: "מימון משכנתא 101 - כל מה שצריך לדעת", date: "2024-07-15" },
];

const placeholderResponses: Response[] = [
    {
        id: 1,
        name: 'יוסי לוי',
        text: 'מעוניין בנכס, אפשר פרטים? הטלפון שלי 050-111222',
        platform: 'Facebook',
        date: '2024-07-28',
        post: placeholderPosts[0],
        status: 'לא נענה',
        convertedToLead: false,
        autoTag: 'מעוניין',
    },
    {
        id: 2,
        name: 'שרה כהן',
        text: 'האם המחיר גמיש? ומה לגבי כלב קטן? האם יש מעלית?',
        platform: 'Website',
        date: '2024-07-28',
        post: placeholderPosts[0],
        status: 'ידנית',
        convertedToLead: true,
        autoTag: 'שאלה',
    },
    {
        id: 3,
        name: 'אבי ישראלי',
        text: 'שאלה לגבי המאמר שפרסמתם על מימון, לא הבנתי את הנקודה על ריבית פריים',
        platform: 'Website',
        date: '2024-07-27',
        post: placeholderPosts[1],
        status: 'אוטומטית',
        convertedToLead: false,
        autoTag: 'שאלה',
    },
];

const deleteResponse = async (responseId: number) => {
  console.log(`Attempting to delete response: ${responseId}`);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log(`Response ${responseId} deleted (simulated).`);
  // In a real app, you'd likely return success/failure and handle state update
  return true;
};

const convertToLead = async (response: Response) => {
  console.log(`Attempting to convert response ${response.id} to lead:`, response);
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log(`Response ${response.id} converted to lead (simulated).`);
  // Update state or re-fetch data
  return { ...response, convertedToLead: true }; // Simulate updated object
};

const applyAutoResponse = async (responseId: number, templateName: string) => {
  console.log(`Applying template '${templateName}' to response ${responseId}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log(`Template '${templateName}' applied to response ${responseId} (simulated).`);
  return { status: 'אוטומטית' }; // Simulate status change
};

const bulkDeleteResponses = async (responseIds: number[]) => {
  console.log(`Attempting to bulk delete responses: ${responseIds.join(', ')}`);
  await new Promise(resolve => setTimeout(resolve, 700));
  console.log(`Responses ${responseIds.join(', ')} deleted (simulated).`);
  return true;
};

const bulkConvertToLeads = async (responses: Response[]) => {
  console.log(`Attempting to bulk convert responses to leads: ${responses.map(r => r.id).join(', ')}`);
  await new Promise(resolve => setTimeout(resolve, 700));
  console.log(`Responses ${responses.map(r => r.id).join(', ')} converted to leads (simulated).`);
  return responses.map(r => ({ ...r, convertedToLead: true }));
};

const bulkApplyAutoResponse = async (responseIds: number[], templateName: string) => {
  console.log(`Applying template '${templateName}' to responses: ${responseIds.join(', ')}`);
  await new Promise(resolve => setTimeout(resolve, 700));
  console.log(`Template '${templateName}' applied to responses ${responseIds.join(', ')} (simulated).`);
  return responseIds.map(id => ({ id, status: 'אוטומטית' })); // Simulate status change for multiple
};

const CommentsView = () => {
    const [data, setData] = useState<Response[]>(placeholderResponses);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [selectedResponse, setSelectedResponse] = useState<Response | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const handleRowClick = (response: Response) => {
        setSelectedResponse(response);
        setIsDetailOpen(true);
    };

    const closeDetailDialog = () => {
        setIsDetailOpen(false);
        setSelectedResponse(null);
    };

    const handleDelete = async (responseId: number) => {
      if (!confirm(`האם אתה בטוח שברצונך למחוק תגובה ${responseId}?`)) return;
      const success = await deleteResponse(responseId);
      if (success) {
        setData(currentData => currentData.filter(r => r.id !== responseId));
        // Optionally clear selection if the deleted row was selected
        setRowSelection(currentSelection => {
           const newSelection = {...currentSelection};
           // Find the index of the row corresponding to responseId in the original data (or table state)
           // This part is tricky without table instance access here. Let's assume we refetch or handle this better.
           // delete newSelection[rowIndex]; // Simplified placeholder
           return newSelection;
        });
      }
      // TODO: Add user feedback (toast notification)
    };

    const handleConvertToLead = async (response: Response) => {
        const updatedResponse = await convertToLead(response);
        setData(currentData => currentData.map(r => r.id === updatedResponse.id ? updatedResponse : r));
         // TODO: Add user feedback (toast notification)
    };

    const handleApplyAutoResponse = async (responseId: number, templateName: string) => {
        const updateResult = await applyAutoResponse(responseId, templateName);
        setData(currentData => currentData.map(r => r.id === responseId ? { ...r, status: updateResult.status } : r));
        // TODO: Add user feedback (toast notification)
    };

    const handleBulkDelete = async () => {
        const selectedIds = table.getSelectedRowModel().rows.map(row => row.original.id);
        if (selectedIds.length === 0) return;
        if (!confirm(`האם אתה בטוח שברצונך למחוק ${selectedIds.length} תגובות נבחרות?`)) return;

        const success = await bulkDeleteResponses(selectedIds);
        if (success) {
            setData(currentData => currentData.filter(r => !selectedIds.includes(r.id)));
            setRowSelection({}); // Clear selection
            // TODO: Add user feedback
        }
    };

     const handleBulkConvertToLead = async () => {
        const selectedResponses = table.getSelectedRowModel().rows.map(row => row.original);
        if (selectedResponses.length === 0) return;
        if (!confirm(`האם אתה בטוח שברצונך להפוך ${selectedResponses.length} תגובות נבחרות ללידים?`)) return;

        const updatedResponses = await bulkConvertToLeads(selectedResponses);
        setData(currentData => currentData.map(r => {
             const updated = updatedResponses.find(ur => ur.id === r.id);
             return updated ? updated : r;
        }));
        setRowSelection({}); // Clear selection
         // TODO: Add user feedback
     };

     const handleBulkApplyAutoResponse = async (templateName: string) => {
        const selectedIds = table.getSelectedRowModel().rows.map(row => row.original.id);
        if (selectedIds.length === 0) return;

        const updateResults = await bulkApplyAutoResponse(selectedIds, templateName);
         setData(currentData => currentData.map(r => {
            const updated = updateResults.find(ur => ur.id === r.id);
            return updated ? { ...r, status: updated.status } : r;
        }));
        setRowSelection({}); // Clear selection
         // TODO: Add user feedback
     };

    const columns: ColumnDef<Response>[] = [
        {
            id: "select",
            header: ({ table }: { table: TanstackTable<Response> }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="בחר הכל"
                    className="translate-y-[2px] mr-2"
                />
            ),
            cell: ({ row }: { row: Row<Response> }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="בחר שורה"
                    className="translate-y-[2px] mr-2"
                    onClick={(e) => e.stopPropagation()}
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: ({ column }: { column: Column<Response, unknown> }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="px-1"
                >
                    שם מגיב
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                </Button>
            ),
             cell: ({ row }: { row: Row<Response> }) => <div>{row.getValue("name")}</div>,
        },
        {
            accessorKey: "text",
            header: "תגובה",
            cell: ({ row }: { row: Row<Response> }) => <div className="truncate max-w-xs" title={row.getValue("text") as string}>{row.getValue("text")}</div>,
        },
        {
            accessorKey: "platform",
            header: "פלטפורמה",
            cell: ({ row }: { row: Row<Response> }) => <Badge variant="outline">{row.getValue("platform")}</Badge>,
        },
         {
            accessorKey: "date",
            header: ({ column }: { column: Column<Response, unknown> }) => (
                 <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                     className="px-1"
                >
                    תאריך
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }: { row: Row<Response> }) => (
                <div>{new Date(row.getValue("date") as string).toLocaleDateString('he-IL')}</div>
            ),
        },
        {
            accessorKey: "post",
            header: "פוסט",
            cell: ({ row }: { row: Row<Response> }) => {
                const post = row.getValue("post") as Post;
                return (
                    <PostHoverCard post={post}>
                        <PostPreview post={post} size="small" />
                    </PostHoverCard>
                );
            },
        },
        {
            accessorKey: "status",
            header: "סטטוס תגובה",
            cell: ({ row }: { row: Row<Response> }) => {
                const status = row.getValue("status") as string;
                 let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
                 if (status === 'ידנית') { variant = "default"; }
                 if (status === 'אוטומטית') { variant = "secondary"; }
                return <Badge variant={variant}>{status}</Badge>;
            },
        },
         {
            accessorKey: "convertedToLead",
            header: "הפך לליד",
            cell: ({ row }: { row: Row<Response> }) => (
                 row.getValue("convertedToLead") ? (
                    <Badge variant="secondary">
                        <a href="#" className="underline" onClick={(e) => e.stopPropagation()}>כן</a>
                    </Badge>
                ) : "לא"
            ),
        },
        {
            accessorKey: "autoTag",
            header: "תג אוטומטי",
            cell: ({ row }: { row: Row<Response> }) => {
                 const tag = row.getValue("autoTag") as string;
                 let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
                 if (tag === 'שאלה') { variant = "default"; }
                 if (tag === 'שלילי') { variant = "destructive"; }
                 return <Badge variant={variant}>{tag}</Badge>;
            },
        },
        {
            id: "actions",
             header: "פעולות",
             enableHiding: false,
            cell: ({ row }: { row: Row<Response> }) => {
                const response = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">פתח תפריט</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>פעולות מהירות</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleRowClick(response)}>
                                <MessageSquare className="ml-2 h-4 w-4"/> צפה/השב
                            </DropdownMenuItem>
                            {!response.convertedToLead && (
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleConvertToLead(response); }}>
                                <Users className="ml-2 h-4 w-4"/> הפוך לליד
                              </DropdownMenuItem>
                            )}
                             <DropdownMenuSub>
                                 <DropdownMenuSubTrigger onClick={(e) => e.stopPropagation()}>
                                     <Bot className="ml-2 h-4 w-4" /> מענה אוטומטי
                                 </DropdownMenuSubTrigger>
                                 <DropdownMenuSubContent>
                                     <DropdownMenuLabel>בחר תבנית</DropdownMenuLabel>
                                     <DropdownMenuSeparator />
                                     <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleApplyAutoResponse(response.id, 'בקשת פרטים'); }}>בקשת פרטים</DropdownMenuItem>
                                     <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleApplyAutoResponse(response.id, 'תיאום שיחה'); }}>תיאום שיחה</DropdownMenuItem>
                                     <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleApplyAutoResponse(response.id, 'הזמנה לפגישה'); }}>הזמנה לפגישה</DropdownMenuItem>
                                      <DropdownMenuItem className="text-red-600" onClick={(e) => { e.stopPropagation(); handleApplyAutoResponse(response.id, 'בטל מענה'); }}>בטל מענה</DropdownMenuItem>
                                 </DropdownMenuSubContent>
                             </DropdownMenuSub>
                            <DropdownMenuSeparator />
                             <DropdownMenuItem onClick={(e) => { e.stopPropagation(); alert('מעתיק קישור...'); }}>
                                <LinkIcon className="ml-2 h-4 w-4"/> העתק קישור לתגובה
                            </DropdownMenuItem>
                             <DropdownMenuItem onClick={(e) => { e.stopPropagation(); alert('משתף...'); }}>
                                <Share2 className="ml-2 h-4 w-4"/> שתף
                            </DropdownMenuItem>
                             <DropdownMenuItem
                               className="text-red-600 focus:text-red-700 focus:bg-red-50"
                               onClick={(e) => { e.stopPropagation(); handleDelete(response.id); }}
                             >
                               <Trash2 className="ml-2 h-4 w-4"/> מחק תגובה
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        enableRowSelection: true,
        state: {
            sorting,
            columnFilters,
            rowSelection,
        },
        initialState: {
            pagination: {
                 pageSize: 10,
            },
        },
        getRowId: row => String(row.id),
    });

    return (
        <div className="w-full space-y-4">
             <Card className="shadow-sm border border-gray-100 rounded-xl">
                 <CardHeader className="p-4 md:p-5">
                     <CardTitle className="text-lg">ניהול תגובות ({table.getFilteredRowModel().rows.length})</CardTitle>
                 </CardHeader>
                 <CardContent className="p-4 md:p-5 pt-0">
                    <div className="flex items-center justify-between py-4 gap-2 flex-wrap">
                        <Input
                            placeholder="חפש לפי שם או טקסט..."
                            onChange={(event) => {
                                const value = event.target.value;
                                table.getColumn("name")?.setFilterValue(value);
                            }}
                            className="max-w-sm h-9"
                        />
                         <div className="flex items-center gap-2">
                             {table.getFilteredSelectedRowModel().rows.length > 0 && (
                                <DropdownMenu>
                                     <DropdownMenuTrigger asChild>
                                         <Button variant="outline" className="h-9">
                                             פעולות ({table.getFilteredSelectedRowModel().rows.length}) <ChevronDown className="mr-2 h-4 w-4" />
                                         </Button>
                                     </DropdownMenuTrigger>
                                     <DropdownMenuContent align="end">
                                         <DropdownMenuLabel>פעולות גורפות</DropdownMenuLabel>
                                         <DropdownMenuItem onClick={() => alert('Marking as read...')}>סמן כנקרא</DropdownMenuItem>
                                         <DropdownMenuItem onClick={handleBulkConvertToLead}>הפוך ללידים</DropdownMenuItem>
                                         <DropdownMenuSub>
                                             <DropdownMenuSubTrigger>החל מענה אוטומטי</DropdownMenuSubTrigger>
                                             <DropdownMenuSubContent>
                                                  <DropdownMenuItem onClick={() => handleBulkApplyAutoResponse('בקשת פרטים')}>בקשת פרטים</DropdownMenuItem>
                                                  <DropdownMenuItem onClick={() => handleBulkApplyAutoResponse('תיאום שיחה')}>תיאום שיחה</DropdownMenuItem>
                                             </DropdownMenuSubContent>
                                         </DropdownMenuSub>
                                          <DropdownMenuSeparator />
                                         <DropdownMenuItem className="text-red-600" onClick={handleBulkDelete}>מחק נבחרים</DropdownMenuItem>
                                     </DropdownMenuContent>
                                 </DropdownMenu>
                            )}
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="ml-auto h-9">
                                        סינון עמודות <ChevronDown className="mr-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {table
                                        .getAllColumns()
                                        .filter((column: Column<Response, unknown>) => column.getCanHide())
                                        .map((column: Column<Response, unknown>) => {
                                            const columnLabels: Record<string, string> = {
                                                name: 'שם מגיב',
                                                text: 'תגובה',
                                                platform: 'פלטפורמה',
                                                date: 'תאריך',
                                                post: 'פוסט',
                                                status: 'סטטוס תגובה',
                                                convertedToLead: 'הפך לליד',
                                                autoTag: 'תג אוטומטי'
                                            };
                                            return (
                                                <DropdownMenuCheckboxItem
                                                    key={column.id}
                                                    className="capitalize"
                                                    checked={column.getIsVisible()}
                                                    onCheckedChange={(value) =>
                                                        column.toggleVisibility(!!value)
                                                    }
                                                >
                                                    {columnLabels[column.id] ?? column.id}
                                                </DropdownMenuCheckboxItem>
                                            );
                                        })}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id} className="bg-gray-50">
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id} className="px-2 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                            onClick={() => handleRowClick(row.original)}
                                            className="cursor-pointer hover:bg-muted/50"
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="px-2 py-2 whitespace-nowrap text-sm text-gray-800">
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center text-gray-500"
                                        >
                                            לא נמצאו תגובות.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex items-center justify-between pt-4 gap-2 flex-wrap" dir="ltr">
                         <div className="flex-1 text-sm text-muted-foreground text-right">
                             נבחרו {table.getFilteredSelectedRowModel().rows.length} מתוך{" "}
                             {table.getFilteredRowModel().rows.length} שורות.
                         </div>
                         <div className="flex items-center gap-2">
                             <span className="text-sm">עמוד {table.getState().pagination.pageIndex + 1} מתוך {table.getPageCount()}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">לעמוד הראשון</span>
                                <ArrowRight className="h-4 w-4" />
                             </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">עמוד קודם</span>
                                <ChevronDown className="h-4 w-4 rotate-90" />
                             </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                               <span className="sr-only">עמוד הבא</span>
                               <ChevronDown className="h-4 w-4 -rotate-90" />
                             </Button>
                             <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                            >
                               <span className="sr-only">לעמוד האחרון</span>
                                <ArrowLeft className="h-4 w-4" />
                             </Button>
                        </div>
                    </div>
                 </CardContent>
             </Card>
             <DetailDialog 
                item={selectedResponse} 
                isOpen={isDetailOpen} 
                onClose={closeDetailDialog} 
            />
        </div>
    );
};

export default CommentsView; 