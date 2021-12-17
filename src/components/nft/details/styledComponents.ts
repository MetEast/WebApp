import { styled, Box, Button } from '@mui/material';
import { H5Typography } from 'src/core/typographies';

export const DetailsItemContainer = styled(Box)`
    margin-top: ${({ theme }) => theme.spacing(2)};
    display: flex;
    justify-content: space-between;
`;

export const DetailsItemLeftTypography = styled(H5Typography)`
    font-weight: 600;
`;

export const NftDetailsSmallButton = styled(Button)`
    font-size: 0.875rem;
    padding: 0.5rem 0.75rem;
`;
