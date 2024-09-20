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

export interface SongData {
  documents: SongDocument[];
  page: number;
  totalPages: number;
  id: string;
}

export interface ArtistDocument {
  _id: string;
  name: string;
  pseudonyms?: string[];
  albums: AlbumDocument[];
  dateAdded: Date;
}

export interface ArtistData {
  documents: ArtistDocument[];
  page: number;
  totalPages: number;
}

export interface AlbumDocument {
  _id: string;
  name: string;
  artists: Partial<ArtistDocument>[];
  releaseDate: Date;
  lastPlayed?: Date;
  imageFilename?: string;
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
  console.log("uploading songs");
  formData.forEach((value, key) => {
    console.log(key, value);
  });
  return await fetchData(`${BASE_URL}/songs`, "POST", formData);
};

const getSongs: (page: number, query: Query) => Promise<SongData> = async (
  page = 1,
  query = "recent"
) => {
  const queryObject = new URLSearchParams({ page: page.toString(), query });
  const queryString = queryObject.toString();
  console.log({ queryString });
  console.log(`${BASE_URL}/songs?${queryObject}`);
  return (await fetchData(
    `${BASE_URL}/songs?${queryString}`,
    "GET"
  )) as SongData;
};

const getArtists: (page: number, query: Query) => Promise<ArtistData> = async (
  page = 1,
  query = "recent"
) => {
  console.log("getArtists");
  const queryObject = new URLSearchParams({ page: page.toString(), query });
  const queryString = queryObject.toString();
  return (await fetchData(
    `${BASE_URL}/artists?${queryString}`,
    "GET"
  )) as ArtistData;
};

const getArtist = async (id: string) => {
  return await fetchData(`${BASE_URL}/artists/${id}`, "GET");
};

const playSong = async (id: string) => {
  console.log("playing song", id);
  return await fetchData(`${BASE_URL}/songs/${id}/play`, "POST");
};

export default {
  songs: {
    get: {
      // one: getMediaById,
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
};
