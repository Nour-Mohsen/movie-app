export const getMoviePosterUrl = (posterPath?: string | null) =>
  posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : "https://placehold.co/600x400/1a1a1a/FFFFFF.png";
