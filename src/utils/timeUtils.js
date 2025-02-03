/**
 * 🔹 Format Timestamp to Readable Date
 */
export const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString();
  };
  
  /**
   * 🔹 Calculate Time Difference
   * - Returns "Just now", "X minutes ago", etc.
   */
  export const timeAgo = (timestamp) => {
    if (!timestamp) return "N/A";
    const seconds = Math.floor((new Date() - new Date(timestamp.seconds * 1000)) / 1000);
  
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)} years ago`;
  
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)} months ago`;
  
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)} days ago`;
  
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)} hours ago`;
  
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)} minutes ago`;
  
    return "Just now";
  };