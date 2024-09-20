import { LoaderFunction, useLoaderData } from "react-router-dom";
import api, { ArtistData, Query } from "../fetch";

const fetchData = async (page: number, query: Query) => {
  return await api.artists.get.all(page, query);
};

import "../styles/SongsTable.css";
import { ReactElement } from "react";
import DataTable from "./DataTable";
import { ArtistRow } from "./ArtistRow";
export const loader: LoaderFunction = async () => {
  return await fetchData(1, "recent");
};

const Artists: () => ReactElement = () => {
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
