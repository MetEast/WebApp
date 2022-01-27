import { styled, Box } from '@mui/material';

export const ListItemsWrapper = styled(Box)<{ isOpen: boolean }>`
    display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
    position: absolute;
    background: white;
    border-radius: 4px;
    z-index: 10;
`;
