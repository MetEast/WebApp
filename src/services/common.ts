// custome
export const getImageFromAsset = (id: string) => {
    if(id===undefined)
      return "";
    const prefixLen = id.split(':', 2).join(':').length
    if(prefixLen >= id.length)
      return "";
    const uri = id.substring(prefixLen + 1);
    return `${process.env.REACT_APP_IPFS_NODE_URL}/${uri}`
}

// Get time from timestamp // yyyy/MM/dd hh:mm
export const getTime = (timestamp: string) => {
  const date = new Date(parseInt(timestamp) * 1000);
  const dateStr = date.toISOString().slice(0, 10).replaceAll('-', '/');

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
