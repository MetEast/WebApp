import { styled, Button } from '@mui/material';

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
    .arrow-icon {
        margin-left: 4px;
        transform: ${({ isopen }) => (isopen ? 'rotate(-180deg)' : 'rotate(0deg)')};
        transition: transform 200ms linear;
    }
`;

export const CopyToClipboardButton = styled(Button)`
    background: #FFF;
    padding: 0;
    margin: 0 0 0 5px;
    min-width: 0;
    &:active {
    }
`;
