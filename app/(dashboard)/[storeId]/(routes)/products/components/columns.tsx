"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { CellAction } from "./cell-action";

export type ProductColumns = {
  id : string,
  name : string,
  price : string,
  Details : string,
  isFeatured : boolean,
  isArchived : boolean,
  category : string,
  size : string,
  // kitchen : string,
  // cuisine : string,
  images : {url : string}[],
  createdAt : string;
}

export const columns: ColumnDef<ProductColumns>[] = [

  {
    accessorKey: "name",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    accessorKey: "price",
    header : "Price"
  },
  {
    accessorKey: "isFeatured",
    header : "Feature"
  },
  {
    accessorKey: "isArchived",
    header : "isArchived"
  },
  {
    accessorKey: "category",
    header : "Category"
  },
  {
    accessorKey: "size",
    header : "Size"
  },
  // {
  //   accessorKey: "kitchen",
  //   header : "Kitchen"
  // },
  // {
  //   accessorKey: "cuisine",
  //   header : "Cuisine"
  // },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  }
]
