"use client";

import { Cuisine } from "@/types-db";
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

interface CuisineFormProps {
  initialData: Cuisine;
}

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

export const CuisineForm = ({ initialData }: CuisineFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();

  const title = initialData?.id ? "Edit Cuisine" : "Create Cuisine";
  const description = initialData ? "Edit a Cuisine" : "Add a new Cuisine";
  const toastMessage = initialData
    ? "Cuisine updated successfully"
    : "Cuisine created successfully";
  const action = initialData ? "Save Changes" : "Create Cuisine";

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      console.log(data);

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/cuisines/${params.cuisineId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/cuisines`, data);
      }
      toast.success(toastMessage);
      router.push(`/${params.storeId}/cuisines`);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      router.refresh();
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/${params.storeId}/cuisines/${params.cuisineId}`);

      toast.success("Cuisine deleted successfully");
      router.refresh();
      router.push(`/${params.storeId}/cuisines`);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      router.refresh();
      setIsLoading(false);
      setOpen(false);
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
      <div className="flex items-center justify-center">
        <Heading title={title} description={description} />
        {initialData?.id && (
          <Button
            disabled={isLoading}
            variant={"destructive"}
            size={"icon"}
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6 pt-4 pb-4"
        >
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
                      placeholder="Your Cuisine name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Your Cuisine value..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} type="submit" size={"sm"}>
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
};