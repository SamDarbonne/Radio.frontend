import { Table } from "@mantine/core";
import { ArtistDocument } from "../fetch";
import { Link } from "react-router-dom";

// import ArtistRow from "./ArtistRow";
export const ArtistRow = ({ row }: { row: ArtistDocument }) => {
  return (
    <Table.Tr key={`${row.name}`}>
      <Table.Td className="left-justify">
        <Link to={`/artists/${row._id}`}>{row.name}</Link>
      </Table.Td>
    </Table.Tr>
  );
};
