import { styled, Typography, Box } from '@mui/material';
import { BaseButton } from 'src/components/Buttons/styles';

export const NotificationTypo = styled(Typography)`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 6px;
    top: 6px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    font-size: 10px;
    font-weight: 700;
    color: white;
    background: #1890ff;
`;

export const MenuButton = styled(BaseButton)<{ selected: boolean }>`
    min-width: 40px;
    background: ${({ selected }) => (selected ? '#E8F4FF' : 'transparent')};
    color: ${({ selected }) => (selected ? '#1890FF' : 'black')};
    &:hover {
        background: #e8f4ff;
    }
`;

export const NotificationsBoxContainer = styled(Box)<{ show: boolean }>`
    display: ${({ show }) => (show ? 'block' : 'none')};
    position: absolute;
    top: 40px;
    right: 0;
    padding-top: 8px;
    ${(props) => props.theme.breakpoints.down('sm')} {
        position: fixed;
        width: 100vw;
        height: 100vh;
        background: white;
        inset: 0;
        z-index: 30;
    }
`;
