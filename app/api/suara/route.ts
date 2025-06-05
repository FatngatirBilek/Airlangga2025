import connect from "@/lib/databaseconnect";
import Suara from "@/models/suara";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { nama, nomor, count } = await request.json();
  await connect();
  await Suara.create({ nama, nomor, count });
  try {
    return NextResponse.json({ message: "berhasil dibuat" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal dibuat" }, { status: 500 });
  }
}

export async function GET() {
  await connect();
  const suara = await Suara.find();
  return NextResponse.json(suara);
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  await connect();
  await Suara.findByIdAndDelete(id);
  try {
    return NextResponse.json({ message: "Berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal dihapus" }, { status: 500 });
  }
}
