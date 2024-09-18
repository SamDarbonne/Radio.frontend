export interface SongDocument {
  _id: string;
  name: string;
  artists: Partial<ArtistDocument>[];
  url: string;
  type: string;
  duration: number;
  createdAt: string;
}

export interface Song {
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

export interface AlbumDocument {
  name: string;
  artist: string;
  releaseDate: Date;
  lastPlayed?: Date;
  imageFilename?: string;
}
export type Query = "recent" | "popular";

type MethodOptions = "GET" | "POST" | "PUT" | "DELETE";

const baseUrl = "http://localhost:4000";

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

const uploadSongs = async (formData: FormData): Promise<Song[]> => {
  console.log("uploading songs");
  formData.forEach((value, key) => {
    console.log(key, value);
  });
  return await fetchData(`${baseUrl}/songs`, "POST", formData);
};

const getSongs: (page: number, query: Query) => Promise<Song> = async (
  page = 1,
  query = "recent"
) => {
  const queryObject = new URLSearchParams({ page: page.toString(), query });
  const queryString = queryObject.toString();
  console.log({ queryString });
  console.log(`${baseUrl}/songs?${queryObject}`);
  return (await fetchData(`${baseUrl}/songs?${queryString}`, "GET")) as Song;
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
  },
};
