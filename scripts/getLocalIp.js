const os = require('os');
const fs = require('fs');
const path = require('path');

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName of Object.keys(interfaces)) {
    const addresses = interfaces[interfaceName];
    for (const address of addresses) {
      if (address.family === 'IPv4' && !address.internal) {
        return address.address;
      }
    }
  }
  return 'localhost';
}

// Create .env.local with the IP address
const localIp = getLocalIpAddress();
const envContent = `VITE_LOCAL_IP=${localIp}\n`;
fs.writeFileSync(path.join(__dirname, '../frontend/.env.local'), envContent);

console.log(`Local IP address: ${localIp}`); 