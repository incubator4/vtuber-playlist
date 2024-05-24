"use server";
import { NextResponse } from "next/server";
import { getUser, getPlaylist } from "@/lib/notion";

export async function GET(
  _request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  const userInfo = await getUser(id);

  if (!userInfo) {
    return NextResponse.json(
      { error: `User ${id} not found` },
      { status: 404 }
    );
  }

  const { id: userId, properties } = userInfo;

  let avatar = "";
  const avatarProp = properties["Avatar"];

  if (avatarProp && avatarProp.type === "url") {
    avatar = avatarProp.url || "";
  }

  const playlist = await getPlaylist(userId);

  // config to json
  return NextResponse.json({
    playlist,
    avatar,
  });
}
