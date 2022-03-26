import { makeStyles } from '@mui/styles';
import { styled, Box } from '@mui/material';

export const useStyles = makeStyles((theme: any) => ({
    container: {
        marginRight: -32,
        '&::-webkit-scrollbar': {
            width: 32,
        },
        '&::-webkit-scrollbar-thumb': {
            border: '12px solid rgba(0, 0, 0, 0)',
            backgroundClip: 'padding-box',
            borderRadius: '9999px',
            backgroundColor: '#AAAAAA',
        },
    },
}));

export const ProfileImageWrapper = styled(Box)`
    align-self: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: #e8f4ff;
    cursor: pointer;
    .hover_box_container {
        position: absolute;
        top: 0;
        left: 0;
        width: 40%;
        height: 40%;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        background: #1890ff;
        opacity: 0.8;
        cursor: pointer;
        display: none;
    }
    &:hover {
        .hover_box_container {
            display: flex;
        }
    }
`;

export const ProfileImage = styled('img')`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
`;

export const BannerBox = styled(Box)`
    position: relative;
    height: 156px;
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0px 4px 2px -2px rgba(2, 14, 25, 0.2);
    filter: drop-shadow(0px 4px 8px rgba(7, 43, 76, 0.2));
    cursor: pointer;
    .hover_box_container {
        position: absolute;
        inset: 0;
        background: #1890ff;
        opacity: 0.8;
        display: none;
    }
    &:hover {
        .hover_box_container {
            display: flex;
        }
    }
`;
