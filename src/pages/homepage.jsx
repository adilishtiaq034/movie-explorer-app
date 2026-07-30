import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Homepage() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [activeView, setActiveView] = useState("home"); // "home" | "popular" | "favorites" | "search"

  async function loadDefaultMovies() {
    setShowFavorites(false);
    setActiveView("home");
    const keywordGroups = [
      ["Action", "Comedy", "Drama", "Animation"],
      ["Avengers", "Spider", "Joker"],
      ["Harry Potter", "Frozen", "Cars", "Shrek"],
      ["Horror", "Mystery", "Thriller", "Adventure"],
    ];

    // Pick one random group
    const keywords = keywordGroups[Math.floor(Math.random() * keywordGroups.length)];

    let allMovies = [];

    for (const keyword of keywords) {
      const response = await fetch(`https://www.omdbapi.com/?apikey=71e158eb&s=${keyword}`);
      const data = await response.json();

      if (data.Response === "True") {
        allMovies = [...allMovies, ...data.Search.slice(0, 8)];
      }
    }

    setMovies(allMovies);
  }

  useEffect(() => {
    loadDefaultMovies();
  }, []);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  async function getMovies(search) {
    setError("");
    setLoading(true);
    setShowFavorites(false);
    setActiveView("search");
    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=71e158eb&s=${search}`);
      const data = await response.json();
      if (data.Response === "True") {
        setMovies(data.Search);
      } else {
        setMovies([]);
        setError(data.Error || "No movies found");
      }
    } catch (error) {
      setError("Unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  function addToFavorites(movie) {
    const alreadyExists = favorites.find((fav) => fav.imdbID === movie.imdbID);
    if (alreadyExists) return;
    setFavorites([...favorites, movie]);
  }

  function removeFromFavorites(imdbID) {
    const updatedFavorites = favorites.filter((movie) => movie.imdbID !== imdbID);
    setFavorites(updatedFavorites);
    setMovies(updatedFavorites);
  }

  function seeFavorites() {
    setShowFavorites(true);
    setActiveView("favorites");
    setMovies(favorites);
  }

  async function loadPopularMovies() {
    setShowFavorites(false);
    setActiveView("popular");
    const keywords = ["Batman", "Avengers", "Spider", "Harry Potter", "Mission Impossible"];
    let allMovies = [];

    for (const keyword of keywords) {
      const response = await fetch(`https://www.omdbapi.com/?apikey=71e158eb&s=${keyword}`);
      const data = await response.json();

      if (data.Response === "True") {
        allMovies = [...allMovies, ...data.Search.slice(0, 8)];
      }
    }

    setMovies(allMovies);
    setError("");
  }

  function isFavorite(imdbID) {
    return favorites.some((fav) => fav.imdbID === imdbID);
  }

  return (
    <div className="movie-app">
      <header className="app-header">
        <div className="bulb-row" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <span className="bulb" key={i} style={{ animationDelay: `${i * 0.12}s` }} />
          ))}
        </div>
        <h1 className="app-title">
          Adil<span className="accent">Studio</span>
        </h1>
        <p className="app-subtitle">Now Showing</p>
      </header>

      <div className="control-bar">
        <div className="search-group">
          <input
            className="search-input"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                getMovies(search);
              }
            }}
            value={search}
            type="text"
            placeholder="Search for a title..."
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn btn-primary" onClick={() => getMovies(search)} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        <div className="nav-group">
          <button
            className={`btn${activeView === "home" ? " active" : ""}`}
            onClick={loadDefaultMovies}
          >
            Home
          </button>
          <button
            className={`btn${activeView === "popular" ? " active" : ""}`}
            onClick={loadPopularMovies}
          >
            Popular
          </button>
          <button
            className={`btn${activeView === "favorites" ? " active" : ""}`}
            onClick={seeFavorites}
          >
            Favorites
          </button>
        </div>
      </div>

      {loading ? <div className="reel-spinner" aria-label="Loading" /> : null}
      {error && <p className="status-text error">{error}</p>}

      <div className="movie-grid">
        {movies.map((movie, index) => (
          <div
            className="movie-card"
            key={movie.imdbID}
            style={{ animationDelay: `${Math.min(index, 12) * 0.05}s` }}
          >
            <div className="poster-wrap">
              <img
                src={movie.Poster}
                alt={movie.Title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://dummyimage.com/300x450/181818/f2f2f2&text=No+Poster";
                }}
              />
            </div>
            <h4 className="movie-title">{movie.Title}</h4>
            <div className="card-actions">
              {showFavorites ? (
                <button
                  className="icon-btn is-favorite"
                  onClick={() => removeFromFavorites(movie.imdbID)}
                  aria-label="Remove from favorites"
                  title="Remove from favorites"
                >
                  ♥
                </button>
              ) : (
                <button
                  className={`icon-btn${isFavorite(movie.imdbID) ? " is-favorite" : ""}`}
                  onClick={() => addToFavorites(movie)}
                  aria-label="Add to favorites"
                  title="Add to favorites"
                >
                  {isFavorite(movie.imdbID) ? "♥" : "♡"}
                </button>
              )}
              <Link to={`/movie/${movie.imdbID}`} style={{ flex: 1 }}>
                <button className="btn btn-details">Details</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Homepage;