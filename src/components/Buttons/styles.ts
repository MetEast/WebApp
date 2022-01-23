import { styled, Button } from '@mui/material';

export const BaseButton = styled(Button)<{ size?: 'small' }>`
    height: ${({ size }) => (size === 'small' ? '40px' : '56px')};
    border-radius: ${({ size }) => (size === 'small' ? '12px' : '16px')};
    font-size: ${({ size }) => (size === 'small' ? '16px' : '18px')};
    font-weight: 700;
`;

export const PrimaryButton = styled(BaseButton)`
    background: #1890ff;
    color: white;
    &:hover {
        background: #28a0ff;
    }
`;

export const SecondaryButton = styled(BaseButton)`
    background: #e8f4ff;
    color: #1890ff;
    &:hover {
        background: #d8e4ef;
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
