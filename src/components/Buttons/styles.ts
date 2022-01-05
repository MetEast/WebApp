import { styled, Button } from '@mui/material';

export const PrimaryButton = styled(Button)`
    height: 56px;
    background: #1890ff;
    color: white;
    border-radius: 16px;
    font-size: 18px;
    font-weight: 700;
    &:hover {
        background: #0870ef;
    }
`;

export const CancelSaleButton = styled(Button)`
    height: 56px;
    background: #fdeeee;
    color: #eb5757;
    border-radius: 16px;
    font-size: 18px;
    font-weight: 700;
    &:hover {
        background: #fddede;
    }
`;

export const ChangePriceButton = styled(Button)`
    height: 56px;
    background: #e8f4ff;
    color: #1890ff;
    border-radius: 16px;
    font-size: 18px;
    font-weight: 700;
    &:hover {
        background: #d8e4ff;
    }
`;
