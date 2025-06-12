import MovieCard from "../components/MovieCard";
import { useState, useEffect, useRef } from "react";
import "../css/HomePage.css";
import { fetchMovies } from "../services/api";
import { searchMovies } from "../services/api";

function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreRef = useRef();

  useEffect(() => {
    if (page > 1 && loadMoreRef.current) {
      loadMoreRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [movies]);

  useEffect(() => {
    const loadPopularMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const popularMovies = await fetchMovies(page);
        setMovies((prev) => [...prev, ...popularMovies]);
        if (popularMovies.length === 0) {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Failed to fetch popular movies:", err);
        setError("Failed to fetch movies. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadPopularMovies();
  }, [page]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setError("Please enter a search query");
      return;
    }
    setLoading(true);
    try {
      const searchMoviesResult = await searchMovies(searchQuery);
      setMovies(searchMoviesResult);
      setError(null);
    } catch (err) {
      console.error("Failed to search movies:", err);
      setError("Failed to search movies");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <div className="loading-spinner">:</div>
      ) : (
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      {hasMore && !loading && (
        <button
          ref={loadMoreRef}
          type="button"
          className="load-more-button"
          onClick={() => setPage((prev) => prev + 1)}
        >
          Load More
        </button>
      )}
    </div>
  );
}

export default HomePage;
