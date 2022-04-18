import { styled, Typography, Box } from '@mui/material';
import { BaseButton } from 'src/components/Buttons/styles';
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme: any) => ({
    container: {
        '&::-webkit-scrollbar': {
            width: 36,
        },
        '&::-webkit-scrollbar-thumb': {
            border: '14px solid rgba(0, 0, 0, 0)',
            backgroundClip: 'padding-box',
            borderRadius: '9999px',
            backgroundColor: '#AAAAAA',
        },
    },
}));

export const NotificationTypo = styled(Typography)`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 0px;
    width: 24px;
    height: 24px;
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
    max-height: 70vh;
    padding-top: 16px;
    overflow-y: auto;
    overflow-x: hidden;
    background: white;
    border-radius: 32px;
    box-shadow: 0px 4px 40px -26px rgba(0, 20, 39, 0.8);
    ${(props) => props.theme.breakpoints.down('sm')} {
        /* position: fixed;
        width: 100vw;
        height: 100vh;
        background: white;
        inset: 0;
        z-index: 30; */
        display: none;
    }
`;
