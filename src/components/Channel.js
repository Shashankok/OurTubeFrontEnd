import React, { useEffect, useState } from "react";
import axios from "axios";
import "./channel.css";
import { useNavigate, useParams } from "react-router-dom";

const Channel = () => {
  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const { userId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/user/subscribed-channels/${userId}`
      )
      .then((response) => {
        setSubscribedChannels(response.data.subscribedChannels);
        console.log("subscibe data");
        console.log(subscribedChannels);
      })
      .catch((error) =>
        console.error("Error fetching subscribed channels:", error)
      );
  }, []);

  return (
    <div className="myAccount-section">
      <h3 className="myAccount-Subscribed-Channels-heading">
        Subscribed Channels
      </h3>
      <div className="myAccount-slider">
        {Array.isArray(subscribedChannels) && subscribedChannels.length > 0 ? (
          subscribedChannels.map((channel) => (
            <div
              key={channel._id}
              className="myAccount-channel-card"
              onClick={() => navigate(`/account/${channel._id}`)}
            >
              <img
                src={channel.logoUrl}
                alt={channel.channelName}
                className="myAccount-channel-logo"
              />
              <div className="myAccount-channel-info">
                <h4 className="myAccount-channel-name">
                  {channel.channelName}
                </h4>
                <p className="myAccount-channel-subscribers">
                  {channel.subscribers} Subscribers
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>You are not subscribed to any channels yet.</p>
        )}
      </div>
    </div>
  );
};

export default Channel;
