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
      item.artists?.map((artist) => artist.name).join(", ") ?? "unknown";
    additionalInfo = (
      <div className="additional-info">
        <div>
          <div className="label">Album:</div>
          <div className="value">{item.album.name}</div>
        </div>
        <div>Duration: {formatDuration(item.duration)}</div>
      </div>
    );
  } else if (isAlbum(item)) {
    imageFilepath = item.imageFilename ?? "";
    title = item.name;
    subtitle = item.artists.map((artist) => artist.name).join(", ");
    additionalInfo = (
      <div className="additional-info">
        Release Date: {item.releaseDate.toString()}
      </div>
    );
  }
  return (
    <div className="card">
      <div className="card-header">{title}</div>
      <div className="card-content">
        <div className="card-image">
          {imageFilepath ? (
            <img src={`${BASE_URL}/images/${imageFilepath}`} alt={title} />
          ) : (
            <div className="placeholder-image">No Image Available</div>
          )}
        </div>
        <div className="description">
          <div className="subtitle">{subtitle}</div>
          {additionalInfo}
        </div>
      </div>
      <Barcode id={item._id} />
    </div>
  );
};

export default Card;
