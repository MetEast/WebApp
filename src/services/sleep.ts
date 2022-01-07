export const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

// custome
export const getThumbnail = (id: string) => {
    if(id===undefined)
      return ""
    const prefixLen = id.split(':', 2).join(':').length
    if(prefixLen>=id.length)
      return ""
    const uri = id.substring(prefixLen+1)
    return `https://ipfs0.trinity-feeds.app/ipfs/${uri}`
}

// Get time from timestamp //
export const getTime = (timestamp: string) => {
  const date = new Date(parseInt(timestamp) * 1000);
  const pieces = date.toUTCString().split(" ");
  const [wd, d, m, y] = pieces;
  const dateStr = [m, d, y].join("-");

  let hours = date.getUTCHours();
  const suffix = hours >= 12 ? "PM":"AM";
  hours = hours > 12 ? hours - 12 : hours;
  hours = parseInt(hours.toString().padStart(2,'0'));
  const min = date.getUTCMinutes().toString().padStart(2,'0');
  const sec = date.getUTCSeconds().toString().padStart(2,'0');
  const timeStr = [hours, min, sec].join(':').concat(" ").concat([suffix, "+UTC"].join(' '));
  return {'date':dateStr, 'time':timeStr};
};