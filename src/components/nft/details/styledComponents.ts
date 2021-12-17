import { styled, Box } from '@mui/material';
import { H5Typography } from 'src/core/typographies';

export const DetailsItemContainer = styled(Box)`
    margin-top: ${({ theme }) => theme.spacing(2)};
    display: flex;
    justify-content: space-between;
`;

export const DetailsItemLeftTypography = styled(H5Typography)`
    font-weight: 600;
`;
