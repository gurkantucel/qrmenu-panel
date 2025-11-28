import { Metadata } from "next";
import SelectedFoodTable from "views/selected-foods/SelectedFoodTable";

// ==============================|| REACT TABLE - FILTERING ||============================== //

export const metadata: Metadata = { title: 'Şefin Seçtikleri' }

export default function CategoryPage() {
  return <SelectedFoodTable />;
}
