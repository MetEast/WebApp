import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Stack, Grid, Typography, Skeleton } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { SecondaryButton } from 'src/components/Buttons/styles';
import ELAPrice from 'src/components/ELAPrice';
// import Select from 'src/components/Select';
// import { TypeSelectItem } from 'src/types/select-types';
// import { SelectTitleBtn } from './styles';
// import { Icon } from '@iconify/react';
import { TypeNFTTransaction } from 'src/types/product-types';
// import { viewAllDlgSortOptions } from 'src/constants/select-constants';
import { getNFTLatestTxs } from 'src/services/fetch';
import SingleNFTTransactionType from 'src/components/SingleNFTTransactionType';
import Username from 'src/components/Username';
import { useDialogContext } from 'src/context/DialogContext';

export interface ComponentProps {
    onClose: () => void;
}

const AllTransactions: React.FC<ComponentProps> = ({ onClose }): JSX.Element => {
    const params = useParams();
    const [dialogState] = useDialogContext();
    const [loadingData, setLoadingData] = useState(true);
    const [allTxsList, setAllTxsList] = useState<Array<TypeNFTTransaction>>([]);
    // const [sortby, setSortby] = React.useState<TypeSelectItem>();
    // const [sortBySelectOpen, isSortBySelectOpen] = useState(false);
    // const handleSortbyChange = (value: string) => {
    //     const item = viewAllDlgSortOptions.find((option) => option.value === value);
    //     setSortby(item);
    // };

    useEffect(() => {
        let unmounted = false;
        const fetchLatestTxs = async () => {
            const _NFTTxs = await getNFTLatestTxs(params.id); // sort?.value
            if (dialogState.allTxNFTCreation.user) _NFTTxs.push(dialogState.allTxNFTCreation);
            if (!unmounted) {
                setAllTxsList(_NFTTxs);
                setLoadingData(false);
            }
        };
        fetchLatestTxs().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, [params.id, dialogState.allTxNFTCreation]); // sort

    return (
        <Stack
            spacing={5}
            width={{ xs: '100%', sm: 560 }}
            maxHeight={{ sm: '70vh' }}
            height={{ xs: '90vh', sm: 'auto' }}
        >
            <Stack direction="row" justifyContent="space-between">
                <DialogTitleTypo>All Transactions</DialogTitleTypo>
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
            <Stack spacing={3} height="100%" sx={{ overflowY: 'auto', overflowX: 'hidden' }}>
                <Grid container columnSpacing={1} display={{ xs: 'none', sm: 'flex' }}>
                    <Grid item xs={4}>
                        <Typography fontSize={14} fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                            Type
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography fontSize={14} fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                            User
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography fontSize={14} fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                            Date
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography fontSize={14} fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                            Price
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container marginTop={2.5} rowGap={3} alignItems="center">
                    {(loadingData ? [...Array(4)] : allTxsList).map((item, index) => (
                        <Grid
                            item
                            container
                            alignItems="center"
                            columnSpacing={1}
                            rowGap={1}
                            key={`all-transaction-row-${index}`}
                        >
                            <Grid item xs={6} sm={4} order={{ xs: 2, sm: 0 }}>
                                {loadingData ? (
                                    <Skeleton
                                        variant="rectangular"
                                        animation="wave"
                                        width="100%"
                                        height={24}
                                        sx={{ bgcolor: '#E8F4FF', borderRadius: 2 }}
                                    />
                                ) : (
                                    <SingleNFTTransactionType
                                        transactionType={item.type}
                                        transactionHash={item.txHash}
                                    />
                                )}
                            </Grid>
                            <Grid
                                item
                                xs={6}
                                sm={3}
                                order={{ xs: 3, sm: 1 }}
                                display="flex"
                                justifyContent={{ xs: 'flex-end', sm: 'flex-start' }}
                            >
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
                            <Grid item xs={6} sm={3} order={{ xs: 0, sm: 2 }}>
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
                            <Grid
                                item
                                xs={6}
                                sm={2}
                                order={{ xs: 1, sm: 3 }}
                                display="flex"
                                justifyContent={{ xs: 'flex-end', sm: 'flex-start' }}
                            >
                                {loadingData ? (
                                    <Skeleton
                                        variant="rectangular"
                                        animation="wave"
                                        width="100%"
                                        height={24}
                                        sx={{ bgcolor: '#E8F4FF', borderRadius: 2 }}
                                    />
                                ) : (
                                    <ELAPrice price_ela={item.price} price_ela_fontsize={14} />
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

export default AllTransactions;
