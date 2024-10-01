import Home from "./Home";
import SongsTable, { loader as songsTableLoader } from "./SongsTable";
import Upload from "./Upload.tsx";
import Artists, { loader as artistsLoader } from "./Artists.tsx";
import Artist, { loader as artistLoader } from "./Artist.tsx";
import Playlists, { loader as playlistsLoader } from "./Playlists.tsx";
import Playlist, { loader as playlistLoader } from "./Playlist.tsx";

const loaders = {
  songsTable: songsTableLoader,
  artists: artistsLoader,
  artist: artistLoader,
  playlists: playlistsLoader,
  playlist: playlistLoader,
};

export {
  Home,
  SongsTable,
  songsTableLoader,
  Upload,
  Playlist,
  Playlists,
  Artists,
  Artist,
  loaders,
};
