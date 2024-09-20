import { LoaderFunction, useLoaderData } from "react-router-dom";
import api, { ArtistDocument } from "../fetch";

export const loader: LoaderFunction = async ({ params }) => {
  return await api.artists.get.one(params.id!);
};

const Artist = () => {
  const artist: ArtistDocument = useLoaderData() as ArtistDocument;
  return <div>{artist.name}</div>;
};

export default Artist;
