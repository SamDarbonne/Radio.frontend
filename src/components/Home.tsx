import { ReactElement } from "react";
import { useLoaderData } from "react-router-dom";
import { Media } from "../fetch";

const Home: () => ReactElement = () => {
  const mediaData = useLoaderData() as Media[];
  console.log(mediaData);
  return (
    <div className="home">
      {mediaData.map((media) => {
        return (
          <div key={media.id}>
            <h2>{media.title}</h2>
            <p>{media.description}</p>
            <p>{media.url}</p>
            <p>{media.type}</p>
            <p>{media.duration}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
