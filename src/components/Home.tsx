import { ReactElement, useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { Media } from "../fetch";
import { Table } from "@mantine/core";
import api from "../fetch";

import "../styles/Home.css";

const formatDuration = (duration: number): string => {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const loader = async (page: number) => {
  console.log(page);
  const mediaData = await api.media.get.all(page);
  return mediaData;
};

const Home: () => ReactElement = () => {
  const initialData = useLoaderData() as Media | null;
  const [totalPages, setTotalPages] = useState(initialData?.totalPages || 1);
  const [mediaData, setMediaData] = useState(initialData?.documents || []);
  const [page, setPage] = useState(initialData?.page || 1);

  const tableBodyRef = useRef<HTMLTableSectionElement>(null);

  const fetchMediaData = async (page: number) => {
    const response = await loader(page);
    setTotalPages(response.totalPages);
    setMediaData((prevData) => [...prevData, ...response.documents]);
    setPage(response.page);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (tableBodyRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = tableBodyRef.current;
        console.log(scrollTop, scrollHeight, clientHeight);
        if (scrollTop + clientHeight >= scrollHeight - 10) {
          if (page < totalPages) {
            setPage((prev) => prev + 1);
          }
        }
      }
    };
    const tbodyElement = tableBodyRef.current;
    if (tbodyElement) tbodyElement.addEventListener("scroll", handleScroll);
    return () => {
      if (tbodyElement)
        tbodyElement.removeEventListener("scroll", handleScroll);
    };
  }, [page, totalPages]);

  useEffect(() => {
    if (page > 1 && page <= totalPages) {
      fetchMediaData(page);
    }
  }, [page]);
  const rows = mediaData?.map((media) => {
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
      <Table className="media-table">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Title</Table.Th>
            <Table.Th>Artist</Table.Th>
            <Table.Th>Duration</Table.Th>
          </Table.Tr>
        </Table.Thead>
        {rows && (rows.length === 0 ? <div>No media found</div> : null)}
        <Table.Tbody ref={tableBodyRef} className="table-body">
          {rows && (rows.length === 0 ? <div>No media found</div> : null)}
          {rows}
        </Table.Tbody>
      </Table>
    </div>
  );
};

export default Home;
