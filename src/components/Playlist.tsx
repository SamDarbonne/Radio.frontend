import { LoaderFunction, useLoaderData, useParams } from "react-router-dom";
import api, { PlaylistData, PlaylistDocument } from "../fetch";
import SongsTable from "./SongsTable";
import { useCallback, useMemo } from "react";

const fetchData = async (id: string, page: number) => {
  console.log({ id, page });
  const { documents, totalPages, name } = await api.playlists.get.one(id, page);
  const songsData = { documents, page, totalPages, name } as PlaylistData;
  const playlistData = { ...songsData, name };
  return playlistData;
};

export const loader: LoaderFunction = async ({ params }) => {
  return await fetchData(params.id!, 1);
};

const Playlist = () => {
  const playlist = useLoaderData() as PlaylistDocument;
  const id = useParams().id;

  const getFetchData = useCallback(
    (id: string) => async (page: number) => {
      return await fetchData(id, page);
    },
    [id]
  );

  const initialData = useMemo(
    () => ({
      documents: playlist.songs,
      page: 1,
      totalPages: playlist.totalPages,
      name: playlist.name,
    }),
    [playlist.songs, playlist.totalPages, playlist.name]
  );

  const handleReorderedSongs = async (items: string[], page: number) => {
    await api.playlists.update(id!, { songs: items, page });
  };

  return (
    <div>
      <div>{playlist.name}</div>
      <SongsTable
        initialData={initialData}
        fetchFn={getFetchData(id!)}
        reorder={handleReorderedSongs}
      />
    </div>
  );
};

export default Playlist;
