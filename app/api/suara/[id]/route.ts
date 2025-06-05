import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/databaseconnect";
import Suara from "@/models/suara";

interface Params {
  id: string;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params },
) {
  const { id } = params;
  const {
    newNama: nama,
    newNomor: nomor,
    newSuara: suara,
  } = await request.json();
  await connect();
  await Suara.findByIdAndUpdate(id, { nama, nomor, suara });
  return NextResponse.json(
    { message: "Suara updated successfully" },
    { status: 200 },
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params },
) {
  const { id } = params;
  await connect();
  const suara = await Suara.findOne({ _id: id });
  if (!suara) {
    return NextResponse.json({ message: "Suara not found" }, { status: 404 });
  }
  return NextResponse.json({ suara }, { status: 200 });
}
