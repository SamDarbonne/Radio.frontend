import { Link } from "react-router-dom";
import { SongDocument } from "../fetch";

import "../styles/SongsTable.css";
import { Table } from "@mantine/core";
import { formatDuration } from "../utils";
import SongRowActions from "./SongRowActions";

const SongRow = ({ row }: { row: SongDocument }) => {
  return (
    <Table.Tr key={`${row.name}-${row.artists}`}>
      <Table.Td className="left-justify">{row.name}</Table.Td>
      <Table.Td className="left-justify">
        {row.artists.map((artist, index) => {
          let linkName = artist.name;
          if (index !== row.artists.length - 1) linkName += ", ";
          return <Link to={`/artist/${artist._id}`}>{linkName}</Link>;
        })}
      </Table.Td>
      <Table.Td>{formatDuration(row.duration)}</Table.Td>
      <Table.Td>
        <SongRowActions data={row} />
      </Table.Td>
    </Table.Tr>
  );
};

export default SongRow;
