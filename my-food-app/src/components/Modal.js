import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css'; // Import the CSS file here


function Modal({ isOpen, onClose, responseMessage }) {
    if (!isOpen) return null;

    const modalContent = (
        <div className="modal-overlay">
            <div className="modal">
                <button onClick={onClose}>Close</button>
                {responseMessage && (
                    <div className="modal-content">
                        <h3>Response from OpenAI:</h3>
                        <p>{responseMessage.message}</p>
                        <p>Finish Reason: {responseMessage.finishReason}</p>
                    </div>
                )}
            </div>
        </div>
    );

    return ReactDOM.createPortal(
        modalContent,
        document.getElementById('modal-root') // Ensure you have this element in your HTML
    );
}

export default Modal;
