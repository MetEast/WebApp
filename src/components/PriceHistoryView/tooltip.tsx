import React from 'react';
import { Stack, Typography } from '@mui/material';
import ELAPrice from 'src/components/ELAPrice';

interface ComponentProps {
    price: number;
    timestamp: number;
    username: string;
}

const PriceHistoryToolTip: React.FC<ComponentProps> = ({ price, timestamp, username }): JSX.Element => {
    const getDateString = (timestamp: number) => {
        const date = new Date(timestamp);
        const day = date.toLocaleString('default', { day: '2-digit' });
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.toLocaleString('default', { year: 'numeric' });
        // const hours = ('0' + date.getHours()).slice(-2);
        // const minutes = ('0' + date.getMinutes()).slice(-2);
        // const seconds = ('0' + date.getSeconds()).slice(-2);
        const time = `${day} ${month} ${year}`;
        return time;
    };

    return (
        <Stack padding={2} sx={{ background: 'white' }}>
            <ELAPrice price_ela={price} price_ela_fontsize={14} />
            <Typography fontSize={12} fontWeight={400}>
                {getDateString(timestamp)}
            </Typography>
            {price > 0 && (
                <Typography fontSize={12} fontWeight={700} alignSelf="flex-end">
                    {username}
                </Typography>
            )}
        </Stack>
    );
};

export default PriceHistoryToolTip;
