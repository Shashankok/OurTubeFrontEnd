import React, { useEffect, useState } from "react";
import "./videoPlayer.css";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDate } from "../utilities/dateUtils";
import axios from "axios";
import Comment from "./videoPlayerPage/components/Comment";
import RelatedVideo from "./videoPlayerPage/components/RelatedVideo";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Modal from "react-modal";

const VideoPlayer = () => {
  const location = useLocation();
  const video = location.state?.video;
  const navigate = useNavigate();
  const [subscribed, setSubscribed] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [subscribers, setSubscribers] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isOwner, setIsowner] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const subscribeButtonHandler = () => {
    if (!isLoggedIn) {
      // Show error toast
      toast.error("Please Login to perform this action!");
      return;
    }
    if (subscribed) {
      axios
        .put(
          `${process.env.REACT_APP_BACKEND_URL}/user/unsubscribe/${video.user_id._id}`,
          null,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          setSubscribed(false);
        })
        .catch((err) => {
          console.log(err.response);
        });
    } else {
      axios
        .put(
          `${process.env.REACT_APP_BACKEND_URL}/user/subscribe/${video.user_id._id}`,
          null,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          setSubscribed(true);
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  };

  const editVideoButtonHandler = () => {
    navigate("/upload", { state: { videoData: video } });
  };

  const deleteVideoHandler = () => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this video?"
    );
    if (!userConfirmed) return;

    setIsLoading(true);
    axios
      .delete(`${process.env.REACT_APP_BACKEND_URL}/video/${video._id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        toast.success("Video Deleted Successfully!");
        navigate("/home");
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err.response);
        toast.error(err.response.data.error);
        setIsLoading(false);
      });
  };

  const likeButtonHandler = () => {
    if (!isLoggedIn) {
      // Show error toast
      toast.error("Please Login to perform this action!");
      return;
    }
    axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}/video/like/${video._id}`,
        null,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        if (!liked) {
          setLiked(true);
          setLikes((prevLikes) => prevLikes + 1);
          if (disliked) {
            setDisliked(false);
            setDislikes((prevDislikes) => prevDislikes - 1);
          }
        } else {
          setLiked(false);
          setLikes((prevLikes) => prevLikes - 1);
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  useEffect(() => {
    const localUserId = localStorage.getItem("userId");
    if (video.user_id._id === localUserId) {
      setIsowner(true);
    }
  }, [video.user_id._id]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/video/${video._id}`)
      .then((res) => {
        const video = res.data.video;
        if (video.likedBy.includes(localStorage.getItem("userId"))) {
          setLiked(true);
        }
        if (video.dislikedBy.includes(localStorage.getItem("userId"))) {
          setDisliked(true);
        }
        if (
          video.user_id.subscribedBy.includes(localStorage.getItem("userId"))
        ) {
          setSubscribed(true);
        }
        setSubscribers(video.user_id.subscribers);
        setLikes(video.likes);
        setDislikes(video.dislikes);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, [video._id, subscribed]);

  const dislikeButtonHandler = () => {
    if (!isLoggedIn) {
      // Show error toast
      toast.error("Please Login to perform this action!");
      return;
    }
    axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}/video/dislike/${video._id}`,
        null,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        if (!disliked) {
          setDisliked(true);
          setDislikes((prevDislikes) => prevDislikes + 1);
          if (liked) {
            setLiked(false);
            setLikes((prevLikes) => prevLikes - 1);
          }
        } else {
          setDisliked(false);
          setDislikes((prevDislikes) => prevDislikes - 1);
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  return (
    <div className="videoplayer-container-main">
      <div className="videoplayer-left">
        <div className="video-player">
          <video controls className="main-video" autoPlay key={video.video_url}>
            <source src={video.video_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="video-data">
          <h1 className="videoPlayer-title">{video.title}</h1>
          <div className="videoPlayer-controls">
            <div
              className="channel-info"
              onClick={() => navigate(`/account/${video.user_id._id}`)}
            >
              <img src={video.user_id.logoUrl} alt="" className="user-logo" />
              <div className="channel-info-container">
                <p className="channelName">{video.user_id.channelName}</p>
                <p className="subscribers">{subscribers} subscribers</p>
              </div>
            </div>
            <div className="action-buttons">
              {isOwner && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="delete-video-btn"
                >
                  {isLoading ? (
                    <i className="fa-solid fa-spinner fa-spin-pulse"></i>
                  ) : (
                    "Delete video"
                  )}
                </button>
              )}
              {!isOwner ? (
                <button
                  onClick={subscribeButtonHandler}
                  className={`subscribe-btn ${subscribed ? "subscribed" : ""}`}
                >
                  {subscribed ? "Subscribed" : "Subscribe"}
                </button>
              ) : (
                <button
                  onClick={editVideoButtonHandler}
                  className={"edit-video-btn"}
                >
                  {isLoading ? (
                    <i className="fa-solid fa-spinner fa-spin-pulse"></i>
                  ) : (
                    "Edit video"
                  )}
                </button>
              )}
              <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                overlayClassName="custom-overlay"
                className="custom-modal"
              >
                <h2>Confirm Deletion</h2>
                <p>Are you sure you want to delete this video?</p>
                <button onClick={deleteVideoHandler} disabled={isLoading}>
                  {isLoading ? "Deleting..." : "Yes, Delete"}
                </button>
                <button onClick={() => setIsModalOpen(false)}>Cancel</button>
              </Modal>

              <div className="like-dislike-wrapper">
                <div className="like-btn" onClick={likeButtonHandler}>
                  {liked ? <BiSolidLike /> : <BiLike />}
                  <p className="like-count">{likes}</p>
                </div>
                <div className="dislike-btn" onClick={dislikeButtonHandler}>
                  {disliked ? <BiSolidDislike /> : <BiDislike />}
                  <p className="dislike-count">{dislikes}</p>
                </div>
              </div>
            </div>
          </div>

          <hr className="hr-seperator" />

          {/* Description Section */}
          <div className="video-description">
            <div className="video-stats">
              <p className="views">{video.views} views</p>
              <p className="separator">&#9679;</p>
              <p className="videoPlayer-upload-date">
                {formatDate(video.createdAt)}
              </p>
            </div>
            <p className="description-text">{video.description}</p>
          </div>
        </div>
        {/* Comment Section*/}
        <Comment />
      </div>
      <div className="videoplayer-right">
        <RelatedVideo currentVideo={video} />
      </div>
    </div>
  );
};

export default VideoPlayer;
