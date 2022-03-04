import { styled, Stack } from '@mui/material';
import { SecondaryButton } from 'src/components/Buttons/styles';

export const Container = styled(Stack)`
    width: 300px;
    padding: 32px;
    box-shadow: 0px 4px 40px -26px rgba(0, 20, 39, 0.4);
    border-radius: 40px;
    background: white;
    ${(props) => props.theme.breakpoints.down('sm')} {
        width: 100%;
        padding: 20px;
        border-radius: 0;
        justify-content: center;
    }
`;

export const StatusButton = styled(SecondaryButton)<{ selected: boolean }>`
    width: 100%;
    background: ${({ selected }) => (selected ? '#1890ff' : '#e8f4ff')};
    color: ${({ selected }) => (selected ? 'white' : '#1890ff')};
    &:hover {
        background: ${({ selected }) => (selected ? '#28a0ff' : '#d8e4ef')};
    }
    ${(props) => props.theme.breakpoints.down('sm')} {
        font-size: 14px;
    }
`;
