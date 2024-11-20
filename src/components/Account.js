import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Account.css";
import Video from "./Video";
import Channel from "./Channel";
import { useParams } from "react-router-dom";

const Account = () => {
  const [videos, setVideos] = useState([]);
  const { userId } = useParams();
  const [user, setUser] = useState({});

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/video/user/${userId}`)
      .then((response) => {
        setVideos(response.data.videos);
        console.log(response.data.videos);
      })
      .catch((error) => console.error("Error fetching videos:", error));

    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/user/${userId}`)
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) =>
        console.error("Error fetching subscribed channels:", error)
      );
  }, [userId]);

  return (
    <div>
      <div className="myAccount-container">
        <div className="myAccount-left-container">
          <img className="myAccount-logo" src={user.logoUrl} alt="logo" />
        </div>
        <div className="myAccount-right-container">
          <h1 className="myAccount-heading">{user.channelName}</h1>
          <p className="myAccount-channel-id">
            <span style={{ fontWeight: "600" }}>UserId : </span>
            {userId}
          </p>
          <p className="myAccount-subscriber-count">
            <span style={{ fontWeight: "600" }}>Subscribers : </span>
            {user.subscribers || 0}
          </p>
        </div>
      </div>

      <hr className="myAccount-separator" />

      <div className="myAccount-section">
        <h3 className="myAccount-my-videos-heading">Videos</h3>
        <div className="myAccount-slider">
          {Array.isArray(videos) && videos.length > 0 ? (
            videos.map((video, index) => <Video key={index} video={video} />)
          ) : (
            <p>You have not uploaded any videos yet.</p>
          )}
        </div>
      </div>

      {/* Subscribed Channels Section */}
      <Channel />
    </div>
  );
};

export default Account;
