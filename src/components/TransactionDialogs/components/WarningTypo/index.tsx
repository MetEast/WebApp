import React, { ReactNode } from 'react';
import { Typography } from '@mui/material';
import { Icon } from '@iconify/react';

interface ComponentProps {
    width?: number;
    children: ReactNode;
}

const WarningTypo: React.FC<ComponentProps> = ({ width, children }) => {
    return (
        <Typography fontSize={12} fontWeight={400} width={width} textAlign="center">
            <Icon icon="ph:warning-fill" fontSize={14} color="#FFCD00" style={{ marginBottom: -2 }} />
            {children}
        </Typography>
    );
};

export default WarningTypo;
