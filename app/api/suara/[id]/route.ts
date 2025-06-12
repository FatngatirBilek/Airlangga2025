import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/databaseconnect";
import Suara from "@/models/suara";

interface Params {
  id: string;
}

export async function PUT(request: NextRequest, context: { params: Params }) {
  const { id } = context.params;
  const {
    newNama: nama,
    newNomor: nomor,
    newCount: count,
  } = await request.json();
  await connect();
  await Suara.findByIdAndUpdate(id, { nama, nomor, count });
  return NextResponse.json(
    { message: "Suara updated successfully" },
    { status: 200 },
  );
}

export async function GET(_: NextRequest, context: { params: Params }) {
  const { id } = context.params;
  await connect();
  const suara = await Suara.findOne({ _id: id });
  if (!suara) {
    return NextResponse.json({ message: "Suara not found" }, { status: 404 });
  }
  return NextResponse.json({ suara }, { status: 200 });
}
