import { Metadata } from "next";
import MenuTable from "views/menu/MenuTable";

// ==============================|| REACT TABLE - FILTERING ||============================== //

export const metadata: Metadata = { title: 'Menüler' }

export default function CategoryPage() {
  return <MenuTable />;
}
