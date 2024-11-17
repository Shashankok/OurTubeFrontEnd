import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Video from "./Video";
import "./search.css";
const Search = () => {
  const [videos, setVideos] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    if (query) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/video/search?query=${query}`)
        .then((response) => {
          console.log(videos);
          setVideos(response.data.videos);
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
        });
    }
  }, [query]);

  return (
    <div className="search-page">
      <h1 className="search-page-heading">Search Results for "{query}"</h1>
      <div className="search-results">
        {videos.length > 0 ? (
          videos.map((video) => <Video key={video._id} video={video} />)
        ) : (
          <p>No videos found.</p>
        )}
      </div>
    </div>
  );
};

export default Search;
