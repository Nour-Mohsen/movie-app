export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  },
};

export const fetchMovies = async ({
  query,
}: {
  query: string;
}): Promise<Movie[]> => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results;
};

export const fetchMovieDetails = async (
  movieId: string
): Promise<MovieDetails> => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`,
      {
        method: "GET",
        headers: TMDB_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch movie details: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

export const fetchMovieVideos = async (
  movieId: string,
): Promise<MovieVideo[]> => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_CONFIG.API_KEY}`,
    {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch movie videos: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results ?? [];
};

const pickYouTubeVideo = (
  videos: MovieVideo[],
  type: string,
): MovieVideo | undefined =>
  videos.find((video) => video.site === "YouTube" && video.type === type);

const pickBestYouTubeVideo = (videos: MovieVideo[]): MovieVideo | undefined =>
  pickYouTubeVideo(videos, "Trailer") ??
  pickYouTubeVideo(videos, "Teaser") ??
  videos.find((item) => item.site === "YouTube");

export const getYouTubeTrailerKey = (videos: MovieVideo[]): string | null => {
  const video = pickBestYouTubeVideo(videos);
  return video?.key ?? null;
};

const getWebEmbedOrigin = (): string => {
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }
  return "https://com.anonymous.app";
};

export const WEBVIEW_EMBED_ORIGIN = getWebEmbedOrigin();

// YouTube requires a valid embed origin in WebView HTML to avoid error 152.
export const getYouTubeTrailerEmbedHtml = (videoKey: string): string => {
  const embedParams = new URLSearchParams({
    autoplay: "1",
    playsinline: "1",
    modestbranding: "1",
    rel: "0",
    enablejsapi: "1",
    origin: WEBVIEW_EMBED_ORIGIN,
  });

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoKey}?${embedParams.toString()}`;

  return `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <meta name="referrer" content="strict-origin-when-cross-origin">
    <style>
      * { margin: 0; padding: 0; }
      html, body { width: 100%; height: 100%; background: #000; overflow: hidden; }
      iframe { width: 100%; height: 100%; border: 0; }
    </style>
  </head>
  <body>
    <iframe
      src="${embedUrl}"
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowfullscreen
      referrerpolicy="strict-origin-when-cross-origin"
    ></iframe>
  </body>
</html>`;
};

export const getMoviePageUrl = (movie: MovieDetails): string =>
  movie.homepage?.trim() || `https://www.themoviedb.org/movie/${movie.id}`;
