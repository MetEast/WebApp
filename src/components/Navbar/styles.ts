import { styled, Typography } from '@mui/material';

export const NotificationTypo = styled(Typography)<{ mobile: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: ${({ mobile }) => (mobile ? '6px' : '4px')};
    top: ${({ mobile }) => (mobile ? '6px' : '4px')};
    width: ${({ mobile }) => (mobile ? '12px' : '18px')};
    height: ${({ mobile }) => (mobile ? '12px' : '18px')};
    border-radius: 50%;
    font-size: ${({ mobile }) => (mobile ? '8px' : '12px')};
    font-weight: 700;
    color: white;
    background: #1890ff;
`;
