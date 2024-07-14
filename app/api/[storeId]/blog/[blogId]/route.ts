import { db } from "@/lib/firebase";
import { Blog } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import { deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request, { params }: { params: { storeId: string, blogId: string } }) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    const { label, ContentLabel, imageUrl } = body;

    if (!label) {
      return new NextResponse("blog Name is missing", { status: 400 });
    }

    if (!ContentLabel) {
      return new NextResponse("blog Name is missing", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("blog Image is missing", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is missing", { status: 400 });
    }

    if (!params.blogId) {
      return new NextResponse("blog Id is missing", { status: 400 });
    }

    const storeRef = doc(db, "stores", params.storeId);
    const store = await getDoc(storeRef);

    if (!store.exists()) {
      return new NextResponse("Store not found", { status: 404 });
    }

    const storeData = store.data();
    if (storeData?.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 500 });
    }

    const blogRef = doc(db, "stores", params.storeId, "blog", params.blogId);
    const blog = await getDoc(blogRef);

    if (blog.exists()) {
      await updateDoc(blogRef, {
        label,
        ContentLabel,
        imageUrl,
        updatedAt: serverTimestamp(),
      });

      return NextResponse.json({ label, imageUrl });
    } else {
      return new NextResponse("blog not found", { status: 404 });
    }
  } catch (error) {
    console.log(`PATCH Error: ${error}`);
    return new NextResponse(`Internal Server Error: ${error}`, { status: 500 });
  }
};

export const DELETE = async (req: Request, { params }: { params: { storeId: string, blogId: string } }) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is missing", { status: 400 });
    }

    if (!params.blogId) {
      return new NextResponse("blog Id is missing", { status: 400 });
    }

    const storeRef = doc(db, "stores", params.storeId);
    const store = await getDoc(storeRef);

    if (!store.exists()) {
      return new NextResponse("Store not found", { status: 404 });
    }

    const storeData = store.data();
    if (storeData?.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 500 });
    }

    const blogRef = doc(db, "stores", params.storeId, "blog", params.blogId);
    await deleteDoc(blogRef);

    return new NextResponse("blog deleted successfully", { status: 200 });
  } catch (error) {
    console.log(`DELETE Error: ${error}`);
    return new NextResponse(`Internal Server Error: ${error}`, { status: 500 });
  }
};
