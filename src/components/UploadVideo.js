import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./uploadVideo.css";

const UploadVideo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Pre-fill form if editing existing video
  useEffect(() => {
    if (location.state && location.state.videoData) {
      const { videoData } = location.state;

      setTitle(videoData.title);
      setDescription(videoData.description);
      setCategory(videoData.category);
      setTags(videoData.tags.join(",")); // Assuming tags are stored as an array
      // Optionally, set the thumbnail and video URL for preview (not required if you're only uploading new files)
    }
  }, [location.state]);

  const categories = [
    "Education",
    "Entertainment",
    "Gaming",
    "Music",
    "Sports",
    "News",
    "Travel",
    "Technology",
    "Lifestyle",
    "Comedy",
  ];

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("tags", tags);
    if (thumbnail) formData.append("thumbnail", thumbnail);
    if (video) formData.append("video", video);

    const videoId = location.state ? location.state.videoData._id : ""; // Get the video ID if editing

    const endpoint = videoId
      ? `${process.env.REACT_APP_BACKEND_URL}/video/${videoId}`
      : `${process.env.REACT_APP_BACKEND_URL}/video/upload`; // API endpoint for update or upload

    const method = videoId ? "put" : "post"; // Use PUT for update, POST for new video

    axios({
      method,
      url: endpoint,
      data: formData,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => {
        toast.success(
          videoId
            ? "Video Updated Successfully!"
            : "Video Uploaded Successfully!"
        );
        navigate("/home");
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err.response);
        toast.error(err.response.data.error);
        setIsLoading(false);
      });
  };

  return (
    <div className="upload-video-container">
      <h2>{location.state ? "Edit Video" : "Upload Video"}</h2>
      <form onSubmit={handleSubmit} className="upload-video-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., tutorial, coding, tech"
          />
        </div>

        <div className="form-group">
          <label>Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            required={!location.state} // Do not require thumbnail if editing
          />
        </div>

        <div className="form-group">
          <label>Video</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            required={!location.state} // Do not require video if editing
          />
        </div>

        <button
          type="submit"
          className="upload-video-submit-btn"
          disabled={isLoading}
        >
          {isLoading ? (
            <i className="fa-solid fa-spinner fa-spin-pulse"></i>
          ) : location.state ? (
            "Update Video"
          ) : (
            "Upload Video"
          )}
        </button>
      </form>
    </div>
  );
};

export default UploadVideo;
