import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Config {
  color: {
    red: number;
    green: number;
    blue: number;
  };
  avatar: string;
  playlist: Array<Song>;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Song {
  id: number;
  title: string;
  artist: string;
  genre: Genre[];
  lang: string;
}

export interface User {
  nickname: string;
  avatar: string;
  name: string;
  uid: number;
}
