import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/databaseconnect";
import DashboardState from "@/models/DashboardState";

export async function GET() {
  await connect();
  const stateDoc = await DashboardState.findOne();
  return NextResponse.json({ enabled: stateDoc?.enabled ?? false });
}

export async function POST(req: NextRequest) {
  await connect();
  const { enabled } = await req.json();
  let stateDoc = await DashboardState.findOne();
  if (!stateDoc) {
    stateDoc = new DashboardState({ enabled });
  } else {
    stateDoc.enabled = enabled;
  }
  await stateDoc.save();
  return NextResponse.json({ success: true, enabled: stateDoc.enabled });
}
