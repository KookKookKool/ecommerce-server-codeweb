import { db } from "@/lib/firebase";
import { Blog } from "@/types-db";
import { doc, getDoc } from "firebase/firestore";
import { BlogForm } from "../components/blog-form";

const BlogPage = async ({
  params,
}: {
  params: { storeId: string; blogId: string };
}) => {

    const blog = (await getDoc(doc(db, "stores", params.storeId, "blog", params.blogId))).data() as Blog;

  return (
  <div className="flex-col">
    <div className="flex-1 space-y-4 p-8 pt-6">
    <BlogForm initialData={blog} />
    </div>
    </div>
  );
};

export default BlogPage;
