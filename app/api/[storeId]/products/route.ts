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
      // kitchen,
      // cuisine,
    } = body;

    if (!name) {
      return new NextResponse("Product Name is missing", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required!", { status: 400 });
    }

    if (!Details) {
      return new NextResponse("Details is missing", { status: 400 });
    }

    if (!DetailsInfo) {
      return new NextResponse("DetailsInfo is missing", { status: 400 });
    }

    if (!category) {
      return new NextResponse("Category is missing", { status: 400 });
    }

    if (!price) {
      return new NextResponse("price is missing", { status: 400 });
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
      // kitchen,
      // cuisine,
      createdAt: serverTimestamp(),
    };

    const productRef = await addDoc(
      collection(db, "stores", params.storeId, "products"),
      productData
    );

    const id = productRef.id;

    await updateDoc(doc(db, "stores", params.storeId, "products", id), {
      ...productData,
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ id, ...productData });
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

    // const productsData = (
    //   await getDocs(collection(doc(db, "stores", params.storeId), "products"))
    // ).docs.map((doc) => doc.data()) as Product[];

    // return NextResponse.json(productsData);

    //get the searchParams form the url
    const { searchParams } = new URL(req.url);

    const productRef = collection(
      doc(db, "stores", params.storeId),
      "products"
    );

    let productQuery;

    let queryContraints = [];

    // contruct the query
    if (searchParams.has("size")) {
      queryContraints.push(where("size", "==", searchParams.get("size")));
    }

    if (searchParams.has("category")) {
      queryContraints.push(
        where("category", "==", searchParams.get("category"))
      );
    }

    // if (searchParams.has("kitchen")) {
    //   queryContraints.push(where("kitchen", "==", searchParams.get("kitchen")));
    // }

    // if (searchParams.has("cuisine")) {
    //   queryContraints.push(where("cuisine", "==", searchParams.get("cuisine")));
    // }

    if (searchParams.has("isFeatured")) {
      queryContraints.push(
        where(
          "isFeatured",
          "==",
          searchParams.get("isFeatured") === "true" ? true : false
        )
      );
    }

    if (searchParams.has("isArchived")) {
      queryContraints.push(
        where(
          "isArchived",
          "==",
          searchParams.get("isArchived") === "true" ? true : false
        )
      );
    }

    if (queryContraints.length > 0) {
      productQuery = query(productRef, and(...queryContraints));
    } else {
      productQuery = query(productRef);
    }

    // execute the query
    const querySnapshot = await getDocs(productQuery)

    const productsData : Product[] = querySnapshot.docs.map(doc => doc.data() as Product)

    return NextResponse.json(productsData);

  } catch (error) {
    console.log(`PRODUCT_GET: ${error}`);
    return new NextResponse(`Internal Server Error: ${error}`, { status: 500 });
  }
};
