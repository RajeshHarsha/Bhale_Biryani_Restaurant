import { NextResponse } from "next/server";
import { getBranches } from "@/lib/db";

export async function GET() {
  try {
    const branches = await getBranches();
    return NextResponse.json(branches);
  } catch (error) {
    console.error("Error in branches API:", error);
    return NextResponse.json(
      { error: "Failed to fetch branches" },
      { status: 500 }
    );
  }
}
