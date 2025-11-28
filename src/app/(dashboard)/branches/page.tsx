import { Metadata } from "next";
import BranchView from "views/branch/BranchPage";

export const metadata: Metadata = { title: 'İşletmem' }

export default function BranchPage() {
  return <BranchView />;
}
