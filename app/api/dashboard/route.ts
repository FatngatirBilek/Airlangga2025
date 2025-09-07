import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/databaseconnect";
import DashboardState from "@/models/DashboardState";

export async function GET() {
  await connect();
  const stateDoc = await DashboardState.findOne();
  return NextResponse.json({
    enabled: stateDoc?.enabled ?? false,
    winnerMode: stateDoc?.winnerMode ?? false,
  });
}

export async function POST(req: NextRequest) {
  await connect();
  const { enabled, winnerMode } = await req.json();
  let stateDoc = await DashboardState.findOne();
  if (!stateDoc) {
    stateDoc = new DashboardState({
      enabled: enabled ?? false,
      winnerMode: winnerMode ?? false,
    });
  } else {
    if (enabled !== undefined) stateDoc.enabled = enabled;
    if (winnerMode !== undefined) stateDoc.winnerMode = winnerMode;
  }
  await stateDoc.save();
  return NextResponse.json({
    success: true,
    enabled: stateDoc.enabled,
    winnerMode: stateDoc.winnerMode,
  });
}
