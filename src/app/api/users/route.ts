"use server";
import { NextResponse } from "next/server";
import { getUsers } from "@/lib/notion";

export async function GET(_request: Request) {
  const users = await getUsers();

  const resp = users.map((user) => ({
    id: user.id,
  }));

  return NextResponse.json(users);
}

export const dynamic = "force-dynamic";
