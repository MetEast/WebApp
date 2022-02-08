import { styled, Box, TextField } from '@mui/material';

export const SearchFieldWrapper = styled(Box)`
    display: flex;
    flex-grow: 1;
    align-items: center;
    background: #f0f1f2;
    border-radius: 12px;
    padding: 0 16px;
    // @media (max-width: 375px) {
    //     padding: 0 5px;
    // }
    &:active {
    }
`;

export const SearchTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        height: 40,
        '& input': {
            paddingTop: 0,
            paddingBottom: 0,
        },
        '& fieldset': {
            borderWidth: 0,
        },
        '&.Mui-focused fieldset': {
            borderWidth: 0,
        },
    },
});
