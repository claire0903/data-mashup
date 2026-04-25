import { useState } from "react";
import axios from "axios";

function App() {
  const [query, setQuery] = useState(""); 
  const [movies, setMovies] = useState([]); 
  const [loading, setLoading] = useState(false); /*loading*/
  const [error, setError] = useState(""); /*error*/
  const [searched, setSearched] = useState(false); /*empty*/

  const [rateLimited, setRateLimited] = useState(false); /*repeated calls + rate limits*/
  const [cooldown, setCooldown] = useState(0);

  const searchMovies = async () => {
    if (!query.trim()) return;
    if (rateLimited) return;

    try {
      setLoading(true);
      setError("");
      setMovies([]);
      setSearched(true);

      const res = await axios.get(
        `http://localhost:5000/api/movies?q=${query}`
      );

      setMovies(res.data);
    } catch (err) {
      if (err.response?.status === 429) {
        setError("Hello, you have made too many requests! Kindly wait.");

        setRateLimited(true);
        setCooldown(10);

        const timer = setInterval(() => {
          setCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              setRateLimited(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError("We were unable to fetch the movie. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "12px",
          marginBottom: "30px"
        }}
      >
        <img
          src="/popcorn.png"
          alt="Popcorn Logo"
          style={{
            width: "45px",
            height: "45px",
            objectFit: "contain"
          }}
        />

        <h1 style={{ margin: 0 }}>Claire's Movie Database</h1>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "30px"
        }}
      >
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchMovies()}
          style={{
            padding: "10px",
            width: "260px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />

        <button
          onClick={searchMovies}
          disabled={rateLimited}
          style={{
            padding: "10px 16px",
            border: "none",
            borderRadius: "6px",
            cursor: rateLimited ? "not-allowed" : "pointer",
            backgroundColor: "#FFD700",
            fontWeight: "bold"
          }}
        >
          {rateLimited ? `Wait ${cooldown}s` : "Search"}
        </button>
      </div>

      {loading && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "200px"
          }}
        >
          <img
            src="/loading.png"
            alt="Loading"
            style={{ width: "90px", height: "90px" }}
          />
          <p>Loading movies...</p>
        </div>
      )}

      {error && (
        <p style={{ textAlign: "center", color: "red" }}>{error}</p>
      )}

      {!loading && searched && movies.length === 0 && !error && (
        <p style={{ textAlign: "center", color: "white" }}>
          No movies found for "{query}"
        </p>
      )}

      {!loading && !searched && !error && (
        <p style={{ textAlign: "center" }}>
          Input the proper movie title to learn more about it!
        </p>
      )}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px"
        }}
      >
        {movies.map((movie, index) => (
          <div
            key={index}
            style={{
              width: "220px",
              minHeight: "500px",
              border: "1px solid #FFD700",
              borderRadius: "12px",
              padding: "15px",
              backgroundColor: "#800020",
              color: "white",
              boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center"
            }}
          >
            <img
              src={
                movie.poster && movie.poster !== "N/A"
                  ? movie.poster
                  : "/white-placeholder.png"
              }
              alt={movie.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/white-placeholder.png";
              }}
              style={{
                width: "180px",
                height: "270px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "15px",
                border: "1px solid #FFD700"
              }}
            />

            <h3
              style={{
                fontSize: "16px",
                minHeight: "45px",
                marginBottom: "10px"
              }}
            >
              {movie.title}
            </h3>

            <p><strong>Year:</strong> {movie.year}</p>
            <p><strong>Average Rating:</strong> {movie.tmdbRating}</p>
            <p><strong>IMDb ID:</strong> {movie.imdbID}</p>
            <p><strong>Rating Tier:</strong> {movie.ratingTier}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
