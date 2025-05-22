import React, { useState } from "react";
import axios from "axios";
import Modal from "./Modal";
import withCellPhoneFrame from "./CellPhoneFrame";
import "./ImageUpload.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip, faCheck } from "@fortawesome/free-solid-svg-icons";
import logo from '../assets/images/logo.png';

function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || "http://localhost:3001";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileSelected(true);
      setImagePreview(URL.createObjectURL(file));
      if (navigator.vibrate) navigator.vibrate(50);
    } else {
      setFileSelected(false);
      setImagePreview(null);
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    const renamedFile = new File([selectedFile], `${Date.now()}-${selectedFile.name}`, {
      type: selectedFile.type,
    });
    formData.append("image", renamedFile);

    setLoading(true);
    setIsModalOpen(true);

    try {
      // FIXED: Removed the Content-Type header - let axios handle it automatically
      const response = await axios.post(`${API_ENDPOINT}/upload`, formData);
      
      const message = response.data.message.content;
      const finishReason = response.data.finish_reason;
      setResponseMessage({ message, finishReason });
      setFileSelected(false);
    } catch (error) {
      console.error("Error uploading the file", error);
      
      // Better error handling
      if (error.response) {
        // Server responded with error status
        setResponseMessage({
          message: `Server error: ${error.response.status} - ${error.response.data?.error || error.response.statusText}`,
          finishReason: "",
        });
      } else if (error.request) {
        // Network error (CORS, no response, etc.)
        setResponseMessage({
          message: "Network error: Unable to connect to server. Please check your connection.",
          finishReason: "",
        });
      } else {
        // Other error
        setResponseMessage({
          message: `Error: ${error.message}`,
          finishReason: "",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setResponseMessage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile) {
      handleUpload();
    } else {
      console.log("No file selected");
      setResponseMessage({ message: "No file selected", finishReason: "" });
      setIsModalOpen(true);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        {/* Hidden Inputs for Camera and File */}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          id="cameraInput"
          onChange={handleFileChange}
        />
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          id="fileInput"
          onChange={handleFileChange}
        />

        {/* Buttons */}
        <label htmlFor="cameraInput" className="camera-icon">
          <img src={logo} alt="Logo" className="logo" />
        </label>
        <label htmlFor="fileInput" className={`paperclip-icon ${fileSelected ? 'green-checkmark' : ''}`}>
          <FontAwesomeIcon icon={fileSelected ? faCheck : faPaperclip} size="2x" className={fileSelected ? 'checkmark-animation' : ''} />
        </label>
        <button type="submit">Upload</button>
      </form>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        responseMessage={responseMessage}
        loading={loading}
        imagePreview={imagePreview}
      />
    </div>
  );
}

export default withCellPhoneFrame(ImageUpload);