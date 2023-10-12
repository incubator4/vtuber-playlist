interface Song {
  title: string;
  artist: string;
  album?: string;
  year?: number;
  genre: string[];
  lang: string;
  durationInSeconds: number;
}

interface Config {
  color: {
    red: number;
    green: number;
    blue: number;
  };
  avatar: string;
  playlist: Array<Song>;
}
