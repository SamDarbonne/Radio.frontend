import { AlbumDocument, BASE_URL, SongDocument } from "../fetch";
import { formatDuration } from "../utils";
import Barcode from "./Barcode";

import "../styles/Card.scss";

type CardProps = {
  item: SongDocument | AlbumDocument;
  // | PlaylistDocument
};

function isSong(item: unknown): item is SongDocument {
  return (item as SongDocument).album !== undefined;
}

function isAlbum(item: unknown): item is AlbumDocument {
  return (item as AlbumDocument).releaseDate !== undefined;
}

const Card = ({ item }: CardProps) => {
  let imageFilepath: string = "";
  let title: string = "";
  let subtitle: string = "";
  let additionalInfo: React.ReactNode = null;

  if (isSong(item)) {
    imageFilepath = item.album.imageFilename ?? "";
    title = item.name;
    subtitle =
      item.album.artists?.map((artist) => artist.name).join(", ") ?? "unknown";
    additionalInfo = (
      <p>
        Album: {item.album.name}
        <br />
        Duration: {formatDuration(item.duration)}
      </p>
    );
  } else if (isAlbum(item)) {
    imageFilepath = item.imageFilename ?? "";
    title = item.name;
    subtitle = item.artists.map((artist) => artist.name).join(", ");
    additionalInfo = <p>Release Date: {item.releaseDate.toString()}</p>;
  }
  return (
    <div className="card">
      <div className="card-header">
        <h2>{title}</h2>
      </div>
      <div className="card-image">
        {imageFilepath ? (
          <img
            src={`${BASE_URL}/images/${imageFilepath}`}
            height="300px"
            alt={title}
          />
        ) : (
          <div className="placeholder-image">No Image Available</div>
        )}
      </div>
      <div className="card-content">
        <h3>{subtitle}</h3>
        {additionalInfo}
      </div>
      <Barcode id={item._id} />
    </div>
  );
};

export default Card;
