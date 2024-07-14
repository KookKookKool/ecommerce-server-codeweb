"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { CellAction } from "./cell-action";

export type ProductColumns = {
  id: string;
  name: string;
  price: string;
  Details: string;
  DetailsInfo: string;
  isFeatured: boolean;
  isArchived: boolean;
  category: string;
  size: string;
  // kitchen: string;
  // cuisine: string;
  images: { url: string }[];
  createdAt: string;
};

export const columns: ColumnDef<ProductColumns>[] = [
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
          Name
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
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "isFeatured",
    header: "Feature",
  },
  {
    accessorKey: "isArchived",
    header: "isArchived",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  // {
  //   accessorKey: "kitchen",
  //   header: "Kitchen",
  // },
  // {
  //   accessorKey: "cuisine",
  //   header: "Cuisine",
  // },
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
