import React from "react";
import "./videoCard.css";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../utilities/dateUtils";

const VideoCard = ({ video }) => {
  const navigate = useNavigate();

  if (!video) return null;

  const formatDuration = (durationInSeconds) => {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.round(durationInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const videoOpenHandler = () => {
    navigate("/videoPlayer", { state: { video } });
  };

  return (
    <div className="related-video-card-container" onClick={videoOpenHandler}>
      {/* Left Column */}
      <div className="related-video-card-left">
        <img
          className="related-thumbnail"
          src={video.thumbnail_url}
          alt="Video Thumbnail"
        />
        <p className="related-video-time">
          {formatDuration(video.videoDuration)}
        </p>
      </div>

      {/* Right Column */}
      <div className="related-video-card-right">
        <h4 className="related-video-title">{video.title}</h4>
        <p className="related-channel-name">{video.user_id.channelName}</p>
        <div className="related-view-date-container">
          <p className="related-views-count">{video.views} views</p>
          <p className="related-seperator">&#9679;</p>
          <p className="related-upload-date">{formatDate(video.createdAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
