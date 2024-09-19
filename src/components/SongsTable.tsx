import { LoaderFunction, useLoaderData } from "react-router-dom";
import api, { SongData, Query, SongDocument } from "../fetch";

import "../styles/SongsTable.css";
import { useEffect, useRef, ReactElement, useReducer } from "react";
import { Button, Table } from "@mantine/core";
import SongRow from "./SongRow";

const fetchData = async (page: number, query: Query) => {
  return await api.songs.get.all(page, query);
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const query = (url.searchParams.get("query") as Query) || "recent";
  return await fetchData(page, query);
};

const SongsTable: () => ReactElement = () => {
  const initialData = useLoaderData() as SongData | null;

  const initialState: {
    totalPages: number;
    data: SongDocument[];
    page: number;
    query: Query;
  } = {
    totalPages: initialData?.totalPages || 1,
    data: initialData?.documents || [],
    page: 1,
    query: "recent",
  };

  type Action =
    | { type: "INCREMENT_PAGE" }
    | {
        type: "SET_DATA";
        payload: { songs: SongDocument[]; totalPages: number };
      }
    | { type: "SET_QUERY"; payload: Query };

  const reducer = (state: typeof initialState, action: Action) => {
    switch (action.type) {
      case "INCREMENT_PAGE":
        return { ...state, page: state.page + 1 };
      case "SET_DATA":
        return {
          ...state,
          data: action.payload.songs,
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

  const { data: data, totalPages, page, query } = state;

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
    const updateData = async (page: number, query: Query) => {
      const response = await fetchData(page, query);
      console.log(response);
      dispatch({
        type: "SET_DATA",
        payload: {
          songs:
            page === 1 ? response.documents : [...data, ...response.documents],
          totalPages: response.totalPages,
        },
      });
    };

    if (page <= totalPages) {
      updateData(page, query);
    }
  }, [page, query]);

  useEffect(() => {
    if (tableBodyRef.current) {
      tableBodyRef.current.scrollTop = 0;
    }
  }, [query]);

  const rows = data?.map((song) => <SongRow song={song} />);

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
