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
  data : BlogColumns[];
}

export const BlogClient = ({ data }: BlogClientProps) => {
  const params = useParams();
  const router = useRouter();

  return (
  <>
    <div className="flex items-center justify-between">
      <Heading
        title={`blog (${data.length})`}
        description="Manage blog for you store"
      />
      <Button onClick={() => router.push(`/${params.storeId}/blog/create`)}>
        <Plus className="mr-2 h-4 w-4" />
        Add New
      </Button>
    </div>

    <Separator />

    <DataTable searchKey="label" columns={columns} data={data} />

    <Heading title="API" description="API calls for blog" />
    <Separator />
    <ApiList entityName="blog" entityNameId="blogId" />
  </>
  );
};
