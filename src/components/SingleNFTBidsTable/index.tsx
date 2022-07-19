import React from 'react';
import { Box, Stack, Grid, Typography } from '@mui/material';
import { ViewAllBtn } from './styles';
import { TypeSingleNFTBid } from 'src/types/product-types';
import ELAPrice from 'src/components/ELAPrice';
import { useDialogContext } from 'src/context/DialogContext';
import Username from 'src/components/Username';
// import CancelBidDlgContainer from '../TransactionDialogs/CancelBid';
// import UpdateBidDlgContainer from '../TransactionDialogs/UpdateBid';

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
        <>
            <Box
                display={
                    onlyShowDownSm ? { xs: 'block', sm: 'block', md: 'none' } : { xs: 'none', sm: 'none', md: 'block' }
                }
            >
                <Stack direction="column" alignItems="left" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography fontSize={22} fontWeight={700}>
                            Latest Bids
                        </Typography>
                        <ViewAllBtn
                            onClick={() => {
                                if (bidsList.length === 0 && myBidsList.length === 0)
                                    setDialogState({ ...dialogState, noBidDlgOpened: true });
                                else setDialogState({ ...dialogState, allBidDlgOpened: true });
                            }}
                        >
                            View ALL
                        </ViewAllBtn>
                    </Stack>
                    {isLoggedIn && myBidsList.length !== 0 && (
                        <>
                            <Typography fontSize={16} fontWeight={700} marginTop={3}>
                                Your Bid
                            </Typography>
                            {myBidsList.map((item, index) => (
                                <Stack
                                    direction="row"
                                    key={`mybid-${index}`}
                                    justifyContent="space-between"
                                    width="100%"
                                    mt={2}
                                >
                                    <Typography fontSize={12} fontWeight={500}>
                                        {item.time}
                                    </Typography>
                                    <ELAPrice price_ela={item.price} price_ela_fontsize={14} alignRight />
                                </Stack>
                            ))}
                        </>
                    )}
                    {bidsList.length !== 0 && (
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
                                    <Grid
                                        item
                                        xs={12}
                                        sm={bidsTblColumns[0].width}
                                        order={{ xs: 3, sm: 1, md: 1, lg: 1 }}
                                    >
                                        <Username username={item.user} fontSize={16} fontWeight={700} />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={6}
                                        sm={bidsTblColumns[1].width}
                                        order={{ xs: 1, sm: 2, md: 2, lg: 2 }}
                                    >
                                        <Typography fontSize={12} fontWeight={500}>
                                            {item.time}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={6}
                                        sm={bidsTblColumns[2].width}
                                        order={{ xs: 2, sm: 3, md: 3, lg: 3 }}
                                    >
                                        <ELAPrice price_ela={item.price} price_ela_fontsize={14} alignRight />
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Stack>
            </Box>
            {/* <UpdateBidDlgContainer />
            <CancelBidDlgContainer /> */}
        </>
    );
};

export default SingleNFTBidsTable;
