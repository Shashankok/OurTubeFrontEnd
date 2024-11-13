import React, { useState } from "react";
import "./uploadVideo.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UploadVideo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

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
    formData.append("thumbnail", thumbnail);
    formData.append("video", video);

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/video/upload`, formData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        toast.success("Video Uploaded Successfuly!");
        navigate("/home");
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.response);
        toast.error(err.response.data.error);
        setIsLoading(false);
      });
  };

  return (
    <div className="upload-video-container">
      <h2>Upload Video</h2>
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
            required
          />
        </div>

        <div className="form-group">
          <label>Video</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            required
          />
        </div>
        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? (
            <i className="fa-solid fa-spinner fa-spin-pulse"></i>
          ) : (
            "Upload Video"
          )}
        </button>
      </form>
    </div>
  );
};

export default UploadVideo;
