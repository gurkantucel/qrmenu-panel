import { Metadata } from "next";
import QrCodeView from "views/qr-code/QrCodeView";

export const metadata: Metadata = { title: 'QR Kodları' }

export default function QrCodePage() {
  return <QrCodeView />;
}
