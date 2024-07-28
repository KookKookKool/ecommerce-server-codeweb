// /api/[storeId]/blog
import { db } from "@/lib/firebase";
import { Blog } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import {  addDoc, collection, doc, getDoc, serverTimestamp, updateDoc, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";


// POST
export const POST = async (req : Request, 
    {params} : {params : {storeId : string}}
) => {
    try {
        const {userId} = auth()
        const body = await req.json()

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 400 })
        }

        const { label, ContentLabel, imageUrl } = body;

        if (!label) {
            return new NextResponse("blog Name is missing", { status: 400 })
        }

        if (!ContentLabel) {
            return new NextResponse("blog Content is missing", { status: 400 })
        }

        if (!imageUrl) {
            return new NextResponse("blog Image is missing", { status: 400 })
        }

        if (!params.storeId) {
            return new NextResponse("Store Id is missing", { status: 400 })
        }

        const store = await getDoc(doc(db, "stores", params.storeId))

        if (!store.exists()) {
            let storeData = store.data()
            if(storeData?.userId !== userId) {
                return new NextResponse("Unauthorized", { status: 500 })
            }
        }

        const blogData = {
            label,
            ContentLabel,
            imageUrl,
            createdAt : serverTimestamp()
        }

        const blogRef = await addDoc(
            collection(db, "stores", params.storeId, "blog"), blogData
        );

        const id = blogRef.id;

        await updateDoc(doc(db, "stores", params.storeId, "blog", id), {
            ...blogData,
            id,
            updatedAt : serverTimestamp()
        });

        return NextResponse.json({ id, ...blogData });

    } catch (error) {
        console.log(`STORE_POST: ${error}`)
        return new NextResponse(`Internal Server Error: ${error}`, { status: 500 })
    }
};


export const GET = async (req : Request, 
    {params} : {params : {storeId : string}}
) => {
    try {

        if (!params.storeId) {
            return new NextResponse("Store Id is missing", { status: 400 })
        }

        const blogData =  (await getDocs(
            collection(doc(db, "stores", params.storeId), "blog")
            )).docs.map((doc) => doc.data()) as Blog[];

        return NextResponse.json(blogData);

    } catch (error) {
        console.log(`STORE_POST: ${error}`)
        return new NextResponse(`Internal Server Error: ${error}`, { status: 500 })
    }
};