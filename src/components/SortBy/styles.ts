import { styled, Box, Button } from '@mui/material';

export const SortByBtn = styled(Button)<{ isOpen: boolean }>`
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: #e8f4ff;
    padding: 13px 20px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 700;
    color: #1890ff;
    img {
        width: 20px;
        height: 20px;
        margin-right: 6px;
    }
    .arrow-icon {
        transform: ${({ isOpen }) => (isOpen ? 'rotate(-180deg)' : 'rotate(0deg)')};
        transition: transform 200ms linear;
    }
`;

export const ListItemsWrapper = styled(Box)<{ isOpen: boolean }>`
    display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
    position: absolute;
    background: white;
    border-radius: 4px;
    z-index: 10;
`;
