import { Link, LoaderFunction, useLoaderData } from "react-router-dom";
import api, { PlaylistsData, PlaylistDocument, Query } from "../fetch";
import "../styles/SongsTable.scss";
import DataTable from "./DataTable";
// import { PlaylistsRow } from "./ArtistRow";

const PlaylistsRow = ({ row }: { row: PlaylistDocument }) => {
  return (
    <div>
      <Link to={`/playlists/${row._id}`}>{row.name}</Link>
    </div>
  );
};

const fetchData = async (page: number, query: Query) => {
  return await api.playlists.get.all(page, query);
};

export const loader: LoaderFunction = async () => {
  return await fetchData(1, "recent");
};

const Playlists = () => {
  const initialData = useLoaderData() as PlaylistsData | null;
  if (!initialData) return <div>Loading...</div>;
  return (
    <DataTable
      initialData={initialData!}
      dataLoader={fetchData}
      rowElement={PlaylistsRow}
    />
  );
};

export default Playlists;
