import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import '../styles/InstagramQRModal.css';

const InstagramQRModal = ({ username, onClose }) => {
  return (
    <div className="qr-modal-overlay" onClick={onClose}>
      <div className="qr-modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Instagram Profile</h2>
        <div className="qr-code-container">
          <QRCodeCanvas 
            value={`instagram.com/${username}`}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>
        <p className="username-display">@{username}</p>
        <p className="scan-instruction">Scan to view Instagram profile</p>
      </div>
    </div>
  );
};

export default InstagramQRModal; 