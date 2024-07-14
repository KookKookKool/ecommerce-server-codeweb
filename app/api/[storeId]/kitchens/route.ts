import { db } from "@/lib/firebase";
import { Kitchen } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
  getDocs,
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

    const { name, value } = body;

    if (!name) {
      return new NextResponse("Kitchen Name is missing", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Kitchen Value is missing", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is missing", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (!store.exists()) {
      let storeData = store.data();
      if (storeData?.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    const KitchenData = {
      name,
      value,
      createdAt: serverTimestamp(),
    };

    const KitchenRef = await addDoc(
      collection(db, "stores", params.storeId, "kitchens"),
      KitchenData
    );

    const id = KitchenRef.id;

    await updateDoc(doc(db, "stores", params.storeId, "kitchens", id), {
      ...KitchenData,
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ id, ...KitchenData });
  } catch (error) {
    console.log(`KITCHEN_POST: ${error}`);
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

    const KitchenData = (
      await getDocs(collection(doc(db, "stores", params.storeId), "kitchens"))
    ).docs.map((doc) => doc.data()) as Kitchen[];

    return NextResponse.json(KitchenData);
  } catch (error) {
    console.log(`KITCHEN_GET: ${error}`);
    return new NextResponse(`Internal Server Error: ${error}`, { status: 500 });
  }
};
