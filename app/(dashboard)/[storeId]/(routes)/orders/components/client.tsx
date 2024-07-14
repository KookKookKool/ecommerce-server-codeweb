"use client";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { OrdersColumns, columns } from "./columns";
import ApiList from "@/components/api-list";
import { Timestamp } from "firebase/firestore";

interface OrdersClientProps {
  data: OrdersColumns[];
}

export const OrdersClient = ({ data }: OrdersClientProps) => {
  const params = useParams();
  const router = useRouter();

  // Function to convert Timestamp to Date
  const timestampToDate = (timestamp?: Timestamp | any): Date => {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    } else if (timestamp && typeof timestamp.seconds === "number" && typeof timestamp.nanoseconds === "number") {
      return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    } else {
      return new Date(0); // Default date if timestamp is invalid
    }
  };

  // Sort data by createdAt in descending order (latest first)
  const sortedData = [...data].sort((a, b) => {
    const dateA = timestampToDate(a.createdAt);
    const dateB = timestampToDate(b.createdAt);
    return dateA.getTime() - dateB.getTime();
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
