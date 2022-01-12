import { styled, Button } from '@mui/material';

export const FilterButton = styled(Button)`
    background: #e8f4ff;
    padding: 15px 20px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 700;
    color: #1890ff;
    ${(props) => props.theme.breakpoints.down('sm')} {
        min-width: 45px !important;
        min-height: 40px !important;
        padding: 10px 5px !important;
    }
`;
