import { styled, Box } from '@mui/material';

export const ContainerWrapper = styled(Box)`
    margin: auto;
    overflow: hidden;
    ${(props) => props.theme.breakpoints.down('sm')} {
        width: 100%;
        max-width: 90%;
    }
    ${(props) => props.theme.breakpoints.up('sm')} {
        width: 100%;
        max-width: 90%;
    }
    ${(props) => props.theme.breakpoints.up('md')} {
        width: 100%;
        max-width: 90%;
    }
    ${(props) => props.theme.breakpoints.up('lg')} {
        width: 100%;
        max-width: 1200px;
    }
    ${(props) => props.theme.breakpoints.up('xl')} {
        width: 100%;
        max-width: 1440px;
    }
`;
