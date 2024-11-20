import React, { useEffect, useState } from "react";
import axios from "axios";
import "./relatedVideo.css";
import VideoCard from "./VideoCard";

const RelatedVideo = ({ currentVideo }) => {
  const [relatedVideos, setRelatedVideos] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/video`)
      .then((res) => {
        const videos = res.data.videos;

        // Filter out the current video and keep videos with same category as the current video
        const filteredVideos = videos.filter(
          (video) =>
            video._id !== currentVideo._id &&
            video.category === currentVideo.category
        );
        setRelatedVideos(filteredVideos);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, [currentVideo]);

  return (
    <div className="related-video-container">
      <h3>Related Videos</h3>
      {relatedVideos.length > 0 ? (
        relatedVideos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))
      ) : (
        <p>There are no related videos</p>
      )}
    </div>
  );
};

export default RelatedVideo;
