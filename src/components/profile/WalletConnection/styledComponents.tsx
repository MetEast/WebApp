import { styled, Box, Button } from '@mui/material';

export const WalletConnectionButton = styled(Button)`
    background-color: var(--color-gray);
    padding-top: 1.75rem;
    padding-bottom: 1.75rem;
`;

export const WalletButtonIconContainer = styled(Box)`
    text-align: center;
    margin-bottom: ${({ theme }) => theme.spacing(1)};
`;
