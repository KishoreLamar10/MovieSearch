import { useState, useCallback, useEffect } from "react";
import { discoverMovies, searchMovies } from "../services/api";
import { Movie, useMovieStore } from "../store/movieStore";

export type SortOption = "popularity.desc" | "vote_average.desc" | "release_date.desc";

export const useMovies = () => {
  const { searchQuery } = useMovieStore();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("popularity.desc");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const loadMovies = useCallback(async (isNewSearch = false) => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      let results: Movie[] = [];
      const currentPage = isNewSearch ? 1 : page;

      if (searchQuery.trim()) {
        results = await searchMovies(searchQuery);
        setHasMore(false);
      } else {
        results = await discoverMovies(currentPage, selectedGenre, sortBy);
        setHasMore(results.length > 0);
      }

      setMovies((prev) => (isNewSearch ? results : [...prev, ...results]));
      setPage(currentPage + 1);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [page, searchQuery, selectedGenre, sortBy, loading]);

  useEffect(() => {
    if (isInitialLoad) {
      loadMovies(true);
      return;
    }

    if (searchQuery.trim()) {
      const timer = setTimeout(() => {
        loadMovies(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      loadMovies(true);
    }
  }, [searchQuery, selectedGenre, sortBy]);

  return {
    movies,
    loading,
    error,
    hasMore,
    loadMore: () => loadMovies(false),
    selectedGenre,
    setSelectedGenre: (id: number | null) => {
      setSelectedGenre(id);
      setPage(1);
    },
    sortBy,
    setSortBy: (sort: SortOption) => {
      setSortBy(sort);
      setPage(1);
    }
  };
};




