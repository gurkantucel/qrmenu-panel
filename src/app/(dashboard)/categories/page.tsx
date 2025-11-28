import { Metadata } from "next";
import CategoryTable from "views/category/CategoryTable";

// ==============================|| REACT TABLE - FILTERING ||============================== //

export const metadata: Metadata = { title: 'Kategoriler' }

export default function CategoryPage() {
  return <CategoryTable />;
}
