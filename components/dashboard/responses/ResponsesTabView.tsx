import React, { useState } from "react"
import { DataTable } from "../shared/DataTable"
import { DetailDialog } from "../shared/DetailDialog"
import type { Response } from "@/lib/temp_types"
import { mockResponses } from "@/lib/mock-data"
import { type ColumnDef, type Row } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

// Column definitions for Responses (Reversed Order for RTL)
const getResponseColumns = (onActionClick: (response: Response, action: string) => void): ColumnDef<Response>[] => [
  {
    accessorKey: "name",
    header: "שם",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "text",
    header: "תוכן",
    cell: ({ row }) => <div className="truncate max-w-[200px]">{row.getValue("text")}</div>,
  },
  {
    accessorKey: "platform",
    header: "פלטפורמה",
    cell: ({ row }) => <Badge variant="outline">{row.getValue("platform")}</Badge>,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        תאריך
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{new Date(row.getValue("date")).toLocaleString('he-IL')}</div>,
  },
  {
    accessorKey: "status",
    header: "סטטוס טיפול",
    cell: ({ row }) => (
      <Badge variant={row.getValue("status") === 'ידנית' ? 'default' : row.getValue("status") === 'אוטומטית' ? 'secondary' : 'outline'}>
        {row.getValue("status")}
      </Badge>
    ),
  },
  {
    accessorKey: "convertedToLead",
    header: "הפך לליד",
    cell: ({ row }) => <div>{row.getValue("convertedToLead") ? 'כן' : 'לא'}</div>,
  },
  {
    accessorKey: "autoTag",
    header: "תג אוטומטי",
    cell: ({ row }) => (
      <Badge variant={row.getValue("autoTag") === 'שאלה' ? 'default' : row.getValue("autoTag") === 'מעוניין' ? 'secondary' : 'destructive'}>
        {row.getValue("autoTag")}
      </Badge>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const response = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>פעולות</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onActionClick(response, 'copyId')}>
              העתק ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onActionClick(response, 'viewDetails')}>
              צפה בפרטים
            </DropdownMenuItem>
            {!response.convertedToLead && (
              <DropdownMenuItem onClick={() => onActionClick(response, 'convertToLead')}>
                הפוך לליד
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
  // Select column moved to the end for RTL
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
]

export function ResponsesTabView() {
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleRowClick = (row: Row<Response>) => {
    setSelectedResponse(row.original)
    setIsDialogOpen(true)
  }

  const handleActionClick = (response: Response, action: string) => {
    console.log(`Action: ${action} on response:`, response)
    setSelectedResponse(response) // Set the response for context
    if (action === 'viewDetails') {
      setIsDialogOpen(true) // Open dialog for view details
    }
    if (action === 'copyId') {
      navigator.clipboard.writeText(response.id.toString())
      // Add user feedback (e.g., toast)
    }
    if (action === 'convertToLead') {
      // Implement logic to convert response to lead
      console.log("Convert to lead action triggered for response ID:", response.id)
      alert(`TODO: Implement convert response ${response.id} to lead.`) // Placeholder
    }
  }

  const columns = getResponseColumns(handleActionClick);

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={mockResponses} onRowClick={handleRowClick} />
      <DetailDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        item={selectedResponse}
        itemType="response"
        // Pass any response-specific props needed by DetailDialog here
      />
    </div>
  )
} 