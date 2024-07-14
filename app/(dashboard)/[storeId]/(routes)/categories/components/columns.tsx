"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { CellAction } from "./cell-action";

export type CategoryColumns = {
  id: string;
  name: string;
  billboardLabel: string;
  imageUrl: string;
  createdAt: string;
};

export const columns: ColumnDef<CategoryColumns>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
          className="flex items-center"
        >
          Category
          <ArrowUpDown
            className={`ml-2 h-4 w-4 transition-transform duration-200 ${
              isSorted === "asc" ? "rotate-0" : "rotate-180"
            }`}
          />
        </Button>
      );
    },
  },
  {
    accessorKey: "billboardLabel",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
          className="flex items-center"
        >
          Billboard
          <ArrowUpDown
            className={`ml-2 h-4 w-4 transition-transform duration-200 ${
              isSorted === "asc" ? "rotate-0" : "rotate-180"
            }`}
          />
        </Button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
          className="flex items-center"
        >
          Date
          <ArrowUpDown
            className={`ml-2 h-4 w-4 transition-transform duration-200 ${
              isSorted === "asc" ? "rotate-0" : "rotate-180"
            }`}
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return <span>{date}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
