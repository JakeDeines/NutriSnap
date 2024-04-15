import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css'; // Import the CSS file here

function Modal({ isOpen, onClose, responseMessage }) {
    if (!isOpen) return null;

    // Function to parse and render the message
    const renderResponseContent = (message) => {
        // Check if the message contains structured table data or just text
        const isTableData = message.includes('|'); // Very basic check for table-like structure
        if (isTableData) {
            // Simple markdown table to HTML table converter
            const rows = message.split('|').map(row => row.trim().split('|'));
            return (
                <table>
                    <thead>
                        <tr>{rows[0].map(header => <th key={header}>{header}</th>)}</tr>
                    </thead>
                    <tbody>
                        {rows.slice(1).map((row, index) => (
                            <tr key={index}>
                                {row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        } else {
            // Render as plain text
            return <p>{message}</p>;
        }
    };

    const modalContent = (
        <div className="modal-overlay">
            <div className="modal">
                <button onClick={onClose}>Close</button>
                {responseMessage && (
                    <div className="modal-content">
                        <h3>Response from OpenAI:</h3>
                        {renderResponseContent(responseMessage.message)}
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
