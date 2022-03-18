import { makeStyles } from '@mui/styles';
import { styled } from '@mui/material';

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

export const ImageBox = styled('label')`
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
        max-width: 100%;
        max-height: 100%;
        border-radius: 12px;
        /* width: 100%;
        height: 100%;
        object-fit: contain; */
    }
`;
