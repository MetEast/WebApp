import { styled, Button } from '@mui/material';

export const SaleTypeButton = styled(Button)<{ selected: boolean }>`
    height: 40px;
    background: ${({ selected }) => (selected ? '#E8F4FF' : 'transparent')};
    color: ${({ selected }) => (selected ? '#1890FF' : '#0A0B0C')};
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;
    &:hover {
        background: #d8e4ff;
    }
`;

export const SelectBtn = styled(Button)<{ isOpen: boolean }>`
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
        transform: ${({ isOpen }) => (isOpen ? 'rotate(-180deg)' : 'rotate(0deg)')};
        transition: transform 200ms linear;
    }
`;
