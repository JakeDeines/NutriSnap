import React, { useState } from "react";
import axios from "axios";
import Modal from "./Modal"; // Import Modal component
import withCellPhoneFrame from "./CellPhoneFrame";
import "./ImageUpload.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip, faCheck } from "@fortawesome/free-solid-svg-icons";
import logo from'../assets/images/logo.png'; // Adjust the path as necessary

function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileSelected, setFileSelected] = useState(false); // Updated state name for clarity
  const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || "http://localhost:3001";

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setFileSelected(true); // Set true as soon as a file is selected
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    } else {
      setFileSelected(false); // Reset if no file is selected
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.post(`${API_ENDPOINT}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          },
        }
      );
      const message = response.data.message.content;
      const finishReason = response.data.finish_reason;
      setResponseMessage({ message, finishReason });
      setFileSelected(false); // Optionally reset after successful upload
    } catch (error) {
      console.error("Error uploading the file", error);
      setResponseMessage({
        message: "Error processing the image",
        finishReason: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile) {
      handleUpload();
    } else {
      console.log("No file selected");
      setResponseMessage("No file selected");
    }
  };
  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          capture="environment" // Use "environment" to prefer the rear camera
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
        <label htmlFor="cameraInput" className="camera-icon">
          <img src={logo} alt="Logo" className="logo" />
        </label>
        <label htmlFor="fileInput" className={`paperclip-icon ${fileSelected ? 'green-checkmark' : ''}`}>
          <FontAwesomeIcon icon={fileSelected ? faCheck : faPaperclip} size="2x" className={fileSelected ? 'checkmark-animation' : ''} />
        </label>
        <button type="submit">Upload</button>
      </form>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        responseMessage={responseMessage}
      />
    </div>

  );
}

export default withCellPhoneFrame(ImageUpload);
