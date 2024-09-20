import Home from "./Home";
import SongsTable, { loader as songsTableLoader } from "./SongsTable";
import Upload from "./Upload.tsx";
import Artists, { loader as artistsLoader } from "./Artists.tsx";
import Artist, { loader as artistLoader } from "./Artist.tsx";

const loaders = {
  songsTable: songsTableLoader,
  artists: artistsLoader,
  artist: artistLoader,
};

export { Home, SongsTable, songsTableLoader, Upload, Artists, Artist, loaders };
