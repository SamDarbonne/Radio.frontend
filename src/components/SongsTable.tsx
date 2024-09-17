import { useLoaderData } from "react-router-dom";
import api, { Media, Queries } from "../fetch";

import "../styles/SongsTable.css";
import { useEffect, useRef, ReactElement, useReducer } from "react";
import { Button, Table } from "@mantine/core";
import { formatDuration } from "../utils";

export const loader = async (page: number = 1, query: Queries = "recent") => {
  const mediaData = await api.media.get.all(page, query);
  return mediaData;
};

const SongsTable: () => ReactElement = () => {
  const initialData = useLoaderData() as Media | null;

  const initialState: {
    totalPages: number;
    mediaData: Media["documents"];
    page: number;
    query: Queries;
  } = {
    totalPages: initialData?.totalPages || 1,
    mediaData: initialData?.documents || [],
    page: 1,
    query: "recent",
  };

  type Action =
    | { type: "INCREMENT_PAGE" }
    | {
        type: "SET_MEDIA_DATA";
        payload: { media: Media["documents"]; totalPages: number };
      }
    | { type: "SET_QUERY"; payload: Queries };

  const reducer = (state: typeof initialState, action: Action) => {
    switch (action.type) {
      case "INCREMENT_PAGE":
        return { ...state, page: state.page + 1 };
      case "SET_MEDIA_DATA":
        return {
          ...state,
          mediaData: action.payload.media,
          totalPages: action.payload.totalPages,
        };
      case "SET_QUERY":
        return { ...state, query: action.payload, page: 1 };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const tableBodyRef = useRef<HTMLTableSectionElement>(null);

  const { mediaData, totalPages, page, query } = state;

  useEffect(() => {
    const handleScroll = () => {
      if (tableBodyRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = tableBodyRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 10) {
          if (page < totalPages) {
            dispatch({ type: "INCREMENT_PAGE" });
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
    const fetchMediaData = async (page: number, query: Queries) => {
      const response = await loader(page, query);
      dispatch({
        type: "SET_MEDIA_DATA",
        payload: {
          media:
            page === 1
              ? response.documents
              : [...mediaData, ...response.documents],
          totalPages: response.totalPages,
        },
      });
    };

    if ((page > 1 || mediaData.length > 0) && page <= totalPages) {
      fetchMediaData(page, query);
    }
  }, [page]);

  useEffect(() => {
    if (tableBodyRef.current) {
      tableBodyRef.current.scrollTop = 0;
    }
  }, [query]);

  const rows = mediaData?.map((media) => (
    <Table.Tr key={`${media.title}-${media.artist}`}>
      <Table.Td className="left-justify">{media.title}</Table.Td>
      <Table.Td className="left-justify">{media.artist}</Table.Td>
      <Table.Td>{formatDuration(media.duration)}</Table.Td>
    </Table.Tr>
  ));

  const queryButtons: { label: string; query: Queries }[] = [
    { label: "Recently Added", query: "recent" },
    { label: "Popular", query: "popular" },
  ];

  const buttons = (
    <div className="query-button-row">
      {queryButtons.map(({ label, query }) => (
        <Button
          variant="default"
          className="query-button"
          disabled={state.query === query}
          key={query}
          onClick={() => dispatch({ type: "SET_QUERY", payload: query })}
        >
          {label}
        </Button>
      ))}
    </div>
  );

  return (
    <div className="songs-table">
      <Table className="media-table">
        {buttons}
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
