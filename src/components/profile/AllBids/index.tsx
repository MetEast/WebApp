import React, { useState } from 'react';
import { Stack, Grid, Box, Typography } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { TypeSelectItem } from 'src/types/select-types';
import { SecondaryButton } from 'src/components/Buttons/styles';
import ELAPrice from 'src/components/ELAPrice';
import Select from 'src/components/Select';
import { SelectTitleBtn } from './styles';
import { Icon } from '@iconify/react';
import { useParams } from 'react-router-dom';
import { useSignInContext } from 'src/context/SignInContext';
import { TypeSingleNFTBid } from 'src/types/product-types';
import { useDialogContext } from 'src/context/DialogContext';

export interface ComponentProps {
    bidsList: Array<TypeSingleNFTBid>;
    myBidsList: Array<TypeSingleNFTBid>;
    changeHandler: (value: TypeSelectItem | undefined) => void;
}

const AllBids: React.FC<ComponentProps> = ({bidsList, myBidsList, changeHandler}): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const sortbyOptions: Array<TypeSelectItem> = [
        {
            label: 'Option1',
            value: 'Option1',
        },
        {
            label: 'Option2',
            value: 'Option2',
        },
        {
            label: 'Option3',
            value: 'Option3',
        },
    ];

    const [sortby, setSortby] = useState<TypeSelectItem>();
    const [sortBySelectOpen, isSortBySelectOpen] = useState(false);
    const handleSortbyChange = (value: string) => {
        const item = sortbyOptions.find((option) => option.value === value);
        setSortby(item);
        changeHandler(item);
    };

    // const getLatestBid = async () => {
    //     const defaultBidValue: TypeSingleNFTBid = { user: '', price: 0, time: '', orderId: '' };
    //     const resLatestBid = await fetch(
    //         `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getLatestBids?tokenId=${params.id}&address=${signInDlgState.walletAccounts[0]}&pageNum=1&pageSize=5`,
    //         {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Accept: 'application/json',
    //             },
    //         },
    //     );
    //     const dataLatestBid = await resLatestBid.json();
    //     const arrLatestBid = dataLatestBid.data;

    //     let _latestBidsList: any = [];
    //     for (let i = 0; i < arrLatestBid.others.length; i++) {
    //         let itemObject: TypeSingleNFTBidFetch = arrLatestBid.others[i];
    //         let _bid: TypeSingleNFTBid = { ...defaultBidValue };
    //         _bid.user = reduceHexAddress(itemObject.buyerAddr, 4); // no proper data username
    //         _bid.price = parseFloat(itemObject.price) / 1e18;
    //         _bid.orderId = itemObject.orderId;
    //         let timestamp = getTime(itemObject.timestamp);
    //         _bid.time = timestamp.date + ' ' + timestamp.time;
    //         _latestBidsList.push(_bid);
    //     }
    //     setBidsList(_latestBidsList);

    //     let _myLatestBidsList: any = [];
    //     for (let i = 0; i < arrLatestBid.yours.length; i++) {
    //         let itemObject: TypeSingleNFTBidFetch = arrLatestBid.yours[i];
    //         let _bid: TypeSingleNFTBid = { ...defaultBidValue };
    //         _bid.user = reduceHexAddress(itemObject.buyerAddr, 4); // no proper data username
    //         _bid.price = parseFloat(itemObject.price) / 1e18;
    //         _bid.orderId = itemObject.orderId;
    //         let timestamp = getTime(itemObject.timestamp);
    //         _bid.time = timestamp.date + ' ' + timestamp.time;
    //         _myLatestBidsList.push(_bid);
    //     }
    //     setMyBidsList(_myLatestBidsList);
    // };

    // useEffect(() => {
    //     getLatestBid();
    // }, [sortby]);

    return (
        <Stack spacing={5} width={520}>
            <Stack direction="row" justifyContent="space-between">
                <DialogTitleTypo>All Bids</DialogTitleTypo>
                <Select
                    titlebox={
                        <SelectTitleBtn fullWidth isopen={sortBySelectOpen ? 1 : 0}>
                            <Icon icon="ph:sort-ascending" fontSize={20} />
                            {sortby ? sortby.label : 'Sort by'}
                            <Icon icon="ph:caret-down" className="arrow-icon" style={{ marginBottom: 2 }} />
                        </SelectTitleBtn>
                    }
                    options={sortbyOptions}
                    isOpen={sortBySelectOpen ? 1 : 0}
                    setIsOpen={isSortBySelectOpen}
                    handleClick={handleSortbyChange}
                    width={160}
                />
            </Stack>
            <Stack spacing={3}>
                {signInDlgState.isLoggedIn && myBidsList.length !== 0 && (
                    <Grid container direction="column" alignItems="center">
                        <Grid item alignItems="center">
                            <Typography fontSize={16} fontWeight={700} marginTop={3}>
                                Your Bid
                            </Typography>
                        </Grid>
                        {myBidsList.forEach((item) => {
                            return (
                                <Grid item direction="row" alignItems="center" justifyContent="space-between">
                                    <Typography fontSize={14} fontWeight={400}>
                                        {item.time}
                                    </Typography>
                                    <ELAPrice price_ela={item.price} alignRight={true} />
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
                {bidsList.length !== 0 && (
                    <Box>
                        <Grid container>
                            <Grid item xs={4}>
                                <Typography fontSize={14} fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                                    User
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography fontSize={14} fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                                    Date
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography fontSize={14} fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                                    Price
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container marginTop={2.5} rowGap={3} alignItems="center">
                            {bidsList.map((item, index) => (
                                <>
                                    <Grid item xs={4}>
                                        <Typography fontSize={16} fontWeight={700}>
                                            {item.user}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography fontSize={12} fontWeight={500}>
                                            {item.time}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <ELAPrice price_ela={item.price} price_ela_fontsize={14} />
                                    </Grid>
                                </>
                            ))}
                        </Grid>
                    </Box>
                )}
            </Stack>
            <SecondaryButton
                fullWidth
                onClick={() => {
                    setDialogState({ ...dialogState, allBidDlgOpened: false });
                }}
            >
                Close
            </SecondaryButton>
        </Stack>
    );
};

export default AllBids;
