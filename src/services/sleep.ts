export const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

// custome
export const getImageFromAsset = (id: string) => {
    if(id===undefined)
      return ""
    const prefixLen = id.split(':', 2).join(':').length
    if(prefixLen>=id.length)
      return ""
    const uri = id.substring(prefixLen+1)
    return `https://ipfs-test.trinity-feeds.app/ipfs/${uri}`
}

// Get time from timestamp //
export const getTime = (timestamp: string) => {
  const date = new Date(parseInt(timestamp) * 1000);
  const dateStr = date.toISOString().slice(0, 10);

  let hours = date.getUTCHours().toString();
  hours = hours.toString().padStart(2,'0');
  const min = date.getUTCMinutes().toString().padStart(2,'0');
  const timeStr = [hours, min].join(':');
  return {'date':dateStr, 'time':timeStr};
};

// Get time from timestamp //
export const getUTCTime = (timestamp: string) => {
  const date = new Date(parseInt(timestamp) * 1000);
  const pieces = date.toUTCString().split(" ");
  const [wd, d, m, y] = pieces;
  const dateStr = [m, d, y].join(" ");

  let hours = date.getUTCHours().toString();
  hours = hours.toString().padStart(2,'0');
  const min = date.getUTCMinutes().toString().padStart(2,'0');
  const timeStr = " at " + [hours, min].join(':') + " UTC";
  return {'date':dateStr, 'time':timeStr};
};

// Get Abbrevation of hex addres //
export const reduceHexAddress = (strAddress: string, nDigits: number) => strAddress?`${strAddress.substring(0, 2 + nDigits)}...${strAddress.substring(strAddress.length - nDigits, strAddress.length)}`:'';

declare global {
  interface Window {
    ethereum: any;
  }
}