"use client";

import { useParams, useRouter } from "next/navigation";
import { OrdersColumns } from "./columns";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreVertical, Trash } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { AlertModel } from "@/components/model/alert-model";

interface CellActionProps {
  data: OrdersColumns;
}

export const CellAction = ({ data }: CellActionProps) => {
  const router = useRouter();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = (id : string) => {
    navigator.clipboard.writeText(id)
    toast.success("Order Id copied")
  }

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(
        `/api/${params.storeId}/orders/${data.id}`
      );

      toast.success("Order deleted successfully");
      location.reload();
      router.push(`/${params.storeId}/orders`);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  const onUpdate = async (data: any) => {
    try {
      setIsLoading(true);

      await axios.patch(`/api/${params.storeId}/orders/${data.id}`, data);
      location.reload();
      router.push(`/${params.storeId}/orders`);
      toast.success("Order Updated");
    } catch (error) {
      toast.error("Something Went Wrong");
    } finally {
      router.refresh();
      setIsLoading(false);
    }
  };
  
  return (
    <div>
        <AlertModel 
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={isLoading} 
        />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-8 w-8 p-0" variant={"ghost"}>
            <span className="sr-only">Open</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Id
          </DropdownMenuItem>

          <DropdownMenuItem 
          onClick={() => 
            onUpdate({ id: data.id, order_status: "Processing"})
          }
          >
            <Edit className="h-4 w-4 mr-2" />
            Processing
          </DropdownMenuItem>

          <DropdownMenuItem 
          onClick={() => 
            onUpdate({ id: data.id, order_status: "Finish"})
          }
          >
            <Edit className="h-4 w-4 mr-2" />
            Finish
          </DropdownMenuItem>

          <DropdownMenuItem 
          onClick={() => 
            onUpdate({ id: data.id, order_status: "Cancel"})
          }
          >
            <Edit className="h-4 w-4 mr-2" />
            Cancel
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
