import { Link } from "react-router-dom";
import { SongDocument } from "../fetch";

import "../styles/SongsTable.css";
import { Table } from "@mantine/core";
import { formatDuration } from "../utils";
import SongRowActions from "./SongRowActions";

const SongRow = ({ song }: { song: SongDocument }) => {
  return (
    <Table.Tr key={`${song.name}-${song.artists}`}>
      <Table.Td className="left-justify">{song.name}</Table.Td>
      <Table.Td className="left-justify">
        {song.artists.map((artist) => (
          <Link to={`/artists/${artist._id}`}>{artist.name}</Link>
        ))}
      </Table.Td>
      <Table.Td>{formatDuration(song.duration)}</Table.Td>
      <Table.Td>
        <SongRowActions id={song._id} />
      </Table.Td>
    </Table.Tr>
  );
};

export default SongRow;
