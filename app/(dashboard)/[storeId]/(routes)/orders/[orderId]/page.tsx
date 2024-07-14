import { db } from "@/lib/firebase";
import { Order } from "@/types-db";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { OrderFrom } from "../components/order-form";

const OrderPage = async ({
  params,
}: {
  params: { 
    storeId: string; 
    orderId: string };
}) => {
  const order = (
    await getDoc(
      doc(db, "stores", params.storeId, "orders", params.orderId)
    )
  ).data() as Order;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderFrom initialData={order} />
      </div>
    </div>
  );
};

export default OrderPage;
