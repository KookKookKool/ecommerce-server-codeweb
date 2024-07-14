"use client";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { OrdersColumns, columns } from "./columns";

interface OrdersClientProps {
  data: OrdersColumns[];
}

export const OrdersClient = ({ data }: OrdersClientProps) => {
  const params = useParams();
  const router = useRouter();

  // Sort data by createdAt in descending order (latest first)
  const sortedData = [...data].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Orders (${sortedData.length})`}
          description="Manage orders for your store"
        />
      </div>

      <Separator />
      <DataTable searchKey="name" columns={columns} data={sortedData} />
    </>
  );
};
