export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 60) return `${diffMins} minute${diffMins != 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours != 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };