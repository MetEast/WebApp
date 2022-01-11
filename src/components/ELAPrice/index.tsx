import React from 'react';
import { Stack, Typography } from '@mui/material';
import { SpacingProps } from '@mui/system';
import { Block } from '@mui/icons-material';

export interface ComponentProps extends SpacingProps {
    ela_price: number;
    usd_price?: number;
    detail_page?: boolean;
}

const ELAPrice: React.FC<ComponentProps> = ({ ela_price, usd_price, detail_page, ...otherProps }): JSX.Element => {
    return (
        <Stack direction="row" alignItems="center" spacing={1} {...otherProps}>
            <img src="/assets/icons/elatos-ela.svg" alt="" />
            <Typography fontSize={{md:20, sm:14}} fontWeight={500}>
                {`${ela_price.toFixed(2)} ELA`}
            </Typography>
            {usd_price && (
                <Typography fontSize={12} fontWeight={400} display={(detail_page) ? 'block' : {xs: 'none', sm: 'none', md: 'block'}}>
                    {`~$${usd_price.toFixed(2)}`}
                </Typography>
            )}
        </Stack>
    );
};

export default ELAPrice;
