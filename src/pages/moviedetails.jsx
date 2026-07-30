import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "../App.css";

function MovieDetails() {
  const [movie, setMovie] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    async function getMovie() {
      const response = await fetch(`https://www.omdbapi.com/?apikey=71e158eb&i=${id}`);
      const data = await response.json();
      setMovie(data);
    }

    getMovie();
  }, [id]);

  if (!movie) {
    return (
      <div className="movie-details">
        <div className="reel-spinner" aria-label="Loading" />
        <h2 className="details-loading">Fetching the reel...</h2>
      </div>
    );
  }

  const metaFields = [
    { label: "Year", value: movie.Year },
    { label: "Genre", value: movie.Genre },
    { label: "IMDb Rating", value: movie.imdbRating },
    { label: "Runtime", value: movie.Runtime },
    { label: "Director", value: movie.Director },
    { label: "Actors", value: movie.Actors },
    { label: "Language", value: movie.Language },
    { label: "Country", value: movie.Country },
    { label: "Awards", value: movie.Awards },
  ];

  return (
    <div className="movie-details">
      <Link to="/">
        <button className="btn btn-ghost btn-back">← Back</button>
      </Link>

      <div className="details-hero">
        <img className="details-poster" src={movie.Poster} alt={movie.Title} />

        <div className="details-info">
          <h1>{movie.Title}</h1>
          <p className="details-plot">{movie.Plot}</p>

          <div className="meta-grid">
            {metaFields.map((field) => (
              <div className="meta-item" key={field.label}>
                <span className="meta-label">{field.label}</span>
                <span className="meta-value">{field.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;