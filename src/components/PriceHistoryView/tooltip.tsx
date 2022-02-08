import React from 'react';
import { Stack, Typography } from '@mui/material';
import ELAPrice from 'src/components/ELAPrice';

interface ComponentProps {
    price: number;
    timestamp: number;
}

const PriceHistoryToolTip: React.FC<ComponentProps> = ({ price, timestamp }): JSX.Element => {
    const getDateString = (timestamp: number) => {
        const t = new Date(timestamp);
        const date = ('0' + t.getDate()).slice(-2);
        const month = ('0' + (t.getMonth() + 1)).slice(-2);
        const year = t.getFullYear();
        // const hours = ('0' + t.getHours()).slice(-2);
        // const minutes = ('0' + t.getMinutes()).slice(-2);
        // const seconds = ('0' + t.getSeconds()).slice(-2);
        const time = `${year}-${month}-${date}`;
        return time;
    };

    return (
        <Stack padding={2} sx={{ background: 'white' }}>
            <ELAPrice price_ela={price} price_ela_fontsize={14} />
            <Typography fontSize={12} fontWeight={400}>
                {getDateString(timestamp)}
            </Typography>
            <Typography fontSize={12} fontWeight={700} alignSelf="flex-end">
                Username
            </Typography>
        </Stack>
    );
};

export default PriceHistoryToolTip;
