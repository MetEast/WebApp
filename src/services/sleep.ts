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
  const dateStr = date.toISOString().slice(0, 10);

  let hours = date.getUTCHours();
  hours = parseInt(hours.toString().padStart(2,'0'));
  const min = date.getUTCMinutes().toString().padStart(2,'0');
  const timeStr = [hours, min].join(':');
  return {'date':dateStr, 'time':timeStr};
};

// Get Abbrevation of hex addres //
export const reduceHexAddress = (strAddress: string) => strAddress?`${strAddress.substring(0, 5)}...${strAddress.substring(strAddress.length - 3, strAddress.length)}`:'';
