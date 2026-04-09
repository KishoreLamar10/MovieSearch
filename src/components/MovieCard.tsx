import "../css/MovieCard.css";
import { Link } from "react-router-dom";
import { getImageUrl } from "../services/api";
import { useMovieStore, Movie } from "../store/movieStore";
import { motion } from "framer-motion";

interface MovieCardProps {
  movie: Movie;
}

function MovieCard({ movie }: MovieCardProps) {
  const { addFavorite, removeFavorite, isFavorite } = useMovieStore();
  const favorite = isFavorite(movie.id);

  function onFavoriteClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (favorite) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  }

  const rating = movie.vote_average || 0;

  return (
    <motion.div 
      className="movie-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/movie/${movie.id}`} className="movie-link-wrapper">
        <div className="movie-poster">
          <img
            src={getImageUrl(movie.poster_path, "w500")}
            alt={movie.title}
            loading="lazy"
          />
          <div className="movie-overlay">
             <div className="movie-details-preview">
                <p>{movie.overview?.substring(0, 100)}...</p>
             </div>
          </div>
        </div>
      </Link>
      
      <button
        className={`favorite-btn ${favorite ? "active" : ""}`}
        onClick={onFavoriteClick}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        {favorite ? "❤️" : "🤍"}
      </button>

      <div className="movie-info">
        <h3>{movie.title}</h3>
        <div className="movie-meta">
          <span>{movie.release_date?.split("-")[0] || "N/A"}</span>
          <div className="rating-badge">
            <span>⭐</span>
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default MovieCard;



