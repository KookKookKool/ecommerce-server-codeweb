import { db } from "@/lib/firebase"
import { auth } from "@clerk/nextjs/server"
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore"
import { NextResponse } from "next/server"

export const POST = async (req : Request) => {
    try {
        const {userId} = auth()
        const body = await req.json()

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 400 })
        }

        const {name} = body;
        if (!name) {
            return new NextResponse("Store name is missing", { status: 400 })
        }

        const storeData = {
            name,
            userId,
            createdAt: serverTimestamp(),
        }

        // Add the Data to the firestore
        const storeRef = await addDoc(collection(db, "stores"), storeData);

        const id = storeRef.id

        await updateDoc(doc(db, "stores", id), {
            ...storeData,
            id,
            updatedAt : serverTimestamp()
        })

        return NextResponse.json({ id, ...storeData });


    } catch (error) {
        console.log(`STORE_POST: ${error}`)
        return new NextResponse(`Internal Server Error: ${error}`, { status: 500 })
    }
}