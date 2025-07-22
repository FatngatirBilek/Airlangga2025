import connect from "@/lib/databaseconnect";
import Suara from "@/models/suara";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { nama, nomor, count } = await request.json();
    await connect();
    await Suara.create({ nama, nomor, count });
    return NextResponse.json({ message: "berhasil dibuat" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal dibuat" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connect();
    const suara = await Suara.find();
    return NextResponse.json(suara);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal mengambil data" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { message: "Id tidak ditemukan" },
        { status: 400 },
      );
    }
    await connect();
    await Suara.findByIdAndDelete(id);
    return NextResponse.json({ message: "Berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal dihapus" }, { status: 500 });
  }
}
