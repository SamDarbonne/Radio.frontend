import { AlbumDocument, BASE_URL } from "../fetch";

import "../styles/SongsTable.scss";

const AlbumEntry = ({ row }: { row: AlbumDocument }) => {
  return (
    <div className="album">
      <img
        height="150"
        src={`${BASE_URL}/images/${row.imageFilename}`}
        alt={row.name}
      />
      {row.songs!.map((song) => (
        <div key={song._id}>{song.name}</div>
      ))}
    </div>
  );
};

export default AlbumEntry;
