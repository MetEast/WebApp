import { makeStyles } from '@mui/styles';
import { styled, Button, TextField } from '@mui/material';

export const useStyles = makeStyles((theme: any) => ({
    container: {
        // marginRight: -32,
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

export const SelectBtn = styled(Button)<{ isopen: number }>`
    height: 40px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: #f0f1f2;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    color: #0a0b0c;
    .arrow-icon {
        margin-left: 4px;
        transform: ${({ isopen }) => (isopen ? 'rotate(-180deg)' : 'rotate(0deg)')};
        transition: transform 200ms linear;
    }
`;

export const DateTimeInput = styled(TextField)`
    border-radius: 12px;
    & .MuiOutlinedInput-root {
        & fieldset {
            border-style: none;
        }
        & input {
            height: 40px;
            padding-top: 0;
            padding-bottom: 0;
        }
    }
`;
