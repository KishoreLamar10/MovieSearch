import "../css/Favorites.css"; 
import MovieCard from "../components/MovieCard";
import { useNavigate } from "react-router-dom";
import { useMovieStore } from "../store/movieStore";

function Watchlist() {
  const { watchlist } = useMovieStore();
  const navigate = useNavigate();

  return (
    <div className="favorites">
      <div className="favorites-header">
        <h1>Your Watchlist</h1>
      </div>

      {watchlist.length > 0 ? (
        <div className="movies-grid">
          {watchlist.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="favorites-empty">
          <div className="empty-icon">🔖</div>
          <h2>Your Watchlist is Empty</h2>
          <p>Save movies you want to watch later!</p>
          <button className="btn-cta" onClick={() => navigate("/")}>
            Discover Movies
          </button>
        </div>
      )}
    </div>
  );
}

export default Watchlist;
