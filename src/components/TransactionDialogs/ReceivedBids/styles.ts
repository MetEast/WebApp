import { styled, Button } from '@mui/material';

export const SelectTitleBtn = styled(Button)<{ isOpen: number }>`
    height: 40px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background: #f0f1f2;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    color: #0a0b0c;
    /* z-index: 20; */
    .arrow-icon {
        margin-left: 4px;
        transform: ${({ isOpen }) => (isOpen ? 'rotate(-180deg)' : 'rotate(0deg)')};
        transition: transform 200ms linear;
    }
`;
