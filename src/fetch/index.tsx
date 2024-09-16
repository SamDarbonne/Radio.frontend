export interface MediaDocument {
  id: string;
  title: string;
  artist: string;
  url: string;
  type: string;
  duration: number;
  createdAt: string;
}

export interface Media {
  documents: MediaDocument[];
  page: number;
  totalPages: number;
}

export type Queries = "recent" | "popular";

type MethodOptions = "GET" | "POST" | "PUT" | "DELETE";

const baseUrl = "http://localhost:4000";

const fetchData = async (url: string, method: MethodOptions, body?: object) => {
  try {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(url, options);
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getMedia: (page: number, query: Queries) => Promise<Media> = async (
  page = 1,
  query = "recent"
) => {
  const queryObject = new URLSearchParams({ page: page.toString(), query });
  const queryString = queryObject.toString();
  console.log(`${baseUrl}/media${queryString}`);
  return (await fetchData(`${baseUrl}/media?${queryString}`, "GET")) as Media;
};

export default {
  media: {
    get: {
      // one: getMediaById,
      all: getMedia,
    },
    // create: createMedia,
    // update: updateMedia,
    // delete: deleteMedia,
  },
};
