import MovieCard from "../components/MovieCard";
import Skeleton from "../components/Skeleton";
import FilterBar from "../components/FilterBar";
import { useState, useEffect, useRef } from "react";
import "../css/HomePage.css";
import { useMovies, SortOption } from "../hooks/useMovies";
import { fetchTrending, getImageUrl } from "../services/api";
import { Movie, useMovieStore } from "../store/movieStore";

function HomePage() {
  const { searchQuery } = useMovieStore();
  const { 
    movies, 
    loading, 
    error, 
    hasMore, 
    loadMore, 
    selectedGenre,
    setSelectedGenre,
    sortBy,
    setSortBy
  } = useMovies();

  const [trendingMovie, setTrendingMovie] = useState<Movie | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  // Fetch trending for Hero
  useEffect(() => {
    const loadHero = async () => {
      try {
        const results = await fetchTrending();
        if (results.length > 0) {
          setTrendingMovie(results[0]);
        }
      } catch (err) {
        console.error("Hero fetch error:", err);
      }
    };
    loadHero();
  }, []);

  // Infinite Scroll Observer
  const lastMovieElementRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });

    if (lastMovieElementRef.current) {
      observer.current.observe(lastMovieElementRef.current);
    }
  }, [loading, hasMore]);

  const showHero = !searchQuery && !selectedGenre;

  return (
    <div className="home">
      {/* Hero Section */}
      {showHero && (
        trendingMovie ? (
          <div className="hero">
            <img 
              src={getImageUrl(trendingMovie.backdrop_path, "original")} 
              alt={trendingMovie.title} 
              className="hero-backdrop"
            />
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <span>Trending Today</span>
              <h1>{trendingMovie.title}</h1>
              <p>{trendingMovie.overview}</p>
            </div>
          </div>
        ) : <Skeleton type="hero" />
      )}

      <div className={`content-section ${!showHero ? 'search-active' : ''}`}>
        <FilterBar 
          selectedGenre={selectedGenre}
          onGenreSelect={setSelectedGenre}
          sortBy={sortBy}
          onSortChange={(sort) => setSortBy(sort as SortOption)}
        />

        <h2 className="section-title">
          {searchQuery ? `Search results for "${searchQuery}"` : "Discover Movies"}
        </h2>

        {error && (
          <div className="error-message">
            {error.includes("401") || error.includes("Unauthorized") ? (
              <div>
                <p>Missing TMDB API Key!</p>
                <small>Please add <code>VITE_TMDB_API_KEY</code> to your <code>.env</code> file.</small>
              </div>
            ) : error}
          </div>
        )}

        <div className="movies-grid">
          {movies.map((movie, index) => (
            <MovieCard key={`${movie.id}-${index}`} movie={movie} />
          ))}
          
          {loading && Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} type="card" />
          ))}
        </div>

        {/* Infinite Scroll Trigger */}
        <div ref={lastMovieElementRef} className="infinite-scroll-trigger">
          {loading && movies.length > 0 && <div className="loading-spinner"></div>}
        </div>
      </div>
    </div>
  );
}

export default HomePage;



