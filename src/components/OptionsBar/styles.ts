import { styled, Button } from '@mui/material';

export const FilterButton = styled(Button)`
    background: #e8f4ff;
    ${(props) => props.theme.breakpoints.down('sm')} {
        padding: 5px 10px;
    }
    padding: 15px 20px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 700;
    color: #1890ff;
`;
