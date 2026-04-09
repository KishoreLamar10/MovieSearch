import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
}

interface MovieState {
  favorites: Movie[];
  watchlist: Movie[];
  searchQuery: string;
  addFavorite: (movie: Movie) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (id: number) => void;
  isInWatchlist: (id: number) => boolean;
  setSearchQuery: (query: string) => void;
}

export const useMovieStore = create<MovieState>()(
  persist(
    (set, get) => ({
      favorites: [],
      watchlist: [],
      searchQuery: "",
      
      addFavorite: (movie) => 
        set((state) => ({ favorites: [...state.favorites, movie] })),
      
      removeFavorite: (id) => 
        set((state) => ({ 
          favorites: state.favorites.filter((m) => m.id !== id) 
        })),
      
      isFavorite: (id) => 
        get().favorites.some((m) => m.id === id),
      
      addToWatchlist: (movie) => 
        set((state) => ({ watchlist: [...state.watchlist, movie] })),
      
      removeFromWatchlist: (id) => 
        set((state) => ({ 
          watchlist: state.watchlist.filter((m) => m.id !== id) 
        })),
      
      isInWatchlist: (id) => 
        get().watchlist.some((m) => m.id === id),

      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: 'movie-storage',
      partialize: (state) => ({ 
        favorites: state.favorites, 
        watchlist: state.watchlist 
      }), // Don't persist search query
    }
  )
);
