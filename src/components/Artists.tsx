import { LoaderFunction, useLoaderData } from "react-router-dom";
import api, { ArtistData, Query } from "../fetch";
import "../styles/SongsTable.css";
import DataTable from "./DataTable";
import { ArtistRow } from "./ArtistRow";

const fetchData = async (page: number, query: Query) => {
  return await api.artists.get.all(page, query);
};

export const loader: LoaderFunction = async () => {
  return await fetchData(1, "recent");
};

const Artists = () => {
  const initialData = useLoaderData() as ArtistData | null;
  if (!initialData) return <div>Loading...</div>;
  return (
    <DataTable
      initialData={initialData!}
      dataLoader={fetchData}
      rowElement={ArtistRow}
    />
  );
};

export default Artists;
