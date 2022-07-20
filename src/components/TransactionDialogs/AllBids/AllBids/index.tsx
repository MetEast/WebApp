import React, { useState, useEffect } from 'react';
import { Stack, Grid, Typography, Skeleton } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { SecondaryButton } from 'src/components/Buttons/styles';
import ELAPrice from 'src/components/ELAPrice';
// import { TypeSelectItem } from 'src/types/select-types';
// import Select from 'src/components/Select';
// import { SelectTitleBtn } from './styles';
// import { Icon } from '@iconify/react';
import { useSignInContext } from 'src/context/SignInContext';
import { TypeSingleNFTBid } from 'src/types/product-types';
// import { viewAllDlgSortOptions } from 'src/constants/select-constants';
import { getNFTLatestBids } from 'src/services/fetch';
import { useParams } from 'react-router-dom';
import Username from 'src/components/Username';
import { blankNFTBid } from 'src/constants/init-constants';

export interface ComponentProps {
    onClose: () => void;
}

const AllBids: React.FC<ComponentProps> = ({ onClose }): JSX.Element => {
    const params = useParams();
    const [signInDlgState] = useSignInContext();
    const [loadingData, setLoadingData] = useState(true);
    const [bidsList, setBidsList] = useState<Array<TypeSingleNFTBid>>([]);
    const [myBidsList, setMyBidsList] = useState<Array<TypeSingleNFTBid>>([]);
    // const [sortby, setSortby] = useState<TypeSelectItem>();
    // const [sortBySelectOpen, isSortBySelectOpen] = useState(false);
    // const handleSortbyChange = (value: string) => {
    //     const item = viewAllDlgSortOptions.find((option) => option.value === value);
    //     setSortby(item);
    // };

    useEffect(() => {
        let unmounted = false;
        const fetchNFTLatestBids = async () => {
            const _NFTBids = await getNFTLatestBids(
                params.id,
                signInDlgState.address,
                1,
                1000,
                // sortby?.value,
            );
            if (!unmounted) {
                setBidsList(_NFTBids.all);
                setMyBidsList(_NFTBids.mine);
                setLoadingData(false);
            }
        };
        if ((signInDlgState.isLoggedIn && signInDlgState.address) || !signInDlgState.isLoggedIn)
            fetchNFTLatestBids().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, [signInDlgState.isLoggedIn, signInDlgState.address, params.id]);

    return (
        <Stack spacing={5} width={520}>
            <Stack direction="row" justifyContent="space-between">
                <DialogTitleTypo>All Bids</DialogTitleTypo>
                {/* <Select
                    titlebox={
                        <SelectTitleBtn fullWidth isopen={sortBySelectOpen ? 1 : 0}>
                            <Icon icon="ph:sort-ascending" fontSize={20} />
                            {sortby ? sortby.label : 'Sort by'}
                            <Icon icon="ph:caret-down" className="arrow-icon" style={{ marginBottom: 2 }} />
                        </SelectTitleBtn>
                    }
                    selectedItem={sortby}
                    options={viewAllDlgSortOptions}
                    isOpen={sortBySelectOpen ? 1 : 0}
                    setIsOpen={isSortBySelectOpen}
                    handleClick={handleSortbyChange}
                    width={160}
                /> */}
            </Stack>
            <Stack spacing={3}>
                {!loadingData && signInDlgState.isLoggedIn && myBidsList.length !== 0 && (
                    <>
                        <Grid item xs={12}>
                            <Typography fontSize={14} fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                                Your Bid
                            </Typography>
                        </Grid>
                        <Grid container alignItems="center" rowSpacing={0} marginTop={0}>
                            {myBidsList.map((item, index) => (
                                <Grid container item key={index}>
                                    <Grid item xs={6}>
                                        <Typography fontSize={12} fontWeight={500}>
                                            {item.time}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <ELAPrice price_ela={item.price} price_ela_fontsize={14} alignRight />
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>
                    </>
                )}

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
                        <Typography fontSize={14} fontWeight={700} sx={{ textTransform: 'uppercase' }} align="right">
                            Price
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container marginTop={2.5} rowGap={3} alignItems="center">
                    {(loadingData ? [...Array(4).fill(blankNFTBid)] : bidsList).map((item, index) => (
                        <Grid container item key={`all-bids-row-${index}`} columnSpacing={1} rowGap={1}>
                            <Grid item xs={4}>
                                {loadingData ? (
                                    <Skeleton
                                        variant="rectangular"
                                        animation="wave"
                                        width="100%"
                                        height={24}
                                        sx={{ bgcolor: '#E8F4FF', borderRadius: 2 }}
                                    />
                                ) : (
                                    <Username username={item.user} fontSize={16} fontWeight={700} />
                                )}
                            </Grid>
                            <Grid item xs={4}>
                                {loadingData ? (
                                    <Skeleton
                                        variant="rectangular"
                                        animation="wave"
                                        width="100%"
                                        height={24}
                                        sx={{ bgcolor: '#E8F4FF', borderRadius: 2 }}
                                    />
                                ) : (
                                    <Typography fontSize={12} fontWeight={500}>
                                        {item.time}
                                    </Typography>
                                )}
                            </Grid>
                            <Grid item xs={4}>
                                {loadingData ? (
                                    <Skeleton
                                        variant="rectangular"
                                        animation="wave"
                                        width="100%"
                                        height={24}
                                        sx={{ bgcolor: '#E8F4FF', borderRadius: 2 }}
                                    />
                                ) : (
                                    <ELAPrice price_ela={item.price} price_ela_fontsize={14} alignRight={true} />
                                )}
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
            </Stack>
            <SecondaryButton fullWidth onClick={onClose}>
                Close
            </SecondaryButton>
        </Stack>
    );
};

export default AllBids;
