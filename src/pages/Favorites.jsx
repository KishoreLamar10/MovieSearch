import "../css/Favorites.css";
import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../components/MovieCard";

function Favorites() {
  const { favorites, isFavorite } = useMovieContext();

  return favorites.length > 0 ? (
    <div className="favorites">
      <h1>Favorites</h1>
      <div className="movies-grid">
        {favorites.map((movie) =>
          isFavorite(movie.id) ? (
            <MovieCard key={movie.id} movie={movie} />
          ) : null
        )}
      </div>
    </div>
  ) : (
    <div className="favorites-empty">
      <p>No favorites yet — add some movies ❤️</p>
    </div>
  );
}

export default Favorites;
