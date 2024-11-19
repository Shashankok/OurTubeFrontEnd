// Home.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Video from "./Video";

const Home = () => {
  const [videos, setVideos] = useState([]);

  const getAllVideos = () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/video`)
      .then((res) => {
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
        }));
        setVideos(filteredVideos);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  useEffect(() => {
    getAllVideos();
  }, []);

  return (
    <div className="single-video-container">
      {videos.map((video, index) => (
        <Video key={index} video={video} />
      ))}
    </div>
  );
};

export default Home;
