"use client";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {  CuisineColumns, columns } from "./columns";
import ApiList from "@/components/api-list";

interface CuisineClientProps {
  data : CuisineColumns[];
}

export const CuisineClient = ({ data }: CuisineClientProps) => {
  const params = useParams();
  const router = useRouter();

  return (
  <>
    <div className="flex items-center justify-between">
      <Heading
        title={`Cuisines (${data.length})`}
        description="Manage cuisine for you store"
      />
      <Button onClick={() => router.push(`/${params.storeId}/cuisines/create`)}>
        <Plus className="mr-2 h-4 w-4" />
        Add New
      </Button>
    </div>

    <Separator />

    <DataTable searchKey="name" columns={columns} data={data} />

    <Heading title="API" description="API calls for kitchens" />
    <Separator />
    <ApiList entityName="cuisines" entityNameId="cuisineId" />
  </>
  );
};
