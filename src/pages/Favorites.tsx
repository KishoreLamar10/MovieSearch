import "../css/Favorites.css";
import MovieCard from "../components/MovieCard";
import { useNavigate } from "react-router-dom";
import { useMovieStore } from "../store/movieStore";

function Favorites() {
  const { favorites } = useMovieStore();
  const navigate = useNavigate();

  return (
    <div className="favorites">
      <div className="favorites-header">
        <h1>Your Favorites</h1>
      </div>

      {favorites.length > 0 ? (
        <div className="movies-grid">
          {favorites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="favorites-empty">
          <div className="empty-icon">❤️</div>
          <h2>No Favorites Yet</h2>
          <p>Start exploring and add some movies to your collection!</p>
          <button className="btn-cta" onClick={() => navigate("/")}>
            Explore Movies
          </button>
        </div>
      )}
    </div>
  );
}

export default Favorites;


