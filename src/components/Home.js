// Home.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Video from "./Video";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAllVideos = () => {
    setIsLoading(true);
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/video`)
      .then((res) => {
        setIsLoading(false);
        console.log(res.data.videos);
        const filteredVideos = res.data.videos.map((video) => ({
          videoId: video.videoId,
          _id: video._id,
          title: video.title,
          thumbnail_url: video.thumbnail_url,
          video_url: video.video_url,
          user_id: video.user_id,
          views: video.views,
          likes: video.likes,
          dislikes: video.dislikes,
          description: video.description,
          createdAt: video.createdAt,
          videoDuration: video.videoDuration,
          category: video.category,
          tags: video.tags,
          viewedBy: video.viewedBy,
        }));
        setVideos(filteredVideos);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err.response);
      });
  };

  useEffect(() => {
    getAllVideos();
  }, []);

  return isLoading ? (
    <div className="loader-container">
      <i className="fa-solid fa-spinner fa-spin-pulse loader-icon" />
    </div>
  ) : (
    <div className="single-video-container">
      {videos.map((video, index) => (
        <Video key={index} video={video} />
      ))}
    </div>
  );
};

export default Home;
