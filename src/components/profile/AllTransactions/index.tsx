import React, { useEffect, useState } from 'react';
import { Stack, Grid, Box, Typography } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import ELAPrice from 'src/components/ELAPrice';
import Select from 'src/components/Select';
import { TypeSelectItem } from 'src/types/select-types';
import { SelectTitleBtn } from './styles';
import { Icon } from '@iconify/react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import authAtom from 'src/recoil/auth';
import {
    enumTransactionType,
    TypeNFTTransactionFetch,
    TypeNFTTransaction,
    TypeSingleNFTBid,
    TypeSingleNFTBidFetch,
} from 'src/types/product-types';
import { getTime, reduceHexAddress } from 'src/services/common';
import { useDialogContext } from 'src/context/DialogContext';
import { singleNFTBids } from 'src/constants/dummyData';

export interface ComponentProps {}

const AllTransactions: React.FC<ComponentProps> = (): JSX.Element => {
    const params = useParams(); // params.tokenId
    const auth = useRecoilValue(authAtom);
    const [dialogState, setDialogState] = useDialogContext();
    const defaultTransactionValue: TypeNFTTransaction = {
        type: enumTransactionType.Bid,
        user: '',
        price: 0,
        time: '',
        txHash: '',
    };
    const burnAddress = '0x0000000000000000000000000000000000000000';
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

    const [transactionsList, setTransactionsList] = useState<Array<TypeNFTTransaction>>([]);

    const [bidsList, setBidsList] = useState<Array<TypeSingleNFTBid>>([]);
    // const [bidsList, setBidsList] = useState<Array<TypeSingleNFTBid>>(singleNFTBids); // for test

    const [myBidsList, setMyBidsList] = useState<Array<TypeSingleNFTBid>>([]);
    // const [myBidsList, setMyBidsList] = useState<Array<TypeSingleNFTBid>>(singleNFTBids); // for test

    const [sortby, setSortby] = React.useState<TypeSelectItem>();
    const [sortBySelectOpen, isSortBySelectOpen] = useState(false);
    const handleSortbyChange = (value: string) => {
        const item = sortbyOptions.find((option) => option.value === value);
        setSortby(item);
    };

    const getLatestTransaction = async () => {
        const resLatestTransaction = await fetch(
            `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getTranDetailsByTokenId?tokenId=${params.id}&timeOrder=-1&pageNum=1&$pageSize=5`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            },
        );
        const dataLatestTransaction = await resLatestTransaction.json();
        const arrLatestTransaction = dataLatestTransaction.data;

        let _latestTransList: any = [];
        for (let i = 0; i < arrLatestTransaction.length; i++) {
            let itemObject: TypeNFTTransactionFetch = arrLatestTransaction[i];
            var _transaction: TypeNFTTransaction = { ...defaultTransactionValue };
            switch (itemObject.event) {
                case 'Mint':
                    _transaction.type = enumTransactionType.CreatedBy;
                    break;
                case 'OrderForAuction':
                    _transaction.type = enumTransactionType.OnAuction;
                    break;
                case 'Bid':
                    _transaction.type = enumTransactionType.Bid;
                    break;
                case 'OrderFilled':
                    _transaction.type = enumTransactionType.SoldTo;
                    break;
                case 'OrderForSale':
                    _transaction.type = enumTransactionType.ForSale;
                    break;
            }
            _transaction.user = reduceHexAddress(itemObject.from === burnAddress ? itemObject.to : itemObject.from, 4); // no proper data
            _transaction.price = itemObject.gasFee; // no proper data
            _transaction.txHash = itemObject.tHash;
            let timestamp = getTime(itemObject.timestamp.toString());
            _transaction.time = timestamp.date + ' ' + timestamp.time;
            _latestTransList.push(_transaction);
        }
        setTransactionsList(_latestTransList);
    };

    const getLatestBid = async () => {
        const defaultBidValue: TypeSingleNFTBid = { user: '', price: 0, time: '' };
        const resLatestBid = await fetch(
            `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getLatestBids?tokenId=${params.id}&pageNum=1&pageSize=5`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            },
        );
        const dataLatestBid = await resLatestBid.json();
        const arrLatestBid = dataLatestBid.data;

        let _latestBidsList: any = [];
        for (let i = 0; i < arrLatestBid.others.length; i++) {
            let itemObject: TypeSingleNFTBidFetch = arrLatestBid.others[i];
            let _bid: TypeSingleNFTBid = { ...defaultBidValue };
            _bid.user = reduceHexAddress(itemObject.buyerAddr, 4); // no proper data username
            _bid.price = parseFloat(itemObject.price) / 1e18;
            let timestamp = getTime(itemObject.timestamp);
            _bid.time = timestamp.date + ' ' + timestamp.time;
            _latestBidsList.push(_bid);
        }
        setBidsList(_latestBidsList);

        let _myLatestBidsList: any = [];
        for (let i = 0; i < arrLatestBid.yours.length; i++) {
            let itemObject: TypeSingleNFTBidFetch = arrLatestBid.yours[i];
            let _bid: TypeSingleNFTBid = { ...defaultBidValue };
            _bid.user = reduceHexAddress(itemObject.buyerAddr, 4); // no proper data username
            _bid.price = parseFloat(itemObject.price) / 1e18;
            let timestamp = getTime(itemObject.timestamp);
            _bid.time = timestamp.date + ' ' + timestamp.time;
            _myLatestBidsList.push(_bid);
        }
        setMyBidsList(_myLatestBidsList);
    };

    useEffect(() => {
        getLatestTransaction();
        getLatestBid();
    }, [sortby]);

    const bidsTblColumns = [
        { value: 'User', width: 4 },
        { value: 'Date', width: 4 },
        { value: 'Price', width: 4 },
    ];
    return (
        <Stack spacing={5} width={520}>
            <Stack direction="row" justifyContent="space-between">
                <DialogTitleTypo>All Transactions</DialogTitleTypo>
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
                {auth.isLoggedIn ? (
                    <>
                        <Typography fontSize={16} fontWeight={700} textAlign="center" marginTop={3}>
                            Your Bids
                        </Typography>
                        <Grid container alignItems="center">
                            {myBidsList.length === 0 ? (
                                <Grid item alignItems="center">
                                    <Typography fontSize={14} fontWeight={400}>
                                        No bids
                                    </Typography>
                                </Grid>
                            ) : (
                                myBidsList.map((item) => {
                                    return (
                                        <>
                                            <Grid item xs={6}>
                                                <Typography fontSize={14} fontWeight={400}>
                                                    {item.time}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <ELAPrice
                                                    price_ela={item.price}
                                                    price_ela_fontsize={14}
                                                    alignRight={true}
                                                />
                                            </Grid>
                                        </>
                                    );
                                })
                            )}
                        </Grid>
                        {myBidsList.length !== 0 && (
                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <PrimaryButton
                                        fullWidth
                                        size="small"
                                        sx={{
                                            background: '#FDEEEE',
                                            color: '#EB5757',
                                            '&:hover': { background: '#FFDEDE' },
                                        }}
                                    >
                                        Cancel Bid
                                    </PrimaryButton>
                                </Grid>
                                <Grid item xs={6}>
                                    <PrimaryButton fullWidth size="small">
                                        Update Bid
                                    </PrimaryButton>
                                </Grid>
                            </Grid>
                        )}
                    </>
                ) : (
                    <>
                        <Stack direction="column" alignItems="center">
                            <Grid item xs={12} sx={{ width: "-webkit-fill-available" }} >
                                <Typography fontSize={16} fontWeight={700} marginTop={3}>
                                    All Bids
                                </Typography>
                            </Grid>
                            <Grid item container alignItems="center" xs={12} rowSpacing={2} marginTop={0}>
                                {bidsTblColumns.map((item, index) => (
                                    <Grid
                                        item
                                        key={`bid-row-${index}`}
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
                                {bidsList.length === 0 ? (
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        marginTop={3}
                                    >
                                        <Typography fontSize={14} fontWeight={400}>
                                            No bids
                                        </Typography>
                                    </Stack>
                                ) : (
                                    bidsList.map((item, index) => (
                                        <Grid container item key={`bid-row-${index}`}>
                                            <Grid
                                                item
                                                xs={12}
                                                sm={bidsTblColumns[0].width}
                                                order={{ xs: 3, sm: 1, md: 1, lg: 1 }}
                                            >
                                                <Typography fontSize={16} fontWeight={700}>
                                                    {item.user}
                                                </Typography>
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
                                    ))
                                )}
                            </Grid>
                        </Stack>
                    </>
                )}

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
                            <Typography
                                fontSize={14}
                                fontWeight={700}
                                sx={{ textTransform: 'uppercase' }}
                                textAlign={'right'}
                            >
                                Price
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container marginTop={2.5} rowGap={3} alignItems="center">
                        {transactionsList.map((item, index) => (
                            <Grid item container key={`transaction-row-${index}`}>
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
                                    <ELAPrice price_ela={item.price} alignRight={true} />
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Stack>
            <SecondaryButton
                fullWidth
                onClick={() => {
                    setDialogState({ ...dialogState, allTxDlgOpened: false });
                }}
            >
                Close
            </SecondaryButton>
        </Stack>
    );
};

export default AllTransactions;
