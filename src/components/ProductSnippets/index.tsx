import React from 'react';
import { Stack, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import { SxProps } from '@mui/system';
import { reduceUserName } from 'src/services/common';

export interface ComponentProps {
    nickname?: string;
    sold?: number;
    instock?: number;
    likes?: number;
    views?: number;
    sx?: SxProps;
}

const ProductSnippets: React.FC<ComponentProps> = ({ nickname, sold, instock, likes, views, sx }): JSX.Element => {
    return (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ ...sx }}>
            {nickname !== undefined && nickname !== null && (
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Icon icon="ph:palette" />
                    <Typography fontWeight={500} fontSize={12}>
                        {`by ${nickname.length > 10 ? reduceUserName(nickname, 3) : nickname}`}
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
