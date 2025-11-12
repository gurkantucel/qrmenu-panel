import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const fileName = req.nextUrl.searchParams.get("name") || "qrcode.png";

  if (!url) {
    return NextResponse.json({ error: "URL parametresi eksik" }, { status: 400 });
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Dosya indirilemedi", status: response.status },
        { status: 500 }
      );
    }

    const arrayBuffer = await response.arrayBuffer();

    // 🔹 Buffer yerine Uint8Array kullan
    const uint8Array = new Uint8Array(arrayBuffer);

    return new NextResponse(uint8Array, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Download işlemi başarısız", details: error.message },
      { status: 500 }
    );
  }
}
