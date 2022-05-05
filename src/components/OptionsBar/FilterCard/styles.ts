import { styled, Stack, Button } from '@mui/material';

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
