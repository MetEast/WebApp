import React from 'react';
import { Stack, Typography } from '@mui/material';
import { Icon } from '@iconify/react';

export interface ComponentProps {
    nickname?: string;
    sold?: number;
    instock?: number;
    likes?: number;
    views?: number;
}

const ProductSnippets: React.FC<ComponentProps> = ({ nickname, sold, instock, likes, views }): JSX.Element => {
    return (
        <Stack direction="row" alignItems="center" spacing={1}>
            {nickname !== undefined && (
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Icon icon="ph:palette" />
                    <Typography fontWeight={500} fontSize={12} >
                        {`by ${nickname}`}
                    </Typography>
                </Stack>
            )}
            {sold !== undefined && (
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Icon icon="ph:handshake" />
                    <Typography fontWeight={500} fontSize={12}>
                        {`${sold} Sold`}
                    </Typography>
                </Stack>
            )}
            {instock !== undefined && (
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Icon icon="ph:storefront" />
                    <Typography fontWeight={500} fontSize={12}>
                        {`${instock} In Stock`}
                    </Typography>
                </Stack>
            )}
            {likes !== undefined && (
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Icon icon="ph:heart" />
                    <Typography fontWeight={500} fontSize={12}>
                        {`${likes} likes`}
                    </Typography>
                </Stack>
            )}
            {views !== undefined && (
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Icon icon="ph:eye" />
                    <Typography fontWeight={500} fontSize={12}>
                        {`${views} Views`}
                    </Typography>
                </Stack>
            )}
        </Stack>
    );
};

export default ProductSnippets;
