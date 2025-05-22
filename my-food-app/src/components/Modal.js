import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';
import ClipLoader from 'react-spinners/ClipLoader';
import NutrientTable from './NutrientTable';

function Modal({ isOpen, onClose, responseMessage, loading, imagePreview }) {
  if (!isOpen) return null;

  const renderResponseContent = (message) => {
    if (!message) return <p>No content received.</p>;

    let parsed = typeof message === 'string' ? null : message;

    // Try parsing JSON if it's a string
    if (typeof message === 'string') {
      try {
        parsed = JSON.parse(message);
      } catch (e) {
        return <p>{message}</p>;
      }
    }

    if (parsed && typeof parsed === 'object' && parsed.description && Array.isArray(parsed.nutrition)) {
      const tableData = parsed.nutrition.map((item) => ({
        nutrient: item.nutrient,
        amount: item.amount,
        dailyValue: item.daily_value || item.dailyValue || 'N/A',
      }));

      return (
        <>
          <div className="card">
            <h3>Description</h3>
            <p>{parsed.description}</p>
          </div>
          <div className="card">
            <h3>Nutritional Information</h3>
            <NutrientTable data={tableData} />
          </div>
        </>
      );
    }

    return <p>Unexpected response format.</p>;
  };

  const modalContent = (
    <div className="modal-overlay">
      <div className="modal">
        <button onClick={onClose} className="close-button">Close</button>
        <div className="modal-content">
          {imagePreview && (
            <div className="card">
              <h3>Uploaded Image</h3>
              <img
                src={imagePreview}
                alt="Uploaded"
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </div>
          )}
          {loading ? (
            <ClipLoader color="#123abc" loading={loading} size={150} />
          ) : (
            responseMessage && (
              <>
                {renderResponseContent(responseMessage.message.content || responseMessage.message)}
                <div className="card">
                  <h3>Finish Reason</h3>
                  <p>{responseMessage.finishReason}</p>
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.getElementById('modal-root')
  );
}

export default Modal;
