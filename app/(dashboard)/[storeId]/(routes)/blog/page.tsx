import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { format } from "date-fns";
import { BlogClient } from "./components/client";
import { db } from "@/lib/firebase";
import { Blog } from "@/types-db";
import { BlogColumns } from "./components/columns";


const BlogPage = async ({ params }: { params: { storeId: string } }) => {
  const blogData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "blog"))
  ).docs.map((doc) => doc.data()) as Blog[];

  const formattedBlog : BlogColumns[] = blogData.map(item => ({
      id : item.id,
      label : item.label,
      ContentLabel : item.ContentLabel,
      imageUrl : item.imageUrl,
      createdAt : item.createdAt ? format(item.createdAt.toDate(), "MMM do, yyyy") : "",
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BlogClient data={formattedBlog} />
      </div>
    </div>
  );
};

export default BlogPage;
