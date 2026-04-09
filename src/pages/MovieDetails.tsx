import { useParams, useNavigate } from "react-router-dom";
import { useMovieDetails } from "../hooks/useMovieDetails";
import { getImageUrl, Review } from "../services/api";
import Skeleton from "../components/Skeleton";
import MovieCard from "../components/MovieCard";
import { useMovieStore, Movie } from "../store/movieStore";
import "../css/MovieDetails.css";

function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { movie, loading, error } = useMovieDetails(id);
  const { 
    addToWatchlist, 
    removeFromWatchlist, 
    isInWatchlist,
    addFavorite,
    removeFavorite,
    isFavorite
  } = useMovieStore();

  if (loading) return (
    <div className="movie-details">
      <Skeleton type="hero" />
      <div className="details-body">
        <Skeleton type="card" />
        <Skeleton type="card" />
      </div>
    </div>
  );
  
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!movie) return null;

  const trailer = movie.videos?.results?.find(
    (v: any) => v.type === "Trailer" && v.site === "YouTube"
  );

  const favorite = isFavorite(movie.id);
  const watched = isInWatchlist(movie.id);

  const toggleFavorite = () => {
    favorite ? removeFavorite(movie.id) : addFavorite(movie as Movie);
  };

  const toggleWatchlist = () => {
    watched ? removeFromWatchlist(movie.id) : addToWatchlist(movie as Movie);
  };

  return (
    <div className="movie-details">
      {/* Hero Section with Backdrop */}
      <div className="details-hero">
        <img 
          src={getImageUrl(movie.backdrop_path, "original")} 
          alt={movie.title} 
          className="details-backdrop"
        />
        <div className="details-hero-overlay"></div>
        
        <div className="details-header-content">
          <img 
            src={getImageUrl(movie.poster_path, "w500")} 
            alt={movie.title} 
            className="details-poster"
          />
          <div className="details-info-main">
            <div className="details-meta">
              <span>{movie.release_date?.split("-")[0]}</span>
              <span>•</span>
              <span>{movie.runtime} min</span>
              <span>•</span>
              <span className="rating-badge">⭐ {movie.vote_average?.toFixed(1)}</span>
            </div>
            <h1>{movie.title}</h1>
            <div className="genres-list">
              {movie.genres?.map((genre: any) => (
                <span key={genre.id} className="genre-tag">{genre.name}</span>
              ))}
            </div>
            <div className="details-actions">
              {trailer && (
                <a 
                  href={`https://www.youtube.com/watch?v=${trailer.key}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  ▶ Watch Trailer
                </a>
              )}
              <button 
                className={`btn-secondary ${favorite ? "active" : ""}`}
                onClick={toggleFavorite}
              >
                {favorite ? "❤️ Favorited" : "🤍 Favorite"}
              </button>
              <button 
                className={`btn-secondary ${watched ? "active" : ""}`}
                onClick={toggleWatchlist}
              >
                {watched ? "🔖 In Watchlist" : "📑 Watchlist"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="details-body">
        <div className="details-content">
          <section className="details-section">
            <h2>Overview</h2>
            <p>{movie.overview}</p>
          </section>

          <section className="details-section">
            <h2>Top Cast</h2>
            <div className="cast-grid">
              {movie.credits?.cast?.slice(0, 6).map((person: any) => (
                <div key={person.id} className="cast-card">
                  <img 
                    src={getImageUrl(person.profile_path, "w185")} 
                    alt={person.name} 
                    className="cast-image"
                  />
                  <h4>{person.name}</h4>
                  <p>{person.character}</p>
                </div>
              ))}
            </div>
          </section>

          {movie.reviews?.results?.length > 0 && (
            <section className="details-section">
              <h2>User Reviews</h2>
              <div className="reviews-list">
                {movie.reviews.results.slice(0, 3).map((review: Review) => (
                  <div key={review.id} className="review-card">
                    <h4>{review.author}</h4>
                    <p>{review.content.substring(0, 250)}...</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {movie.similar?.results?.length > 0 && (
            <section className="details-section">
              <h2>Similar Movies</h2>
              <div className="similar-grid">
                {movie.similar.results.slice(0, 4).map((m: Movie) => (
                  <MovieCard key={m.id} movie={m} />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="sidebar-info">
          <div className="info-item">
            <h4>Status</h4>
            <p>{movie.status}</p>
          </div>
          <div className="info-item">
            <h4>Original Language</h4>
            <p>{movie.original_language?.toUpperCase()}</p>
          </div>
          <div className="info-item">
            <h4>Budget</h4>
            <p>{movie.budget > 0 ? `$${movie.budget.toLocaleString()}` : "N/A"}</p>
          </div>
          <div className="info-item">
            <h4>Revenue</h4>
            <p>{movie.revenue > 0 ? `$${movie.revenue.toLocaleString()}` : "N/A"}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default MovieDetails;


