import React from 'react';
import { Box, Stack, Grid, Typography } from '@mui/material';
import { ViewAllBtn } from './styles';
import { TypeSingleNFTBid } from 'src/types/product-types';
import ELAPrice from 'src/components/ELAPrice';
import { PrimaryButton } from 'src/components/Buttons/styles';
import { useDialogContext } from 'src/context/DialogContext';

interface ComponentProps {
    isLoggedIn: boolean;
    myBidsList: Array<TypeSingleNFTBid>;
    bidsList: Array<TypeSingleNFTBid>;
    onlyShowDownSm?: boolean;
}

const SingleNFTBidsTable: React.FC<ComponentProps> = ({
    isLoggedIn = false,
    myBidsList,
    bidsList,
    onlyShowDownSm = false,
}): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();

    const bidsTblColumns = [
        { value: 'User', width: 4 },
        { value: 'Date', width: 4 },
        { value: 'Price', width: 4 },
    ];
    return (
        <Box
            display={
                onlyShowDownSm ? { xs: 'block', sm: 'block', md: 'none' } : { xs: 'none', sm: 'none', md: 'block' }
            }
        >
            <Stack direction="column" alignItems="left" justifyContent="space-between" marginTop={1}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" marginTop={5}>
                    <Typography fontSize={22} fontWeight={700}>
                        Latest Bids
                    </Typography>
                    <ViewAllBtn
                        onClick={() => {
                            setDialogState({ ...dialogState, allBidDlgOpened: true });
                        }}
                    >
                        View ALL
                    </ViewAllBtn>
                </Stack>
                {isLoggedIn && (
                    <>
                        <Typography fontSize={16} fontWeight={700} marginTop={3}>
                            Your Bids
                        </Typography>
                        {myBidsList.forEach((item) => {
                            return (
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Typography fontSize={14} fontWeight={400}>
                                        {item.time}
                                    </Typography>
                                    <ELAPrice price_ela={item.price} alignRight={true} />
                                </Stack>
                            );
                        })}
                        {myBidsList.length !== 0 && (
                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <PrimaryButton
                                        sx={{
                                            marginTop: 3,
                                            width: '100%',
                                            textTransform: 'uppercase',
                                            backgroundColor: '#FDEEEE',
                                            color: '#EB5757',
                                        }}
                                    >
                                        Cancel Bid
                                    </PrimaryButton>
                                </Grid>
                                <Grid item xs={6}>
                                    <PrimaryButton sx={{ marginTop: 3, width: '100%', textTransform: 'uppercase' }}>
                                        Update Bid
                                    </PrimaryButton>
                                </Grid>
                            </Grid>
                        )}
                    </>
                )}
                <Grid container alignItems="center" rowSpacing={2} marginTop={0}>
                    {bidsTblColumns.map((item, index) => (
                        <Grid
                            item
                            key={index}
                            xs={item.width}
                            fontSize={14}
                            fontWeight={700}
                            sx={{ textTransform: 'uppercase' }}
                            textAlign={item.value === 'Price' ? 'right' : 'left'}
                            display={{ xs: 'none', sm: 'block' }}
                        >
                            {item.value}
                        </Grid>
                    ))}
                    {bidsList.map((item, index) => (
                        <Grid container item key={index}>
                            <Grid item xs={12} sm={bidsTblColumns[0].width} order={{ xs: 3, sm: 1, md: 1, lg: 1 }}>
                                <Typography fontSize={16} fontWeight={700}>
                                    {item.user}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={bidsTblColumns[1].width} order={{ xs: 1, sm: 2, md: 2, lg: 2 }}>
                                <Typography fontSize={12} fontWeight={500}>
                                    {item.time}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={bidsTblColumns[2].width} order={{ xs: 2, sm: 3, md: 3, lg: 3 }}>
                                <ELAPrice price_ela={item.price} alignRight />
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
            </Stack>
        </Box>
    );
};

export default SingleNFTBidsTable;
