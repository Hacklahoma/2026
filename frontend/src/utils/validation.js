export const isValidUrl = (url) => {
  try {
    // If URL doesn't have a protocol, add https:// for validation
    const urlToCheck = url.startsWith('http') ? url : `https://${url}`;
    new URL(urlToCheck);
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
