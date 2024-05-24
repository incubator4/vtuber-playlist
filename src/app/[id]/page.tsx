"use client";
import { useState, useEffect } from "react";
import { Config } from "@/types";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Skeleton } from "@nextui-org/skeleton";

import Playlist from "./Playlist";
export default function Page({ params }: { params: { id: string } }) {
  const [data, setData] = useState<Config>({
    color: {
      red: 0,
      green: 0,
      blue: 0,
    },
    avatar: "",
    playlist: [],
  });
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/${params.id.toLowerCase()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setData(data as Config);
        setLoading(false);
      });
  }, [params.id]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Card style={{ margin: "1rem" }} className="py-4">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <p className="text-tiny uppercase font-bold">Daily Mix</p>
          <small className="text-default-500">12 Tracks</small>
          <h4 className="font-bold text-large">Frontend Radio</h4>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <Skeleton isLoaded={!isLoading}>
            <Image
              width={300}
              height={200}
              alt="NextUI hero Image with delay"
              src={data.avatar}
            />
          </Skeleton>
        </CardBody>
      </Card>

      <div style={{ width: "100%" }}>
        <Playlist isLoading={isLoading} data={data.playlist} />
      </div>
    </div>
  );
}
