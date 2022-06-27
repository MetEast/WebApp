import React from 'react';
import { Stack, Typography } from '@mui/material';
import { SpacingProps } from '@mui/system';

export interface ComponentProps extends SpacingProps {
    price_ela: number;
    price_ela_fontsize?: number;
    price_usd?: number;
    detail_page?: boolean;
    alignRight?: boolean;
}

const ELAPrice: React.FC<ComponentProps> = ({
    price_ela,
    price_ela_fontsize,
    price_usd,
    detail_page,
    alignRight = false,
    ...otherProps
}): JSX.Element => {
    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent={alignRight ? 'end' : 'start'}
            spacing={1}
            {...otherProps}
        >
            {price_ela > 0 && (
                <>
                    <img src="/assets/icons/elatos-ela.svg" alt="" />
                    <Typography
                        fontSize={price_ela_fontsize ? price_ela_fontsize : { md: 20, sm: 14 }}
                        fontWeight={500}
                    >
                        {/* {price_ela ? `${price_ela.toFixed(2)}ELA` : ''} */}
                        {`${price_ela ? price_ela.toFixed(2) : 0} ELA`}
                    </Typography>
                    {price_usd !== undefined && (
                        <Typography
                            fontSize={12}
                            fontWeight={400}
                            display={detail_page ? 'block' : { xs: 'none', sm: 'none', md: 'block' }}
                        >
                            {/* {price_usd ? `${price_usd.toFixed(2)}ELA` : ''} */}
                            {`~ $${price_usd ? price_usd.toFixed(2) : 0}`}
                        </Typography>
                    )}
                </>
            )}
        </Stack>
    );
};

export default ELAPrice;
