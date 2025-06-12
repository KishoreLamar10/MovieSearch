import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMovieDetails } from "../services/api";
import "../css/MovieDetails.css";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMovieDetails = async () => {
      try {
        const movieData = await fetchMovieDetails(id);
        setMovie(movieData);
      } catch (err) {
        console.error("Failed to fetch movie details:", err);
        setError("Failed to load movie details.");
      } finally {
        setLoading(false);
      }
    };
    loadMovieDetails();
  }, [id]);

  if (loading) return <div className="loading-spinner">:</div>;
  if (error) return <p className="error-message">{error}</p>;
  if (!movie) return null;

  return (
    <div className="movie-details">
      <button className="back-button" onClick={() => navigate("/")}>
        ← Back to Home
      </button>
      <h1>{movie.title}</h1>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={`${movie.title} poster`}
      />

      <div className="movie-details-section">
        <h2>Release Date</h2>
        <p>{movie.release_date}</p>
      </div>

      <div className="movie-details-section">
        <h2>Rating</h2>
        <p>{movie.vote_average}</p>
      </div>

      <div className="movie-details-section">
        <h2>Runtime</h2>
        <p>{movie.runtime} minutes</p>
      </div>

      <div className="movie-details-section">
        <h2>Language</h2>
        <p>{movie.original_language?.toUpperCase()}</p>
      </div>

      <div className="movie-details-section">
        <h2>Genres</h2>
        <p>{movie.genres?.map((genre) => genre.name).join(", ")}</p>
      </div>

      <div className="movie-details-section">
        <h2>Overview</h2>
        <p>{movie.overview}</p>
      </div>
    </div>
  );
}

export default MovieDetails;
