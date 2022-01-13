import { styled, Button } from '@mui/material';

export const ConnectButton = styled(Button)<{ selected: boolean }>`
    width: 186px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px 0;
    border-radius: 16px;
    background: ${({ selected }) => selected ? '#3b99fc1a' : '#F1F1F1'};
    text-transform: capitalize;
`;
