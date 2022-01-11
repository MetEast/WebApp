import React from 'react';
import { Box, Stack, Grid, Typography } from '@mui/material';
import { ViewAllBtn } from './styles';
import { TypeSingleNFTBid } from 'src/types/product-types';
import ELAPrice from 'src/components/ELAPrice';
import { PrimaryButton } from 'src/components/Buttons/styles';

interface ComponentProps {
    bidsList: Array<TypeSingleNFTBid>;
}

const SingleNFTBidsTable: React.FC<ComponentProps> = ({ bidsList }): JSX.Element => {
    const bidsTblColumns = [
        { value: 'User', width: 4 },
        { value: 'Date', width: 4 },
        { value: 'Price', width: 4 },
    ];

    return (
        <Box>
            <Stack direction="column" alignItems="left" justifyContent="space-between" marginTop={1}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" marginTop={5}>
                    <Typography fontSize={22} fontWeight={700}>
                        Latest Bids
                    </Typography>
                    <ViewAllBtn>View ALL</ViewAllBtn>
                </Stack>
                <Typography fontSize={16} fontWeight={700} marginTop={3}>
                    Your Bids
                </Typography>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography fontSize={14} fontWeight={400}>
                        2022/02/28  10:00
                    </Typography>
                    <ELAPrice ela_price={199} alignRight={true} />
                </Stack>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <PrimaryButton sx={{ marginTop: 3, width: "100%", textTransform: "uppercase", backgroundColor: "#FDEEEE", color: "#EB5757" }}>Cancel Bid</PrimaryButton>
                    </Grid>
                    <Grid item xs={6}>
                        <PrimaryButton sx={{ marginTop: 3, width: "100%", textTransform: "uppercase" }}>Update Bid</PrimaryButton>
                    </Grid>
                </Grid>         
            </Stack>
            <Grid container>
                <Grid item></Grid>
            </Grid>
            <Grid container alignItems="center" rowSpacing={2} marginTop={0}>
                {bidsTblColumns.map((item) => (
                    <Grid item xs={item.width} fontSize={14} fontWeight={700} sx={{ textTransform: 'uppercase' }} textAlign={(item.value === "Price") ? "right":"left"}>
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
                            <ELAPrice ela_price={item.price} alignRight/>
                        </Grid>
                    </>
                ))}
            </Grid>
        </Box>
    );
};

export default SingleNFTBidsTable;
