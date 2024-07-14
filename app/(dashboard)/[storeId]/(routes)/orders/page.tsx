import { collection, doc, getDocs } from "firebase/firestore";
import { OrdersClient } from "./components/client";
import { db } from "@/lib/firebase";
import { Order } from "@/types-db";
import { OrdersColumns } from "./components/columns";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const ordersData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "orders"))
  ).docs.map((doc) => doc.data()) as Order[];

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "THB",
  });

  const formattedOrders: OrdersColumns[] = ordersData.map((item) => ({
    id: item.id,
    isPaid: item.isPaid,
    phone: item.phone,
    address: item.address,
    products: item.orderItems.map((item) => item.name).join(", "),
    order_status: item.order_status,
    totalPrice: formatter.format(
      item.orderItems.reduce((total, item) => {
        if (item && item.qty !== undefined) {
          return total + Number(item.price * item.qty);
        }
        return total;
      }, 0)
    ),
    images: item.orderItems.map((item) => item.images[0].url),
    createdAt: item.createdAt ? item.createdAt.toDate().toISOString() : "",
    customerName: item.customerName,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrdersClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
