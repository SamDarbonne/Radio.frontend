import { AlbumDocument, BASE_URL, SongDocument } from "../fetch";

import "../styles/SongsTable.scss";
import "../styles/AlbumEntry.scss";
import SongRow from "./SongRow";

const AlbumEntry = ({ row }: { row: AlbumDocument }) => {
  return (
    <div className="album">
      <img
        className="album-image"
        src={`${BASE_URL}/images/${row.imageFilename}`}
        alt={row.name}
      />
      <div className="songs">
        {row.songs!.slice(0, 10).map((song) => {
          console.log(song);
          song.album = row;
          return <SongRow row={song as SongDocument} />;
        })}
      </div>
    </div>
  );
};

export default AlbumEntry;
