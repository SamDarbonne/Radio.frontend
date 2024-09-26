import { LoaderFunction, useLoaderData } from "react-router-dom";
import api, { ArtistDocument } from "../fetch";
import ArtistAlbumsTable from "./ArtistAlbumsTable";

export const loader: LoaderFunction = async ({ params }) => {
  return await api.artists.get.one(params.id!);
};

const Artist = () => {
  const artist: ArtistDocument = useLoaderData() as ArtistDocument;
  return (
    <div>
      <div>{artist.name}</div>
      <ArtistAlbumsTable id={artist._id} />
    </div>
  );
};

export default Artist;
