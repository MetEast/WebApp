import { TypeFavouritesFetch } from 'src/types/product-types';

// custome
export const getImageFromAsset = (id: string) => {
    if (id === undefined) return '';
    const prefixLen = id.split(':', 2).join(':').length;
    if (prefixLen >= id.length) return '';
    const uri = id.substring(prefixLen + 1);
    return `${process.env.REACT_APP_IPFS_NODE_URL}/${uri}`;
};

// Get time from timestamp // yyyy/MM/dd hh:mm
export const getTime = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    const dateStr = date.toISOString().slice(0, 10).replaceAll('-', '/');

    let hours = date.getUTCHours().toString();
    hours = hours.toString().padStart(2, '0');
    const min = date.getUTCMinutes().toString().padStart(2, '0');
    const timeStr = [hours, min].join(':');
    return { date: dateStr, time: timeStr };
};

// Get time from timestamp //
export const getUTCTime = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    const pieces = date.toUTCString().split(' ');
    const [wd, d, m, y] = pieces;
    const dateStr = [m, d, y].join(' ');

    let hours = date.getUTCHours().toString();
    hours = hours.toString().padStart(2, '0');
    const min = date.getUTCMinutes().toString().padStart(2, '0');
    const timeStr = ' at ' + [hours, min].join(':') + ' UTC';
    return { date: dateStr, time: timeStr };
};

// Get Abbrevation of hex addres //
export const reduceHexAddress = (strAddress: string, nDigits: number) =>
    strAddress
        ? `${strAddress.substring(0, 2 + nDigits)}...${strAddress.substring(
              strAddress.length - nDigits,
              strAddress.length,
          )}`
        : '';

export const storeWithExpireTime = (key: string, value: string, ttl: number) => {
    const now = new Date();
    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    const item = {
        value: value,
        expiry: now.getTime() + ttl,
    };

    localStorage.setItem(key, JSON.stringify(item));
};

export const selectFromFavourites = (value: TypeFavouritesFetch, tokenId: string) => {
    return value.tokenId === tokenId;
};

export default function emptyCache() {
    if ('caches' in window) {
        caches.keys().then((names) => {
            // Delete all the cache files
            names.forEach((name) => {
                caches.delete(name);
            });
        });

        // Makes sure the page reloads. Changes are only visible after you refresh.
        window.location.reload();
    }
}
