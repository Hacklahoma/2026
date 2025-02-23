import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import qrCodeIcon from '../assets/icons/QRCode_icon.png';
import qrCodeDarkIcon from '../assets/icons/QRCode_dark_icon.png';
import '../styles/DiscordQRModal.css';

const DiscordQRModal = ({ username, onClose }) => {
  // Clean the username (remove any URL parts if present)
  const discordUsername = username.split('/').pop().trim();
  const isDarkMode = document.body.classList.contains('dark-mode');

  return (
    <div className="qr-modal-overlay">
      <div className="qr-modal">
        <button className="close-button" onClick={onClose}>×</button>
        <h3>Scan to Add Friend</h3>
        <div className="qr-container">
          <QRCodeCanvas 
            value={discordUsername}
            size={150}
            cornerRadius={30}
            level="H"
            includeMargin={true}
            bgColor="#36393f"
            fgColor="#ffffff"
          />
        </div>
        <p className="username-text">{discordUsername}</p>
        <div className="instructions">
          <p>To add friend:</p>
          <ol>
            <li>Scan QR with your phone</li>
            <li>Copy the username <img 
                src={isDarkMode ? qrCodeDarkIcon : qrCodeIcon} 
                alt="QR" 
                className="inline-icon"
              /></li>
            <li>Open Discord</li>
            <li>Click "Add Friend"</li>
            <li>Paste the username</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default DiscordQRModal; 