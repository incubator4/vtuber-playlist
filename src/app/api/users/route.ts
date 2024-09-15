import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "edge";
export async function GET(_request: Request) {
  const users = await db.query.user.findMany();

  return NextResponse.json(
    users.map((user) => ({ ...user, uid: user.uid.toString() }))
  );
}

export const dynamic = "force-dynamic";
