import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(_request: Request) {
  const users = await prisma.user.findMany();

  return NextResponse.json(users);
}

export const dynamic = "force-dynamic";
