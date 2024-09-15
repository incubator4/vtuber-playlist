"use client";
import { useState, useEffect } from "react";
import { User } from "@/types";
import { Snippet } from "@nextui-org/snippet";
import { Card, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [data, setData] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/users", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setData(data as User[]);
      });
  }, []);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="flex gap-2 grid grid-cols-2 sm:grid-cols-4">
        {data.map((user) => (
          <Card
            key={user.uid}
            isFooterBlurred
            radius="lg"
            className="border-none p-4"
          >
            <Image
              alt="Woman listing to music"
              isBlurred
              isZoomed
              className="object-cover"
              height={200}
              src={user.avatar}
              width={200}
            />
            <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
              <p className="text-tiny text-white/80">{user.name}</p>
              <Button
                className="text-tiny text-white bg-black/20"
                variant="flat"
                color="default"
                radius="lg"
                size="sm"
                onClick={() => router.push(`/${user.nickname}`)}
              >
                Detail
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <Snippet hideSymbol hideCopyButton variant="flat">
          <span>
            <p>Copyright by Incubator4</p>
          </span>
        </Snippet>
      </div>
    </section>
  );
}
