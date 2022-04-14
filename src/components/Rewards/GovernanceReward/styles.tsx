import { styled, Button } from '@mui/material';

export const BecomeDAOBtn = styled(Button)`
    font-size: 16px;
    font-weight: 700;
    margin-left: 20px;
    padding: 12px 16px;
    border-radius: 16px;
    text-transform: none;
    color: white;
    background: #ffffff33;
    :hover {
        background: #ffffff66;
    }
    ${(props) => props.theme.breakpoints.down('md')} {
        font-size: 11px;
        padding: 8px 16px;
    }
`;
