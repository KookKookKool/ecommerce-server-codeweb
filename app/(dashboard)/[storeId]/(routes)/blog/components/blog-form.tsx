"use client";

import { Blog } from "@/types-db";
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
import ImageUpload from "@/components/blog-image-upload";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "@/lib/firebase";
import dynamic from 'next/dynamic';
import "react-quill/dist/quill.snow.css";

// Load Quill dynamically to avoid SSR issues
const QuillEditor = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

interface BlogFormProps {
  initialData: Blog;
}

const formSchema = z.object({
  label: z.string().min(1),
  ContentLabel: z.string().min(1),
  imageUrl: z.string().min(1),
});

const BlogForm = ({ initialData }: BlogFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();

  const title = initialData?.id ? "Edit blog" : "Create blog";
  const description = initialData ? "Edit a blog" : "Add a new blog";
  const toastMessage = initialData
    ? "blog updated successfully"
    : "blog created successfully";
  const action = initialData ? "Save Changes" : "Create blog";

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/blog/${params.blogId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/blog`, data);
      }
      toast.success(toastMessage);
      router.push(`/${params.storeId}/blog`);
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
      const { imageUrl } = form.getValues();
      await deleteObject(ref(storage, imageUrl)).then(async () => {
        await axios.delete(`/api/${params.storeId}/blog/${params.blogId}`);
      });
      toast.success("Blog deleted successfully");
      router.refresh();
      router.push(`/${params.storeId}/blog`);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']  // remove formatting button
    ]
  };
  
  const formats = [
    'font', 'size', 'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image', 'align',
    'color', 'background'
  ];
  
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
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>blog Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ? [field.value] : []}
                      disabled={isLoading}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Your blog name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ContentLabel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <QuillEditor
                      value={field.value}
                      onChange={field.onChange}
                      theme="snow"
                      placeholder="Your Content"
                      modules={modules}
                      formats={formats}
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

export default BlogForm;
