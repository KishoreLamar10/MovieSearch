import { useState, useEffect } from "react";
import { fetchMovieDetails } from "../services/api";

export const useMovieDetails = (id: string | undefined) => {
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMovieDetails(id);
        setMovie(data);
      } catch (err: any) {
        setError(err.message || "Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  return { movie, loading, error };
};

