import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const POST = async (req: Request) => {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        console.error("Error constructing event:", error);
        return new NextResponse(`WEBHOOK Error: ${(error as Error)?.message}`, { status: 400 });
    }

    console.log("Event received:", event);

    const session = event.data.object as Stripe.Checkout.Session;

    const address = session?.customer_details?.address;

    const addressComponents = [
        address?.line1,
        address?.line2,
        address?.city,
        address?.state,
        address?.postal_code,
        address?.country,
    ];

    const addressString = addressComponents.filter((a) => a !== null).join(", ");

    if (event.type === "checkout.session.completed" || event.type === "payment_intent.succeeded") {
        console.log(`Order Id: ${session?.metadata?.orderId}`);
        if (session?.metadata?.orderId) {
            try {
                const orderDocRef = doc(
                    db,
                    "stores",
                    session?.metadata?.storeId,
                    "orders",
                    session?.metadata?.orderId
                );
                await updateDoc(orderDocRef, {
                    isPaid: true,
                    address: addressString,
                    phone: session?.customer_details?.phone,
                    customerName: session?.customer_details?.name, //
                    updatedAt: serverTimestamp(),
                });
                console.log("Document updated successfully");
            } catch (error: any) {
                console.error("Error updating document:", error);
            }
        }
    }

    return new NextResponse(null, { status: 200 });
};
