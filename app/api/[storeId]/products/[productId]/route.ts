import { db, storage } from "@/lib/firebase";
import { Product, Size } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request, { params }: { params: { storeId: string; productId: string } }) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    const { 
      name,
      price,
      Details,
      DetailsInfo,
      images,
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

    const productRef = doc(db, "stores", params.storeId, "products", params.productId);

    if (!(await getDoc(productRef)).exists()) {
      return new NextResponse("Product not found", { status: 404 });
    }

    await updateDoc(productRef, {
      name,
      price,
      Details,
      DetailsInfo,
      images,
      isFeatured,
      isArchived,
      category,
      size,
      updatedAt: serverTimestamp(),
    });

    const updatedProduct = (await getDoc(productRef)).data() as Product;

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.log(`PRODUCT_PATCH: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    if (!params.storeId || !params.productId) {
      return new NextResponse("Store Id or Product Id is missing", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (!store.exists() || store.data()?.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 500 });
    }

    const productRef = doc(db, "stores", params.storeId, "products", params.productId);

    const productDoc = await getDoc(productRef);
    if (!productDoc.exists()) {
      return new NextResponse("Product not found", { status: 404 });
    }
    
    const images = productDoc.data()?.images;

    if (images && Array.isArray(images)) {
      await Promise.all(
        images.map(async (image) => {
          const imageRef = ref(storage, image.url);
          await deleteObject(imageRef);
        })
      );
    }

    await deleteDoc(productRef);

    return NextResponse.json({ msg: "Product and associated images deleted" });
  } catch (error) {
    console.log(`PRODUCT_DELETE: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};


export const GET = async (
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Store Id is missing", { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse("Product Id is missing", { status: 400 });
    }

    const product = (
      await getDoc(
        doc(db, "stores", params.storeId, "products", params.productId)
      )
    ).data() as Product;

    return NextResponse.json(product);
  } catch (error) {
    console.log(`PRODUCT_GET: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
