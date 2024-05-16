"use server";
import { NextResponse } from "next/server";
import { Config } from "@/types";
import yaml from "js-yaml";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  const resp = await fetch(
    `https://vtuber-1256553639.cos.ap-shanghai.myqcloud.com/singer/${id}.yaml`
  );

  const data = await resp.text();

  const config = yaml.load(data) as Config;

  // config to json
  return NextResponse.json(config);
}
