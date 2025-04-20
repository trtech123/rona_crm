import React, { useState } from "react"
import { DataTable } from "../shared/DataTable"
import { DetailDialog } from "../shared/DetailDialog"
import type { Lead } from "@/lib/temp_types"
import { mockLeads } from "@/lib/mock-data"
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

// Column definitions (moved outside component for clarity)
const getLeadColumns = (onActionClick: (lead: Lead, action: string) => void): ColumnDef<Lead>[] => [
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        שם מלא
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("fullName")}</div>,
  },
  {
    accessorKey: "email",
    header: "אימייל",
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phone",
    header: "טלפון",
    cell: ({ row }) => <div>{row.getValue("phone")}</div>,
  },
  {
    accessorKey: "source",
    header: "מקור",
    cell: ({ row }) => <div>{row.getValue("source")}</div>,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        תאריך
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{new Date(row.getValue("date")).toLocaleDateString('he-IL')}</div>,
  },
  {
    accessorKey: "status",
    header: "סטטוס",
    cell: ({ row }) => (
      <Badge variant={row.getValue("status") === "חדש" ? "default" : row.getValue("status") === "פתוח" ? "secondary" : "outline"}>
        {row.getValue("status")}
      </Badge>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const lead = row.original
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
            <DropdownMenuItem onClick={() => onActionClick(lead, 'copyId')}>
              העתק ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onActionClick(lead, 'viewDetails')}>
              צפה בפרטים
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onActionClick(lead, 'editLead')}>
              ערוך ליד
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
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

export function LeadsTabView() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleRowClick = (row: Row<Lead>) => {
    setSelectedLead(row.original)
    setIsDialogOpen(true)
  }

  const handleActionClick = (lead: Lead, action: string) => {
    console.log(`Action: ${action} on lead:`, lead)
    setSelectedLead(lead) // Set the lead for context
    if (action === 'viewDetails' || action === 'editLead') {
      setIsDialogOpen(true) // Open dialog for view/edit
    }
    if (action === 'copyId') {
      navigator.clipboard.writeText(lead.id.toString())
      // Add some user feedback here (e.g., toast message)
    }
    // Handle other actions like 'editLead' appropriately
  }

  const columns = getLeadColumns(handleActionClick);

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={mockLeads} onRowClick={handleRowClick} />
      <DetailDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        item={selectedLead}
        itemType="lead"
      />
    </div>
  )
} 