import DataTable from "./DataTable";
import api, { PlaylistsData, PlaylistDocument, Query } from "../fetch";
import { useEffect, useState } from "react";
import { LoaderFunction } from "react-router-dom";
import { ActionIcon, Button } from "@mantine/core";

const fetchData = async (page: number, query: Query = "recent") => {
  return await api.playlists.get.all(page, query);
};

export const loader: LoaderFunction = async () => {
  return await fetchData(1, "recent");
};

interface PlaylistRowProps extends PlaylistDocument {
  songId: string;
}

const AddToPlaylistRow = ({ row }: { row: PlaylistRowProps }) => {
  const [added, setAdded] = useState(false);
  const addSongToPlaylist = async () => {
    const response = await api.playlists.addSongToPlaylist(row.songId, row._id);
    if (!response) {
      console.error("Failed to add song to playlist", response);
    } else {
      setAdded(true);
      console.log("Song added to playlist");
    }
  };
  console.log({ added });
  return (
    <div className="add-to-playlist-row">
      <div>{row.name}</div>
      <ActionIcon disabled={added} onClick={addSongToPlaylist}>
        +
      </ActionIcon>
    </div>
  );
};

interface AddToPlaylistDialogState extends PlaylistsData {
  documents: PlaylistRowProps[];
}

const mapData = (data: PlaylistsData, songId: string): PlaylistRowProps[] => {
  const documents = data.documents.map((playlist) => ({
    ...playlist,
    songId,
  }));
  return documents;
};

const AddToPlaylistDialog = ({ songId }: { songId: string }) => {
  const [playlistData, setPlaylistData] = useState<AddToPlaylistDialogState>();

  useEffect(() => {
    const fetchData = async () => {
      const data = await api.playlists.get.all(1);
      if (data.documents.length) {
        const mappedData = mapData(data, songId);
        setPlaylistData({ ...data, documents: mappedData });
      }
    };

    fetchData();
  }, [songId]);

  const createPlaylist = async () => {
    const response = await api.playlists.create();
    if (response) {
      console.log("Playlist created");
    }
    const data = await fetchData(1);
    const mappedData = mapData(data, songId);
    setPlaylistData({ ...data, documents: mappedData });
  };

  const AddNewPlaylistButton = () => {
    return <Button onClick={createPlaylist}>Create New Playlist</Button>;
  };

  const playlists = playlistData?.totalPages;

  if (!playlists) return <AddNewPlaylistButton />;

  const dataLoader = async (page: number, query: Query) => {
    const data = await fetchData(page, query);
    const mappedDocuments = mapData(data, songId);
    return { ...data, documents: mappedDocuments };
  };

  return (
    <div>
      <AddNewPlaylistButton />
      <DataTable
        initialData={playlistData}
        dataLoader={dataLoader}
        rowElement={AddToPlaylistRow}
        showQueryButtons={false}
      />
    </div>
  );
};

export default AddToPlaylistDialog;
