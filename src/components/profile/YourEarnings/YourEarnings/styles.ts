import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme: any) => ({
    earnings_list__container: {
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
