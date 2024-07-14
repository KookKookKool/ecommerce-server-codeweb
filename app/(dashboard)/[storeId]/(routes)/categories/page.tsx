import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { format } from "date-fns";
import { CategoryClient } from "./components/client";
import { db } from "@/lib/firebase";
import {  Category } from "@/types-db";
import {  CategoryColumns } from "./components/columns";


const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  const CategoriesData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "categories"))
  ).docs.map((doc) => doc.data()) as Category[];

  const formattedCategories : CategoryColumns[] = CategoriesData.map(item => ({
      id : item.id,
      name : item.name,
      billboardLabel : item.billboardLabel,
      createdAt : item.createdAt 
      ? format(item.createdAt.toDate(), "MMM do, yyyy") 
      : "",
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
