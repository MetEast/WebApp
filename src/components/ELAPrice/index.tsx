import React from 'react';
import { Stack, Typography } from '@mui/material';
import { SpacingProps } from '@mui/system';

export interface ComponentProps extends SpacingProps {
    ela_price: number;
    usd_price: number;
}

const ELAPrice: React.FC<ComponentProps> = ({ ela_price, usd_price, ...otherProps }): JSX.Element => {
    return (
        <Stack direction="row" alignItems="center" spacing={1} {...otherProps}>
            <img src="/assets/icons/elatos-ela.svg" alt="" />
            <Typography fontSize={20} fontWeight={500}>
                {`${ela_price.toFixed(2)} ELA`}
            </Typography>
            <Typography fontSize={12} fontWeight={400}>
                {`~$${usd_price.toFixed(2)}`}
            </Typography>
        </Stack>
    );
};

export default ELAPrice;
