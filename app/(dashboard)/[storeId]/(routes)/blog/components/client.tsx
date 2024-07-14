"use client";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { BlogColumns, columns } from "./columns";
import ApiList from "@/components/api-list";

interface BlogClientProps {
  data: BlogColumns[];
}

export const BlogClient = ({ data }: BlogClientProps) => {
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
          title={`blog (${sortedData.length})`}
          description="Manage blog for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/blog/create`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      <Separator />

      <DataTable searchKey="label" columns={columns} data={sortedData} />

      <Heading title="API" description="API calls for blog" />
      <Separator />
      <ApiList entityName="blog" entityNameId="blogId" />
    </>
  );
};
