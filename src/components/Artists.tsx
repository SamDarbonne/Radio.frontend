import { LoaderFunction, useLoaderData } from "react-router-dom";
import api, { ArtistData, Query } from "../fetch";

const fetchArtists = async (page: number, query: Query) => {
  return await api.artists.get.all(page, query);
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const query = (url.searchParams.get("query") as Query) || "recent";
  return await fetchArtists(page, query);
};

const Artists = () => {
  const artists = useLoaderData() as ArtistData;

  return (
    <div>
      <h1>Artists</h1>
      <ul>
        {artists?.documents.map((artist) => {
          return <li key={artist.name}>{artist.name}</li>;
        })}
      </ul>
    </div>
  );
};

export default Artists;
