import { ipfsConfig } from 'src/config';
import { enumBadgeType } from 'src/types/product-types';

export const getImageFromAsset = (id: string) => {
    if (!id) return '';
    if (typeof id !== 'string') return '';
    const prefixLen = id.split(':', 2).join(':').length;
    if (prefixLen >= id.length) return '';
    const uri = id.substring(prefixLen + 1);
    return `${ipfsConfig.ipfsNodeUrl}/${uri}`;
};

export const getAssetFromImage = (url: string) => {
    if (!url) return '';
    const asset = url.replace(`${ipfsConfig.ipfsNodeUrl}/`, '');
    return `meteast:image:${asset}`;
};

// Get time from timestamp // yyyy/MM/dd hh:mm
export const getTime = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    // const dateStr = date.toISOString().slice(0, 10).replaceAll('-', '/');
    const dateString = date.toLocaleDateString('en-US');
    const dateStrs = dateString.split('/');
    const dateStr = dateStrs[2] + '/' + dateStrs[0] + '/' + dateStrs[1];
    let hours = date.getHours().toString();
    hours = hours.toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');
    const timeStr = [hours, min].join(':');
    return { date: dateStr, time: timeStr };
};

// Get UTC time from timestamp
export const getUTCTime = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    const pieces = date.toUTCString().split(' ');
    const [wd, d, m, y] = pieces;
    console.log(wd);
    const dateStr = [m, d, y].join(' ');
    let hours = date.getUTCHours().toString();
    hours = hours.toString().padStart(2, '0');
    const min = date.getUTCMinutes().toString().padStart(2, '0');
    const timeStr = ' at ' + [hours, min].join(':') + ' UTC';
    return { date: dateStr, time: timeStr };
};

export const getCustomTime = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    const pieces = date.toString().split(' ');
    const [wd, m, d, y] = pieces;
    console.log(wd);
    const dateStr = [m, d, y].join('-');
    let hours = date.getHours();
    const suffix = hours >= 12 ? 'PM' : 'AM';
    hours = hours > 12 ? hours - 12 : hours;
    const hour = hours.toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');
    const sec = date.getSeconds().toString().padStart(2, '0');
    const timeStr = [hour, min, sec]
        .join(':')
        .concat(' ')
        .concat([suffix, `UTC${getTimeZone()}`].join(' '));
    return { date: dateStr, time: timeStr };
};

export const getDateTimeString = (date: Date) =>
    `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

export const getTimeZone = () => {
    const e = String(-new Date().getTimezoneOffset() / 60);
    return e.includes('-') ? e : '+'.concat(e);
};

// Get Abbrevation of hex addres //
export const reduceHexAddress = (strAddress: string, nDigits: number) =>
    strAddress
        ? `${strAddress.substring(0, 2 + nDigits)}...${strAddress.substring(
              strAddress.length - nDigits,
              strAddress.length,
          )}`
        : '';

export const reduceUserName = (username: string, nDigits: number) =>
    username
        ? username.length > nDigits * 2
            ? `${username.substring(0, nDigits)}...${username.substring(username.length - nDigits, username.length)}`
            : username
        : '';

export const getMintCategory = (value: string | undefined) => {
    if (value === undefined) return enumBadgeType.Other;
    switch (value) {
        case 'Original':
            return enumBadgeType.Original;
        case 'Museum':
            return enumBadgeType.Museum;
        case 'Arts':
            return enumBadgeType.Arts;
        case 'Sports':
            return enumBadgeType.Sports;
        case 'Dimension':
            return enumBadgeType.Dimension;
        case 'Pets':
            return enumBadgeType.Pets;
        case 'Recreation':
            return enumBadgeType.Recreation;
        case 'Star':
            return enumBadgeType.Star;
        default:
            return enumBadgeType.Other;
    }
};

export const getMondayOfWeek = (d: Date) => {
    d = new Date(d);
    let day = d.getDay();
    let diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
};

export const getChartDateList = (date: Date, type: string) => {
    let retDateList: Array<Date> = [];
    if (type === 'Daily') {
        // const dayBeforeYesterday = new Date(date.setDate(date.getDate() - 2));
        const yesterday = new Date(date.setDate(date.getDate() - 1));
        const today = new Date(date.setDate(date.getDate() + 1));
        const tomorrow = new Date(date.setDate(date.getDate() + 1));

        // retDateList.push(dayBeforeYesterday);
        retDateList.push(yesterday);
        retDateList.push(today);
        retDateList.push(tomorrow);
        // retDateList.push(date)
    } else if (type === 'Weekly') {
        // let startDate = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);
        let startDate = getMondayOfWeek(date);
        retDateList.push(new Date(startDate));
        let curDate = new Date(startDate);
        for (let i = 0; i < 6; i++) {
            let nextDate = new Date(curDate.setDate(curDate.getDate() + 1));
            retDateList.push(nextDate);
            curDate = new Date(nextDate);
        }
    } else if (type === 'Monthly') {
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        // let firstDay = new Date(date.getTime() - 30 * 24 * 60 * 60 * 1000);
        // let lastDay = date;
        retDateList.push(firstDay);
        let curDate = new Date(firstDay);
        while (curDate < lastDay) {
            let nextDate = new Date(curDate.setDate(curDate.getDate() + 1));
            retDateList.push(nextDate);
            curDate = new Date(nextDate);
        }
    }
    return retDateList;
};

export const getChartTimestampList = (type: string) => {
    const date = new Date();
    if (type === 'Daily') {
        const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        const end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
        return { start: start.getTime(), end: end.getTime() };
    } else if (type === 'Weekly') {
        // const start = getMondayOfWeek(date);
        const firstDay = getMondayOfWeek(date);
        const temp = new Date(firstDay);
        const start = new Date(firstDay.setHours(0, 0, 0, 0));
        const end = new Date(temp.setDate(temp.getDate() + 6));
        return { start: start.getTime(), end: end.getTime() };
    } else if (type === 'Monthly') {
        const start = new Date(date.getFullYear(), date.getMonth(), 1);
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return { start: start.getTime(), end: end.getTime() };
    } else {
        return { start: 0, end: 0 };
    }
};
