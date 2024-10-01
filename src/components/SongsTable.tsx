import { LoaderFunction, useLoaderData } from "react-router-dom";
import api, { SongData, Query } from "../fetch";

import "../styles/SongsTable.scss";
import DataTable from "./DataTable";
import SongRow from "./SongRow";
import { useMemo } from "react";

const fetchData = async (page: number, query: Query) => {
  return await api.songs.get.all(page, query);
};

export const loader: LoaderFunction = async () => {
  return await fetchData(1, "recent");
};

const SongsTable = ({
  initialData,
  fetchFn,
  reorder,
}: {
  initialData?: SongData;
  fetchFn?: (page: number, query: Query) => Promise<SongData>;
  reorder?: (items: string[], page: number) => void;
}) => {
  const loaderData = useLoaderData() as SongData | null;
  const data = useMemo(
    () => initialData || loaderData,
    [initialData, loaderData]
  );
  if (!data) return <div>Loading...</div>;
  return (
    <DataTable
      initialData={data}
      reorder={reorder}
      dataLoader={fetchFn ? fetchFn : fetchData}
      rowElement={SongRow}
    />
  );
};

export default SongsTable;
