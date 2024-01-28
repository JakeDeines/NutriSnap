import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal'; // Import Modal component
import withCellPhoneFrame from './CellPhoneFrame';
import './ImageUpload.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';


function ImageUpload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [responseMessage, setResponseMessage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('image', selectedFile);
    
        try {
            const response = await axios.post('http://localhost:3001/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            // Assuming the response contains a message and a finish_reason
            const message = response.data.message.content;
            const finishReason = response.data.finish_reason;
            setResponseMessage({ message, finishReason });
        } catch (error) {
            console.error("Error uploading the file", error);
            setResponseMessage({ message: "Error processing the image", finishReason: '' });
        }
        setIsModalOpen(true); // Open the modal after receiving the response
    };
      // Function to close the modal
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
            <img src="/images/logo.png" alt="Logo" className="logo" />
            <form onSubmit={handleSubmit}>
                <input type="file" id="fileInput" style={{display: 'none'}} onChange={handleFileChange} />
                <label htmlFor="fileInput" className="paperclip-icon">
                    <FontAwesomeIcon icon={faPaperclip} size="2x" />
                </label>
                <button type='submit'>Upload</button>
            </form>

            {/* Modal is placed directly within the container, not inside any other div */}
            <Modal isOpen={isModalOpen} onClose={closeModal} responseMessage={responseMessage} />
        </div>
    );
}

export default withCellPhoneFrame(ImageUpload);

