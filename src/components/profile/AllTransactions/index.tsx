import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Stack, Grid, Typography } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { SecondaryButton } from 'src/components/Buttons/styles';
import ELAPrice from 'src/components/ELAPrice';
import Select from 'src/components/Select';
import { TypeSelectItem } from 'src/types/select-types';
import { SelectTitleBtn } from './styles';
import { Icon } from '@iconify/react';
import { TypeNFTTransaction } from 'src/types/product-types';
import { useDialogContext } from 'src/context/DialogContext';
import { viewAllDlgSortOptions } from 'src/constants/select-constants';
import { getNFTLatestTxs } from 'src/services/fetch';

export interface ComponentProps {
}

const AllTransactions: React.FC<ComponentProps> = (): JSX.Element => {
    const params = useParams();
    const [dialogState, setDialogState] = useDialogContext();
    const [allTxsList, setAllTxsList] = useState<Array<TypeNFTTransaction>>([]);
    const [sortby, setSortby] = React.useState<TypeSelectItem>();
    const [sortBySelectOpen, isSortBySelectOpen] = useState(false);
    const handleSortbyChange = (value: string) => {
        const item = viewAllDlgSortOptions.find((option) => option.value === value);
        setSortby(item);
    };

    useEffect(() => {
        let unmounted = false;
        const fetchLatestTxs = async () => {
            const _NFTTxs = await getNFTLatestTxs(params.id, '', 1, 1000, sortby?.value);
            if (!unmounted) {
                setAllTxsList(_NFTTxs.txs);
            }
        };
        fetchLatestTxs().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, [params.id, sortby]);

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
                    selectedItem={sortby}
                    options={viewAllDlgSortOptions}
                    isOpen={sortBySelectOpen ? 1 : 0}
                    setIsOpen={isSortBySelectOpen}
                    handleClick={handleSortbyChange}
                    width={160}
                />
            </Stack>
            <Stack spacing={3}>
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
                    {allTxsList.map((item, index) => (
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
                                <ELAPrice price_ela={item.price} price_ela_fontsize={14} alignRight={true} />
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
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
