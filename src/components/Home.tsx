import { ReactElement } from "react";
import { useLoaderData } from "react-router-dom";
import { Media } from "../fetch";
import { Table } from "@mantine/core";

import "../styles/Home.css";

const formatDuration = (duration: number): string => {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const Home: () => ReactElement = () => {
  const mediaData = useLoaderData() as Media[];
  console.log(mediaData);
  const rows = mediaData.map((media) => {
    return (
      <Table.Tr key={`${media.title}-${media.artist}`}>
        <Table.Td className="left-justify">{media.title}</Table.Td>
        <Table.Td className="left-justify">{media.artist}</Table.Td>
        <Table.Td>{formatDuration(media.duration)}</Table.Td>
      </Table.Tr>
    );
  });
  return (
    <div className="home">
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Title</Table.Th>
            <Table.Th>Artist</Table.Th>
            <Table.Th>Duration</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </div>
  );
};

export default Home;
