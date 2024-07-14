import { db } from "@/lib/firebase";
import { Billboards } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import { deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request, { params }: { params: { storeId: string, billboardId: string } }) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    const { label, imageUrl } = body;

    if (!label) {
      return new NextResponse("Billboard Name is missing", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Billboard Image is missing", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is missing", { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard Id is missing", { status: 400 });
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

    const billboardRef = doc(db, "stores", params.storeId, "billboards", params.billboardId);
    const billboard = await getDoc(billboardRef);

    if (billboard.exists()) {
      await updateDoc(billboardRef, {
        label,
        imageUrl,
        updatedAt: serverTimestamp(),
      });

      return NextResponse.json({ label, imageUrl });
    } else {
      return new NextResponse("Billboard not found", { status: 404 });
    }
  } catch (error) {
    console.log(`PATCH Error: ${error}`);
    return new NextResponse(`Internal Server Error: ${error}`, { status: 500 });
  }
};

export const DELETE = async (req: Request, { params }: { params: { storeId: string, billboardId: string } }) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is missing", { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard Id is missing", { status: 400 });
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

    const billboardRef = doc(db, "stores", params.storeId, "billboards", params.billboardId);
    await deleteDoc(billboardRef);

    return new NextResponse("Billboard deleted successfully", { status: 200 });
  } catch (error) {
    console.log(`DELETE Error: ${error}`);
    return new NextResponse(`Internal Server Error: ${error}`, { status: 500 });
  }
};
