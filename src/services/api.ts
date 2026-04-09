const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export interface Genre {
  id: number;
  name: string;
}

export interface Review {
  id: string;
  author: string;
  content: string;
  created_at: string;
}

export const fetchMovies = async (page: number = 1) => {
  const response = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
  );
  if (!response.ok) throw new Error(`Failed to fetch movies: ${response.status}`);
  const data = await response.json();
  return data.results;
};

export const fetchTrending = async () => {
  const response = await fetch(
    `${BASE_URL}/trending/movie/day?api_key=${API_KEY}`
  );
  if (!response.ok) throw new Error(`Failed to fetch trending movies: ${response.status}`);
  const data = await response.json();
  return data.results;
};

export const fetchMovieDetails = async (id: string | number) => {
  const response = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=videos,credits,reviews,similar`
  );
  if (!response.ok) throw new Error(`Failed to fetch movie details: ${response.status}`);
  const data = await response.json();
  return data;
};

export const searchMovies = async (query: string) => {
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}`
  );
  if (!response.ok) throw new Error(`Failed to search movies: ${response.status}`);
  const data = await response.json();
  return data.results;
};

export const fetchGenres = async (): Promise<Genre[]> => {
  const response = await fetch(
    `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
  );
  if (!response.ok) throw new Error(`Failed to fetch genres: ${response.status}`);
  const data = await response.json();
  return data.genres;
};

export const discoverMovies = async (
  page: number = 1, 
  genreId: number | null = null, 
  sortBy: string = "popularity.desc"
) => {
  let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}&sort_by=${sortBy}&include_adult=false`;
  if (genreId) {
    url += `&with_genres=${genreId}`;
  }
  
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to discover movies: ${response.status}`);
  const data = await response.json();
  return data.results;
};

export const getImageUrl = (path: string | null | undefined, size: string = "w500") => {
  if (!path) return "https://via.placeholder.com/500x750?text=No+Image";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};



