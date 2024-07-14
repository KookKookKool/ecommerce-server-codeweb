"use client";

import { Store } from "@/types-db";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import toast from "react-hot-toast";
import { AlertModel } from "@/components/model/alert-model";
import { ApiAlert } from "@/components/api-alert";
import { useOrigin } from "@/hooks/use-origin";

interface SettingsFormProps {
  initialData: Store;
}

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Store name should be minimum 3 characters" }),
});

export const SettingsForm = ({ initialData }: SettingsFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
        setIsLoading(true);
  
        const response = await axios.patch(`/api/stores/${params.storeId}`, data);
        toast.success("Store update successfully");
            router.refresh();
      } catch (error) {
        toast.error("Something went wrong");
      } finally {
        setIsLoading(false);
      }
  };

  const onDelete = async () => {
    try {
        setIsLoading(true);
  
        const response = await axios.delete(`/api/stores/${params.storeId}`);
        toast.success("Store deleted successfully");
        router.refresh();
        router.push("/");
      } catch (error) {
        toast.error("Something went wrong");
      } finally {
        setIsLoading(false);
        setOpen(false);
      }
  }

  return (
    <div>
        <AlertModel 
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={isLoading}
        />
      <div className="flex items-center justify-center">
        <Heading title="Settings" description="Manage your store." />
        <Button variant={"destructive"} size={"icon"} onClick={() => setOpen(true)}>
          <Trash className="w-4 h-4" />
        </Button>
      </div>

      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 pt-4 pb-4">
          <div className="grid grid-col-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={isLoading}
            type="submit"
            size={"sm"}
          >
            Save Changes
          </Button>
        </form>
      </Form>

      <Separator className="mb-4"/>
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </div>
  );
};
