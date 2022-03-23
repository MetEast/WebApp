import { styled, Stack } from '@mui/material';

export const Container = styled(Stack)`
    width: 420px;
    padding: 32px;
    box-sizing: border-box;
    ${(props) => props.theme.breakpoints.down('sm')} {
        width: 100%;
        height: 100%;
        border-radius: 0;
    }
`;
