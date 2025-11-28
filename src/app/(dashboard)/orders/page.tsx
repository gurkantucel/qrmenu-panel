import { Metadata } from "next";
import OrderTable from "views/order/OrderTable";

export const metadata: Metadata = { title: 'Paketim' }

export default function BranchPage() {
  return <OrderTable />;
}
