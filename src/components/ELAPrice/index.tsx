import React from 'react';
import { Stack, Typography } from '@mui/material';
import { SpacingProps } from '@mui/system';
import { Block } from '@mui/icons-material';

export interface ComponentProps extends SpacingProps {
    price_ela: number;
    price_usd?: number;
    detail_page?: boolean;
    alignRight?: boolean; 
}

const ELAPrice: React.FC<ComponentProps> = ({ price_ela, price_usd, detail_page, alignRight = false, ...otherProps }): JSX.Element => {
    return (
        <Stack direction="row" alignItems="center" justifyContent={(alignRight) ? "end" : "start"} spacing={1} {...otherProps}>
            <img src="/assets/icons/elatos-ela.svg" alt="" />
            <Typography fontSize={{md:20, sm:14}} fontWeight={500}>
                {`${price_ela.toFixed(2)} ELA`}
            </Typography>
            {price_usd !== undefined && ( 
                <Typography fontSize={12} fontWeight={400} display={(detail_page) ? 'block' : {xs: 'none', sm: 'none', md: 'block'}}>
                    {`~$${price_usd.toFixed(2)}`}
                </Typography>
            )}
        </Stack>
    );
};

export default ELAPrice;
