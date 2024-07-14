"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { CellAction } from "./cell-action";
import CellImage from "./cell-image";
import { cn } from "@/lib/utils";

export type OrdersColumns = {
  id: string;
  phone : string;
  address : string;
  products: string;
  totalPrice: string;
  images: string[];
  isPaid: boolean;
  createdAt: string;
  order_status : string;
  customerName: string; // เพิ่ม field สำหรับชื่อของลูกค้า
}

export const columns: ColumnDef<OrdersColumns>[] = [
  {
    accessorKey: "images",
    header : "Images",
    cell : ({row}) => (
      <div className="grid grid-cols-2 gap-2">
        <CellImage data={row.original.images} />
      </div>
    )
  },
  {
    accessorKey: "customerName",  // เพิ่ม column สำหรับชื่อของลูกค้า
    header: "Customer Name"
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const formattedPhone = row.original.phone && row.original.phone.startsWith("+66")
        ? row.original.phone.replace("+66", "0")
        : row.original.phone || "";
      return <p>{formattedPhone}</p>;
    }
  },
  
  {
    accessorKey: "address",
    header : "Address"
  },
  {
    accessorKey: "totalPrice",
    header : "Amount"
  },
  {
    accessorKey: "order_status",
    header: "Order status",
    cell : ({row}) => {
      const {order_status} = row.original

      return (
        <p className={cn("text-base font-semibold", 
          (order_status === "Finish" && "text-green-500") ||
          (order_status === "Cancel" && "text-red-500") ||
          (order_status === "Processing" && "text-yellow-500") 
        )}>
          {order_status}
        </p>
      )
    }
  },
  {
    accessorKey: "isPaid",
    header : "Payment Status",
    cell : ({row}) => {
      const {isPaid} = row.original;

      return (
        <p 
        className={cn(
          "text-lg font-semibold",
          isPaid ?  "text-emerald-500" : "text-red-500"
         )}
         >
        {isPaid ? "Paid" : "Not Paid"}
        </p>
      );
    },
  },

  {
    accessorKey: "products",
    header : "Products"
  },

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
