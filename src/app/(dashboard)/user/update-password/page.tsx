import { Metadata } from "next";
import ChangePasswordView from "views/user/ChangePasswordView";

export const metadata: Metadata = { title: 'Şifre Değiştir' }

export default function UpdatePasswordPage() {
  return <ChangePasswordView />;
}
