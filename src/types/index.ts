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

export interface Song {
  title: string;
  artist: string;
  genre: string[];
  lang: string;
}
