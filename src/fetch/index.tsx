export interface Media {
  id: string;
  title: string;
  artist: string;
  url: string;
  type: string;
  duration: number;
  createdAt: string;
}

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
  }
};

const getMedia: () => Promise<Media[]> = async () => {
  return (await fetchData(`${baseUrl}/media`, "GET")) as Media[];
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
