const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());

const PORT = 5000;

let requestCount = 0;
let windowStart = Date.now();
const WINDOW_MS = 10000;
const MAX_REQUESTS = 10; 

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.get("/api/movies", async (req, res) => {
  const query = req.query.q;

  if (!query || !query.trim()) {
    return res.status(400).json({
      error: "Movie title is required."
    });
  }

  const now = Date.now();

  if (now - windowStart > WINDOW_MS) {
    requestCount = 0;
    windowStart = now;
  }

  requestCount++;

  if (requestCount > MAX_REQUESTS) {
    return res.status(429).json({
      error: "Too many requests. Please wait a few seconds."
    });
  }

  try {
    
    const [omdbRes, tmdbRes] = await Promise.all([
      axios.get(
        `http://www.omdbapi.com/?apikey=${process.env.OMDB_KEY}&s=${query}`
      ),
      axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_KEY}&query=${query}`
      )
    ]);

    const omdbMovies = omdbRes.data.Search || [];
    const tmdbMovies = tmdbRes.data.results || [];

    if (omdbMovies.length === 0) {
      return res.json([]);
    }

    const merged = omdbMovies.map((movie) => {
      const match = tmdbMovies.find(
        (m) =>
          m.title.toLowerCase() === movie.Title.toLowerCase() ||
          m.title
            .toLowerCase()
            .includes(movie.Title.toLowerCase()) ||
          movie.Title
            .toLowerCase()
            .includes(m.title.toLowerCase())
      );

      const tmdbRating = match ? match.vote_average : 0;

      let ratingTier = "Average";

      if (tmdbRating >= 8) {
        ratingTier = "Excellent";
      } else if (tmdbRating >= 6) {
        ratingTier = "Good";
      }

      return {
        title: movie.Title,
        year: movie.Year,
        imdbID: movie.imdbID,
        poster: movie.Poster,
        tmdbRating: tmdbRating,
        ratingTier: ratingTier
      };
    });

    res.json(merged);
  } catch (err) {
    if (err.response?.status === 429) {
      return res.status(429).json({
        error: "Movie API rate limit reached. Please try again later."
      });
    }

    res.status(500).json({
      error: "Failed to fetch movie data."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
