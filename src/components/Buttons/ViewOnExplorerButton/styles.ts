import { styled } from '@mui/material';
import { SecondaryButton } from 'src/components/Buttons/styles';
import { Link } from '@mui/material';

export const Button = styled(SecondaryButton)`
    height: 32px;
    font-size: 14px;
    border-radius: 10px;
    padding: 0 12px;
`;

export const LinkButton = styled(Link)`
    height: 32px;
    font-size: 14px;
    border-radius: 10px;
    padding: 0 12px;
`;
