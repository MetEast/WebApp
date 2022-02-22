import { styled, Box, Stack, Button } from '@mui/material';

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
    /* z-index: 20; */
    .arrow-icon {
        margin-left: 4px;
        transform: ${({ isopen }) => (isopen ? 'rotate(-180deg)' : 'rotate(0deg)')};
        transition: transform 200ms linear;
    }
`;

export const ListItemsWrapper = styled(Box)<{ isopen: number }>`
    display: ${({ isopen }) => (isopen ? 'block' : 'none')};
    position: absolute;
    margin-top: 8px;
    z-index: 10;
`;

export const ListItemsStack = styled(Stack)`
    border-radius: 16px;
    padding: 8px;
    overflow: hidden;
    background: white;
    box-shadow: 0px 4px 40px -26px rgba(0, 20, 39, 0.8);
`;

export const ItemButton = styled(Button)`
    border-radius: 12px;
    background: transparent;
    color: #0a0b0c;
    &:hover {
        background: #e8f4ff;
    }
`;
