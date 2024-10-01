import { LoaderFunction, useLoaderData } from "react-router-dom";
import api, { Query, AlbumData } from "../fetch";

import "../styles/SongsTable.scss";
import { ReactElement, useEffect, useState } from "react";
import DataTable from "./DataTable";
import ArtistAlbumsRow from "./ArtistAlbumsRow";

const getFetchData = (id: string) => {
  return async (page: number, query: Query) => {
    return await api.albums.get.artist(id, page, query);
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  const id = params.id!;
  const fetchData = getFetchData(id);
  return await fetchData(1, "recent");
};

const SongsTable: (props: { id: string }) => ReactElement = ({ id }) => {
  const initialData = useLoaderData() as AlbumData | null;
  const [loadedData, setLoadedData] = useState<AlbumData | null>(initialData);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFetchData(id)(1, "recent");
      setLoadedData(data);
    };

    if (id) fetchData();
  }, [id]);

  if (!loadedData) return <div>Loading...</div>;

  return (
    <DataTable
      initialData={loadedData}
      dataLoader={getFetchData(id)}
      rowElement={ArtistAlbumsRow}
    />
  );
};

export default SongsTable;
