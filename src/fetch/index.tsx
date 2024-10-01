export interface SongDocument {
  _id: string;
  name: string;
  artists: Partial<ArtistDocument>[];
  url: string;
  type: string;
  album: Partial<AlbumDocument>;
  duration: number;
  createdAt: string;
}

export interface PaginatedData<T> {
  page: number;
  totalPages: number;
  documents: T[];
}

export type SongData = PaginatedData<SongDocument>;
export type ArtistData = PaginatedData<ArtistDocument>;
export type AlbumData = PaginatedData<AlbumDocument>;
export type PlaylistsData = PaginatedData<PlaylistDocument>;
export interface PlaylistData extends PaginatedData<SongDocument> {
  theme: string;
  id: string;
  name: string;
  dateAdded: string;
}

export interface ArtistDocument {
  _id: string;
  name: string;
  pseudonyms?: string[];
  albums: AlbumDocument[];
  dateAdded: Date;
}

export interface AlbumDocument {
  _id: string;
  name: string;
  artists: Partial<ArtistDocument>[];
  songs: Partial<SongDocument>[];
  releaseDate: Date;
  lastPlayed?: Date;
  imageFilename?: string;
}

export interface PlaylistDocument {
  _id: string;
  name: string;
  songs: SongDocument[];
  theme: string;
  page: number;
  totalPages: number;
  dateAdded: Date;
}

export type Query = "recent" | "popular";

type MethodOptions = "GET" | "POST" | "PUT" | "DELETE";

export const BASE_URL = "http://localhost:4000";

const fetchData = async (
  url: string,
  method: MethodOptions,
  body?: object | FormData
) => {
  try {
    const options: RequestInit = {
      method,
    };
    if (body) {
      if (body instanceof FormData) {
        options.body = body;
      } else {
        options.headers = {
          "Content-Type": "application/json",
        };
        options.body = JSON.stringify(body);
      }
    }
    const response = await fetch(url, options);
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const uploadSongs = async (formData: FormData): Promise<SongData[]> => {
  return await fetchData(`${BASE_URL}/songs`, "POST", formData);
};

const getSongs: (page: number, query: Query) => Promise<SongData> = async (
  page = 1,
  query = "recent"
) => {
  const queryObject = new URLSearchParams({ page: page.toString(), query });
  const queryString = queryObject.toString();
  return (await fetchData(
    `${BASE_URL}/songs?${queryString}`,
    "GET"
  )) as SongData;
};

const getArtists: (page: number, query: Query) => Promise<ArtistData> = async (
  page = 1,
  query = "recent"
) => {
  const queryObject = new URLSearchParams({ page: page.toString(), query });
  const queryString = queryObject.toString();
  return (await fetchData(
    `${BASE_URL}/artists?${queryString}`,
    "GET"
  )) as ArtistData;
};

const getAlbums: (page: number, query: Query) => Promise<AlbumData> = async (
  page = 1,
  query = "recent"
) => {
  const queryObject = new URLSearchParams({ page: page.toString(), query });
  const queryString = queryObject.toString();
  return (await fetchData(
    `${BASE_URL}/albums?${queryString}`,
    "GET"
  )) as AlbumData;
};

const getAlbumsByArtist = async (id: string, page: number, query: Query) => {
  const queryObject = new URLSearchParams({ page: page.toString(), query });
  const queryString = queryObject.toString();
  return (await fetchData(
    `${BASE_URL}/albums/artist/${id}?${queryString}`,
    "GET"
  )) as AlbumData;
};

const getAlbumById: (id: string) => Promise<AlbumDocument> = async (
  id: string
) => {
  return (await fetchData(`${BASE_URL}/albums/${id}`, "GET")) as AlbumDocument;
};

const getArtist = async (id: string) => {
  return await fetchData(`${BASE_URL}/artists/${id}`, "GET");
};

const playSong = async (id: string) => {
  console.log("playing song", id);
  return await fetchData(`${BASE_URL}/songs/${id}/play`, "POST");
};

const getSongById = async (id: string) => {
  return await fetchData(`${BASE_URL}/songs/${id}`, "GET");
};

const getPlaylists: (
  page?: number,
  query?: Query
) => Promise<PlaylistsData> = async (page = 1, query = "recent") => {
  const queryObject = new URLSearchParams({ page: page.toString(), query });
  const queryString = queryObject.toString();
  return (await fetchData(
    `${BASE_URL}/playlists?${queryString}`,
    "GET"
  )) as PlaylistsData;
};

const getPlaylistById: (
  id: string,
  page: number
) => Promise<PlaylistData> = async (id: string, page: number) => {
  console.log({ id, page });
  const queryObject = new URLSearchParams({ page: page.toString() });
  const queryString = queryObject.toString();
  return (await fetchData(
    `${BASE_URL}/playlists/${id}?${queryString}`,
    "GET"
  )) as PlaylistData;
};

const deletePlaylist = async (id: string) => {
  return await fetchData(`${BASE_URL}/playlists/${id}`, "DELETE");
};

const createPlaylist = async (formData?: FormData) => {
  return await fetchData(`${BASE_URL}/playlists`, "POST", formData);
};

const updatePlaylist = async (
  id: string,
  { songs, page }: { songs: string[]; page: number }
) => {
  return await fetchData(`${BASE_URL}/playlists/${id}`, "PUT", {
    songs,
    page,
  });
};

const addSongToPlaylist = async (songId: string, playlistId: string) => {
  return await fetchData(`${BASE_URL}/playlists/${playlistId}/song`, "POST", {
    songId,
  });
};

export default {
  songs: {
    get: {
      one: getSongById,
      all: getSongs,
    },
    upload: uploadSongs,
    // create: createMedia,
    // update: updateMedia,
    // delete: deleteMedia,
    play: playSong,
  },
  artists: {
    get: {
      all: getArtists,
      one: getArtist,
    },
  },
  playlists: {
    get: {
      all: getPlaylists,
      one: getPlaylistById,
    },
    delete: deletePlaylist,
    create: createPlaylist,
    update: updatePlaylist,
    addSongToPlaylist,
  },
  albums: {
    get: {
      all: getAlbums,
      one: getAlbumById,
      artist: getAlbumsByArtist,
    },
  },
};
