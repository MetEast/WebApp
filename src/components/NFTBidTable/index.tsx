import React from 'react';
import { Box, Stack, Grid, Typography } from '@mui/material';
import { ViewAllBtn } from './styles';
import { TypeSingleNFTBid } from 'src/types/product-types';
import ELAPrice from 'src/components/ELAPrice';
// import { useTheme } from '@mui/material/styles';
// import useMediaQuery from '@mui/material/useMediaQuery';
import { useDialogContext } from 'src/context/DialogContext';
import Username from 'src/components/Username';

interface ComponentProps {
    bidsList: Array<TypeSingleNFTBid>;
}

const NFTBidTable: React.FC<ComponentProps> = ({ bidsList }): JSX.Element => {
    const bidsTblColumns = [
        { value: 'User', width: 4 },
        { value: 'Date', width: 4 },
        { value: 'Price', width: 4 },
        // { value: '', width: 1.5 },
    ];
    // const theme = useTheme();
    // const matchDownSm = useMediaQuery(theme.breakpoints.down('sm'));
    const [dialogState, setDialogState] = useDialogContext();

    return (
        <Box>
            <Stack direction="row" alignItems="center" spacing={2} marginTop={5}>
                <Typography fontSize={22} fontWeight={700}>
                    Latest Bids
                </Typography>
                <ViewAllBtn
                    onClick={() => {
                        if (bidsList.length === 0) setDialogState({ ...dialogState, noBidDlgOpened: true });
                        else setDialogState({ ...dialogState, allBidDlgOpened: true });
                    }}
                >
                    View ALL
                </ViewAllBtn>
            </Stack>
            <Grid container alignItems="center" rowSpacing={2} marginTop={0}>
                {bidsTblColumns.map((item, index) => (
                    <Grid
                        key={index}
                        item
                        xs={item.width}
                        fontSize={14}
                        fontWeight={700}
                        display={{ xs: 'none', sm: 'block' }}
                        sx={{ textTransform: 'uppercase' }}
                    >
                        {item.value}
                    </Grid>
                ))}
                {bidsList.map((item, index) => (
                    <Grid container item key={index} alignItems="center">
                        <Grid item xs={12} sm={bidsTblColumns[0].width} order={{ xs: 3, sm: 1, md: 1, lg: 1 }}>
                            <Username username={item.user} fontSize={16} fontWeight={700} />
                        </Grid>
                        <Grid item xs={6} sm={bidsTblColumns[1].width} order={{ xs: 1, sm: 2, md: 2, lg: 2 }}>
                            <Typography fontSize={12} fontWeight={500}>
                                {item.time}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={bidsTblColumns[2].width} order={{ xs: 2, sm: 3, md: 3, lg: 3 }}>
                            <ELAPrice price_ela={item.price} price_ela_fontsize={14} />
                        </Grid>
                        {/* <Grid
                            item
                            xs={6}
                            sm={bidsTblColumns[3].width}
                            order={4}
                            display="flex"
                            direction="row"
                            justifyContent="flex-end"
                        >
                            <SecondaryButton sx={{ height: 32, borderRadius: 2.5, fontSize: 14 }}>
                                ACCEPT
                            </SecondaryButton>
                        </Grid> */}
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default NFTBidTable;
