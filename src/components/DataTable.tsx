import { Query } from "../fetch";

import "../styles/SongsTable.scss";
import { useEffect, useRef, useReducer } from "react";
import { Button, Table } from "@mantine/core";

type DataResponse<T> = {
  documents: T[];
  totalPages: number;
};

const DataTable = <T,>({
  initialData,
  dataLoader,
  rowElement,
}: {
  initialData: DataResponse<T>;
  rowElement: ({ row }: { row: T }) => JSX.Element;
  dataLoader: (
    page: number,
    query: Query,
    id?: string
  ) => Promise<DataResponse<T>>;
}) => {
  const initialState: {
    totalPages: number;
    data: T[];
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
        payload: {
          data: T[];
          totalPages: number;
        };
      }
    | { type: "SET_QUERY"; payload: Query };

  const reducer = (state: typeof initialState, action: Action) => {
    switch (action.type) {
      case "INCREMENT_PAGE":
        return { ...state, page: state.page + 1 };
      case "SET_DATA":
        return {
          ...state,
          data: action.payload.data,
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

  const { data, totalPages, page, query } = state;

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
      const response = await dataLoader(page, query);
      dispatch({
        type: "SET_DATA",
        payload: {
          data:
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

  const rows = data?.map((row) => rowElement({ row }));

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
    <div className="data-table">
      {buttons}
      <Table className="media-table">
        <Table.Thead></Table.Thead>
        <Table.Tbody ref={tableBodyRef} className="table-body">
          {rows}
        </Table.Tbody>
      </Table>
    </div>
  );
};

export default DataTable;
