import { styled, Button } from '@mui/material';

const buttonStyles = {
    primary: {
        bgColor: '#1890ff',
        hoverBgColor: '#28a0ff',
        color: 'white',
    },
    secondary: {
        bgColor: '#e8f4ff',
        hoverBgColor: '#d8e4ef',
        color: '#1890ff',
    },
    pink: {
        bgColor: '#fdeeee',
        hoverBgColor: '#fddede',
        color: '#eb5757',
    },
    green: {
        bgColor: '#C9F5DC',
        hoverBgColor: '#B9FFCC',
        color: '#1EA557',
    },
    none: {
        bgColor: 'transparent',
        hoverBgColor: 'transparent',
        color: '#1890FF',
    },
};

export const BaseButton = styled(Button)<{ size?: 'small' }>`
    height: ${({ size }) => (size === 'small' ? '40px' : '56px')};
    border-radius: ${({ size }) => (size === 'small' ? '12px' : '16px')};
    font-size: ${({ size }) => (size === 'small' ? '16px' : '18px')};
    font-weight: 700;
`;

export const PrimaryButton = styled(BaseButton)<{ btn_color?: 'primary' | 'secondary' | 'pink' | 'green' | 'none' }>`
    background: ${({ btn_color = 'primary' }) => buttonStyles[btn_color].bgColor};
    color: ${({ btn_color = 'primary' }) => buttonStyles[btn_color].color};
    &:hover {
        background: ${({ btn_color = 'primary' }) => buttonStyles[btn_color].hoverBgColor};
    }
`;

export const SecondaryButton = styled(BaseButton)`
    background: #e8f4ff;
    color: #1890ff;
    &:hover {
        background: #d8e4ef;
    }
`;

export const PinkButton = styled(BaseButton)`
    background: #fdeeee;
    color: #eb5757;
    &:hover {
        background: #fddede;
    }
`;
