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