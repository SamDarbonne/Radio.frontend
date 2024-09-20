import { LoaderFunction, useLoaderData } from "react-router-dom";
import api, { SongData, Query } from "../fetch";

import "../styles/SongsTable.css";
import { ReactElement } from "react";
import DataTable from "./DataTable";
import SongRow from "./SongRow";

const fetchData = async (page: number, query: Query) => {
  return await api.songs.get.all(page, query);
};

export const loader: LoaderFunction = async () => {
  return await fetchData(1, "recent");
};

const SongsTable: () => ReactElement = () => {
  const initialData = useLoaderData() as SongData | null;
  if (!initialData) return <div>Loading...</div>;
  return (
    <DataTable
      initialData={initialData!}
      dataLoader={fetchData}
      rowElement={SongRow}
    />
  );
};

export default SongsTable;
