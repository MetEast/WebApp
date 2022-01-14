import { styled, Box, IconButton } from '@mui/material';

export const ShowMenuBtn = styled(IconButton)`
    width: 40px;
    height: 40px;
    background: #1890ff;
    border-radius: 0 12px 12px 0;
    &:hover {
        background: #28a0ff;
    }
`;

export const MenuBox = styled(Box)`
    height: calc(100vh - 48px);
    background: #1890ff;
    border-radius: 16px;
    padding: 24px;
`;

export const ContentBox = styled(Box)`
    height: calc(100vh - 48px);
    padding: 24px 24px 24px 0;
    /* background: #eeeeee; */
    /* background-clip: content-box; */
`;
