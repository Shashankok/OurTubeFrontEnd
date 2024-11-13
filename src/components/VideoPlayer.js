import React, { useEffect, useState } from "react";
import "./videoPlayer.css";
import Video from "./Video";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { useLocation } from "react-router-dom";
import { formatDate } from "../utilities/dateUtils";
import axios from "axios";
import { toast } from "react-toastify";

const VideoPlayer = () => {
  const location = useLocation();
  const video = location.state?.video;

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [views, setViews] = useState(0);
  const [subscribers, setSubscribers] = useState(0);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      const newCommentObj = {
        _id: localStorage.getItem("userId"),
        logo: localStorage.getItem("logoUrl"),
        channelName: localStorage.getItem("channelName"),
        commentText: newComment,
      };
      setComments([...comments, newCommentObj]);

      axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/comment/new-comment/${video._id}`,
          { commentText: newComment },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          toast.success("Comment Added!");
          setNewComment("");
        })
        .catch((err) => {
          console.log(err.response);
          toast.error(err.response.data.error);
        });
    }
  };

  const subscribeButtonHandler = () => {
    setSubscribed((prev) => !prev);
  };

  const likeButtonHandler = () => {
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
        console.log("in like handler api");
        console.log(res.data);
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
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/video/${video._id}`)
      .then((res) => {
        console.log(res.data.video);
        const video = res.data.video;
        if (video.likedBy.includes(localStorage.getItem("userId"))) {
          setLiked(true);
        }
        if (video.dislikedBy.includes(localStorage.getItem("userId"))) {
          setDisliked(true);
        }
        setSubscribers(video.user_id.subscribers);
        setLikes(video.likes);
        setDislikes(video.dislikes);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, [video._id]);

  const dislikeButtonHandler = () => {
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
        console.log(res.data);
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

  // Setting the comments list from db
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/comment/${video._id}`)
      .then((res) => {
        console.log(res.data.commentData);
        const commentsArray = res.data.commentData;
        setComments(
          commentsArray.map((comment) => ({
            _id: comment._id,
            logo: comment.user_id.logoUrl,
            channelName: comment.user_id.channelName,
            commentText: comment.commentText,
          }))
        );
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, [video._id]);

  return (
    <div className="videoplayer-container-main">
      <div className="videoplayer-left">
        <div className="video-player">
          <video controls className="main-video">
            <source src={video.video_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="video-data">
          <h1 className="videoPlayer-title">{video.title}</h1>
          <div className="videoPlayer-controls">
            <img src={video.user_id.logoUrl} alt="" className="user-logo" />
            <div className="channel-info-container">
              <p className="channelName">{video.user_id.channelName}</p>
              <p className="subscribers">{subscribers} subscribers</p>
            </div>
            <button
              onClick={subscribeButtonHandler}
              className={`subscribe-btn ${subscribed ? "subscribed" : ""}`}
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>
            <div className="like-dislike-wrapper">
              <div className="like-btn" onClick={likeButtonHandler}>
                {liked ? <BiSolidLike /> : <BiLike />}
                <p className="like-count">{likes}</p>
              </div>
              <div className="dislike-btn" onClick={dislikeButtonHandler}>
                {disliked ? <BiSolidDislike /> : <BiDislike />}
                <p className="dilike-count">{dislikes}</p>
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
                {formatDate(video.uploadDate)}
              </p>
            </div>
            <p className="description-text">{video.description}</p>
          </div>
        </div>

        {/* Comment Section */}
        <div className="comment-section">
          <h3>Comments</h3>
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows="3"
              required
            />
            <button type="submit" className="comment-submit-btn">
              Comment
            </button>
          </form>

          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment._id} className="comment-container">
                <img src={comment.logo} alt="" className="user-logo" />
                <div className="comment-user-details">
                  <p className="comment-author">{comment.channelName}</p>
                  <p className="comment-text">{comment.commentText}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="videoplayer-right">
        <h3>Related Videos</h3>
        <div className="related-videos">
          <Video />
          <Video />
          <Video />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
