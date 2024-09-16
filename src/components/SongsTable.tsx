import { useLoaderData } from "react-router-dom";
import api, { Media } from "../fetch";

import "../styles/SongsTable.css";
import { useEffect, useRef, useState, ReactElement } from "react";
import { Table } from "@mantine/core";

export const loader = async (page: number = 1) => {
  const mediaData = await api.media.get.all(page);
  return mediaData;
};

const formatDuration = (duration: number): string => {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const SongsTable: () => ReactElement = () => {
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
  const rows = mediaData?.map((media) => (
    <Table.Tr key={`${media.title}-${media.artist}`}>
      <Table.Td className="left-justify">{media.title}</Table.Td>
      <Table.Td className="left-justify">{media.artist}</Table.Td>
      <Table.Td>{formatDuration(media.duration)}</Table.Td>
    </Table.Tr>
  ));
  return (
    <div className="songs-table">
      <Table className="media-table">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Title</Table.Th>
            <Table.Th>Artist</Table.Th>
            <Table.Th>Duration</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody ref={tableBodyRef} className="table-body">
          {rows}
        </Table.Tbody>
      </Table>
    </div>
  );
};

export default SongsTable;
