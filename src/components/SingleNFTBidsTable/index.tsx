import React from 'react';
import { Box, Stack, Grid, Typography } from '@mui/material';
import { ViewAllBtn } from './styles';
import { TypeSingleNFTBid } from 'src/types/product-types';
import ELAPrice from 'src/components/ELAPrice';

interface ComponentProps {
    bidsList: Array<TypeSingleNFTBid>;
}

const SingleNFTBidsTable: React.FC<ComponentProps> = ({ bidsList }): JSX.Element => {
    const bidsTblColumns = [
        { value: 'User', width: 3 },
        { value: 'Date', width: 7 },
        { value: 'Price', width: 2 },
    ];

    return (
        <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography fontSize={18} fontWeight={700}>
                    Latest Bids
                </Typography>
                <ViewAllBtn>View ALL</ViewAllBtn>
            </Stack>
            <Grid container alignItems="center" rowSpacing={2} marginTop={0}>
                {bidsTblColumns.map((item) => (
                    <Grid item xs={item.width} fontSize={14} fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                        {item.value}
                    </Grid>
                ))}
                {bidsList.map((item) => (
                    <>
                        <Grid item xs={bidsTblColumns[0].width}>
                            <Typography fontSize={16} fontWeight={700}>
                                {item.user}
                            </Typography>
                        </Grid>
                        <Grid item xs={bidsTblColumns[1].width}>
                            <Typography fontSize={12} fontWeight={500}>
                                {item.time}
                            </Typography>
                        </Grid>
                        <Grid item xs={bidsTblColumns[2].width}>
                            <ELAPrice ela_price={item.price} />
                        </Grid>
                    </>
                ))}
            </Grid>
        </Box>
    );
};

export default SingleNFTBidsTable;
