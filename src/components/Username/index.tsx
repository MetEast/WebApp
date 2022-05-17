import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

export interface ComponentProps {
    username: string;
    fontSize: number;
    fontWeight: number;
    maxLength?: number;
}

const UsernameTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        marginTop: '0 !important',
        fontSize: 13,
        borderRadius: 4,
    },
}));

const Username: React.FC<ComponentProps> = ({ username, fontSize, fontWeight, maxLength = 16 }): JSX.Element => {
    let shortName = username;
    if (username && username.length > maxLength) {
        const len2 = Math.floor((maxLength - 3) / 2);
        const len1 = maxLength - 3 - len2;
        shortName = `${username.substring(0, len1)}...${username.substring(username.length - len2)}`;
    }
    return (
        <Box>
            <UsernameTooltip title={username} placement="bottom-start">
                <Typography fontSize={fontSize} fontWeight={fontWeight} sx={{ display: 'inline' }}>
                    {shortName}
                </Typography>
            </UsernameTooltip>
        </Box>
    );
};

export default Username;
