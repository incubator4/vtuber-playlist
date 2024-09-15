import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "edge";
export async function GET(
  _request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  // prisma select user where nickname = id
  // const user = await db.user.findUnique({
  //   where: {
  //     nickname: id,
  //   },
  // });

  const u = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.nickname, id),
  });

  if (!u) {
    return NextResponse.json(
      { error: `User ${id} not found` },
      { status: 404 }
    );
  }

  const { avatar } = u;

  // const _playlist = await prisma.playlist.findMany({
  //   where: {
  //     userId: user.uid,
  //   },
  //   include: {
  //     song: {
  //       include: {
  //         genresOnSongs: {
  //           include: {
  //             genre: true,
  //           },
  //         },
  //       },
  //     },
  //   },
  // });
  const _playlist = await db.query.playlist.findMany({
    where: (playlist, { eq }) => eq(playlist.userId, u.uid),
    with: {
      song: {
        with: {
          genresOnSongs: {
            with: {
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
