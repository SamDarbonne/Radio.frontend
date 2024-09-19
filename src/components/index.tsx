import Home from "./Home";
import SongsTable, { loader as songsTableLoader } from "./SongsTable";
import Upload from "./Upload.tsx";
import Artists, { loader as artistsLoader } from "./Artists.tsx";

const loaders = {
  songsTable: songsTableLoader,
  artists: artistsLoader,
};

export { Home, SongsTable, songsTableLoader, Upload, Artists, loaders };
