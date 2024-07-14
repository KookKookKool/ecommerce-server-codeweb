import { db } from "@/lib/firebase";
import { Product } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
  getDocs,
  where,
  query,
  and,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    const {
      name,
      price,
      images,
      Details,
      DetailsInfo,
      isFeatured,
      isArchived,
      category,
      size,
    } = body;

    if (!name || !images?.length || !Details || !DetailsInfo || !category || !price) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is missing", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (!store.exists() || store.data()?.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 500 });
    }

    const productData = {
      name,
      price,
      Details,
      DetailsInfo,
      images,
      isFeatured,
      isArchived,
      category,
      size,
      createdAt: serverTimestamp(),
    };

    const productRef = await addDoc(
      collection(db, "stores", params.storeId, "products"),
      productData
    );

    await updateDoc(doc(db, "stores", params.storeId, "products", productRef.id), {
      id: productRef.id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ id: productRef.id, ...productData });
  } catch (error) {
    console.log(`PRODUCT_POST: ${error}`);
    return new NextResponse(`Internal Server Error: ${error}`, { status: 500 });
  }
};


export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Store Id is missing", { status: 400 });
    }

    const { searchParams } = new URL(req.url);

    const productRef = collection(
      db,
      "stores",
      params.storeId,
      "products"
    );

    let queryConstraints = [];

    if (searchParams.has("size")) {
      queryConstraints.push(where("size", "==", searchParams.get("size")));
    }

    if (searchParams.has("category")) {
      queryConstraints.push(
        where("category", "==", searchParams.get("category"))
      );
    }

    if (searchParams.has("isFeatured")) {
      queryConstraints.push(
        where("isFeatured", "==", searchParams.get("isFeatured") === "true")
      );
    }

    if (searchParams.has("isArchived")) {
      queryConstraints.push(
        where("isArchived", "==", searchParams.get("isArchived") === "true")
      );
    }

    const productQuery = queryConstraints.length > 0
      ? query(productRef, ...queryConstraints)
      : query(productRef);

    const querySnapshot = await getDocs(productQuery);

    const productsData: Product[] = querySnapshot.docs.map(doc => doc.data() as Product);

    return NextResponse.json(productsData);

  } catch (error) {
    console.log(`PRODUCT_GET: ${error}`);
    return new NextResponse(`Internal Server Error: ${error}`, { status: 500 });
  }
};
