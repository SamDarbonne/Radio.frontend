import { Link, useLoaderData } from "react-router-dom";
import api, { Song, Query } from "../fetch";

import "../styles/SongsTable.css";
import { useEffect, useRef, ReactElement, useReducer } from "react";
import { ActionIcon, Button, Menu, Table } from "@mantine/core";
import { formatDuration } from "../utils";

export const loader = async (page: number = 1, query: Query = "recent") => {
  return await api.songs.get.all(page, query);
};

const SongsTable: () => ReactElement = () => {
  const initialData = useLoaderData() as Song | null;

  const initialState: {
    totalPages: number;
    songsData: Song["documents"];
    page: number;
    query: Query;
  } = {
    totalPages: initialData?.totalPages || 1,
    songsData: initialData?.documents || [],
    page: 1,
    query: "recent",
  };

  type Action =
    | { type: "INCREMENT_PAGE" }
    | {
        type: "SET_SONGS_DATA";
        payload: { songs: Song["documents"]; totalPages: number };
      }
    | { type: "SET_QUERY"; payload: Query };

  const reducer = (state: typeof initialState, action: Action) => {
    switch (action.type) {
      case "INCREMENT_PAGE":
        return { ...state, page: state.page + 1 };
      case "SET_SONGS_DATA":
        return {
          ...state,
          songsData: action.payload.songs,
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

  const { songsData: songsData, totalPages, page, query } = state;

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
    const fetchSongsData = async (page: number, query: Query) => {
      const response = await loader(page, query);
      console.log(response);
      dispatch({
        type: "SET_SONGS_DATA",
        payload: {
          songs:
            page === 1
              ? response.documents
              : [...songsData, ...response.documents],
          totalPages: response.totalPages,
        },
      });
    };

    if (page <= totalPages) {
      fetchSongsData(page, query);
    }
  }, [page, query]);

  useEffect(() => {
    if (tableBodyRef.current) {
      tableBodyRef.current.scrollTop = 0;
    }
  }, [query]);
  console.log(songsData);
  const rows = songsData?.map((song) => (
    <Table.Tr key={`${song.name}-${song.artists}`}>
      <Table.Td className="left-justify">{song.name}</Table.Td>
      <Table.Td className="left-justify">
        {song.artists.map((artist) => (
          <Link to={`/artists/${artist._id}`}>{artist.name}</Link>
        ))}
      </Table.Td>
      <Table.Td>{formatDuration(song.duration)}</Table.Td>
      <Table.Td>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon variant="default">...</ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item>Play</Menu.Item>
            <Menu.Item>Edit</Menu.Item>
            <Menu.Item color="red">Delete</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  ));

  const queryButtons: { label: string; query: Query }[] = [
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
      {buttons}
      <Table className="songs-table">
        <Table.Thead></Table.Thead>
        <Table.Tbody ref={tableBodyRef} className="table-body">
          {rows}
        </Table.Tbody>
      </Table>
    </div>
  );
};

export default SongsTable;
