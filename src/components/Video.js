import React from "react";
import "./video.css";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utilities/dateUtils";

const Video = ({ video }) => {
  const navigate = useNavigate();

  if (!video) return null;
  // for formatting Video Upload date

  // for formating Video Duration
  const formatDuration = (durationInSeconds) => {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.round(durationInSeconds % 60); // rounding for decimal seconds
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const videoOpenHandler = () => {
    console.log("open Video Play page");
    navigate("/videoPlayer", { state: { video } });
  };

  return (
    <div className="video-container" onClick={() => videoOpenHandler()}>
      <div className="image-container">
        <img className="thumbnail" src={video.thumbnail_url} alt="" />
        <p className="video-time">{formatDuration(video.videoDuration)}</p>
      </div>
      <div className="text-container">
        <img src={video.user_id.logoUrl} alt="" className="channel-logo" />
        <div className="text-right-container">
          <h4 className="video-title">{video.title}</h4>
          <p className="channel-name">{video.user_id.channelName}</p>
          <div className="view-date-container">
            <p className="views-count">{video.views} views</p>
            <p className="seperator">&#9679;</p>
            <p className="upload-date">{formatDate(video.uploadDate)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;
