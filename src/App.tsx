import HomePage from "./pages/HomePage";
import Favorites from "./pages/Favorites";
import Watchlist from "./pages/Watchlist";
import NavBar from "./components/NavBar";
import MovieDetails from "./pages/MovieDetails";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
      </main>
    </>
  );
}

export default App;

