export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const cleanUrl = (url, platform) => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace('www.', '');
    const pathname = urlObj.pathname.replace(/^\/+|\/+$/g, ''); // Remove leading/trailing slashes
    return `${hostname}/${pathname}`;
  } catch {
    return url;
  }
};
