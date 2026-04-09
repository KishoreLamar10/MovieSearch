import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useMovieStore, Movie } from "../store/movieStore";
import { searchMovies, getImageUrl } from "../services/api";
import "../css/NavBar.css";

function NavBar() {
  const { searchQuery, setSearchQuery } = useMovieStore();
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (searchQuery.length > 2) {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(async () => {
        try {
          const results = await searchMovies(searchQuery);
          setSuggestions(results.slice(0, 5));
          setShowSuggestions(true);
        } catch (err) {
          console.error("Autocomplete error:", err);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    navigate("/");
  };


  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <div className="navbar-brand">
            <Link to="/">Movie Search</Link>
          </div>
        </div>

        <div className="navbar-center" ref={searchContainerRef}>
          <form onSubmit={handleSearchSubmit} className="nav-search-form">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length > 2 && setShowSuggestions(true)}
                className="nav-search-input"
              />

              {showSuggestions && suggestions.length > 0 && (
                <div className="nav-search-suggestions">
                  {suggestions.map(movie => (
                    <Link 
                      key={movie.id} 
                      to={`/movie/${movie.id}`}
                      className="nav-suggestion-item"
                      onClick={() => setShowSuggestions(false)}
                    >
                      <img src={getImageUrl(movie.poster_path, "w92")} alt={movie.title} />
                      <div className="nav-suggestion-info">
                        <h4>{movie.title}</h4>
                        <span>{movie.release_date?.split("-")[0]}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="navbar-right">
          <div className="navbar-links">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Home
            </NavLink>
            <NavLink to="/favorites" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Favorites
            </NavLink>
            <NavLink to="/watchlist" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Watchlist
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
