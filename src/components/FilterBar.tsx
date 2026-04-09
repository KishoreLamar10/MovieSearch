import { useEffect, useState } from "react";
import { fetchGenres, Genre } from "../services/api";
import "../css/FilterBar.css";

interface FilterBarProps {
  selectedGenre: number | null;
  onGenreSelect: (id: number | null) => void;
  sortBy: string;
  onSortChange: (sort: any) => void;
}

const FilterBar = ({ selectedGenre, onGenreSelect, sortBy, onSortChange }: FilterBarProps) => {
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await fetchGenres();
        setGenres(data);
      } catch (err) {
        console.error("Failed to fetch genres:", err);
      }
    };
    loadGenres();
  }, []);

  return (
    <div className="filter-bar">
      <div className="genres-filter">
        <button 
          className={`genre-btn ${selectedGenre === null ? "active" : ""}`}
          onClick={() => onGenreSelect(null)}
        >
          All
        </button>
        {genres.map((genre) => (
          <button
            key={genre.id}
            className={`genre-btn ${selectedGenre === genre.id ? "active" : ""}`}
            onClick={() => onGenreSelect(genre.id)}
          >
            {genre.name}
          </button>
        ))}
      </div>

      <div className="sort-filter">
        <select 
          value={sortBy} 
          onChange={(e) => onSortChange(e.target.value)}
          className="sort-select"
        >
          <option value="popularity.desc">Most Popular</option>
          <option value="vote_average.desc">Highest Rated</option>
          <option value="release_date.desc">Most Recent</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
