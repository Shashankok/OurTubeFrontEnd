import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import "./comment.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Comment = () => {
  const commentRefs = useRef({});
  const [comments, setComments] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [commentDeleted, setCommentDeleted] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null); // Tracks which comment is being edited
  const location = useLocation();
  const video = location.state?.video;
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  const handleCommentSubmit = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      // Show error toast
      toast.error("Please Login to perform this action!");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty!");
      return;
    }

    if (editingCommentId) {
      // If editing a comment
      axios
        .put(
          `${process.env.REACT_APP_BACKEND_URL}/comment/edit-comment/${editingCommentId}`,
          { commentText: newComment },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment._id === editingCommentId
                ? { ...comment, commentText: newComment }
                : comment
            )
          );
          toast.success("Comment updated successfully!");
          setNewComment(""); // Clear the textarea
          setEditingCommentId(null); // Reset editing state
        })
        .catch((err) => {
          console.error("Error updating comment:", err.response || err.message);
          toast.error("Failed to update comment.");
        });
    } else {
      // If adding a new comment

      const newCommentObj = {
        commentUserId: localStorage.getItem("userId"),
        logo: localStorage.getItem("logoUrl"),
        channelName: localStorage.getItem("channelName"),
        commentText: newComment,
      };
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
          setComments((prevComments) => [
            {
              _id: res.data.newCommentData._id, // The ID from the backend response
              ...newCommentObj,
            },
            ...prevComments,
          ]);

          toast.success("Comment Added!");
          setNewComment("");
        })
        .catch((err) => {
          console.log(err.response);
          //   toast.error(err.response.data.error);
        });
    }
  };

  const editCommentHandler = (commentId, currentText) => {
    setEditingCommentId(commentId); // Set the ID of the comment being edited
    setNewComment(currentText); // Prefill the `textarea` with the current comment text
  };
  const deleteCommentHandler = (commentId) => {
    axios
      .delete(
        `${process.env.REACT_APP_BACKEND_URL}/comment/delete-comment/${commentId}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        setCommentDeleted((prev) => !prev);
        toast.success("Comment Deleted");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Setting the comments list from db
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/comment/${video._id}`)
      .then((res) => {
        const commentsArray = res.data.commentData;
        setComments(
          commentsArray
            .map((comment) => ({
              _id: comment._id,
              logo: comment.user_id.logoUrl,
              channelName: comment.user_id.channelName,
              commentText: comment.commentText,
              commentUserId: comment.user_id._id,
            }))
            .sort((a, b) =>
              a.commentUserId === localStorage.getItem("userId") ? -1 : 1
            )
        );
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, [video._id, commentDeleted]);

  // Close the menu when clicking outside (optional, advanced)
  useEffect(() => {
    const handleClickOutside = () => setMenuOpen(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <div className="comment-section">
        <h3>Comments</h3>
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={
              editingCommentId ? "Edit your comment..." : "Add a comment..."
            }
            rows="3"
            required
          />
          <button type="submit" className="comment-submit-btn">
            {editingCommentId ? "Update Comment" : "Comment"}
          </button>
          {editingCommentId && (
            <button
              type="button"
              className="comment-cancel-btn"
              onClick={() => {
                setEditingCommentId(null);
                setNewComment(""); // Reset the textarea
              }}
            >
              Cancel
            </button>
          )}
        </form>

        <div className="comments-list">
          {comments.map((comment) => {
            const isMyComment =
              comment.commentUserId === localStorage.getItem("userId");
            return (
              <div
                key={comment._id}
                className="comment-container"
                ref={(el) => (commentRefs.current[comment._id] = el)}
              >
                <div className="commentList-left-container">
                  <img
                    src={comment.logo}
                    alt=""
                    className="user-logo"
                    onClick={() =>
                      navigate(`/account/${comment.commentUserId}`)
                    }
                  />
                  <div className="comment-user-details">
                    <p className="comment-author">{comment.channelName}</p>
                    <p className="comment-text">{comment.commentText}</p>
                  </div>
                </div>

                {/* 3-Dot Menu */}
                {isMyComment && (
                  <div className="comment-options">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(
                          menuOpen === comment._id ? null : comment._id
                        );
                      }}
                      className="menu-button"
                    >
                      ⋮
                    </button>
                    {menuOpen === comment._id && (
                      <div className="menu-dropdown">
                        <button
                          onClick={() =>
                            editCommentHandler(comment._id, comment.commentText)
                          }
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteCommentHandler(comment._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Comment;
