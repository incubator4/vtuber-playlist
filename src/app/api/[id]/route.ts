import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const runtime = "edge";
export async function GET(
  _request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  // prisma select user where nickname = id
  const user = await prisma.user.findUnique({
    where: {
      nickname: id,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: `User ${id} not found` },
      { status: 404 }
    );
  }

  const { avatar } = user;

  const _playlist = await prisma.playlist.findMany({
    where: {
      userId: user.uid,
    },
    include: {
      song: {
        include: {
          genresOnSongs: {
            include: {
              genre: true,
            },
          },
        },
      },
    },
  });

  const playlist = _playlist.map(({ song, tags }) => {
    const { id, title, artist, genresOnSongs, lang } = song;
    return {
      id,
      tags,
      title,
      artist,
      lang,
      genre: genresOnSongs.map(({ genre }) => genre),
    };
  });

  // config to json
  return NextResponse.json({
    playlist,
    avatar,
  });
}
