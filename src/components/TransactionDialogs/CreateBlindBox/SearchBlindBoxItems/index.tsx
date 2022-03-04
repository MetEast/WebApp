import React, { useState, useEffect } from 'react';
import { Stack, Box, Grid, Typography, Checkbox } from '@mui/material';
import { PrimaryButton } from 'src/components/Buttons/styles';
import SearchField from 'src/components/SearchField';
import { TblHeaderTypo, TblBodyTypo } from './styles';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import { TypeBlindBoxSelectItem, TypeProductFetch } from 'src/types/product-types';
import { getImageFromAsset, reduceHexAddress } from 'src/services/common';

export interface ComponentProps {
    onClose: () => void;
}

const SearchBlindBoxItems: React.FC<ComponentProps> = ({ onClose }): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const [itemList, setItemList] = useState<Array<TypeBlindBoxSelectItem>>([]);
    const [keyWord, setKeyWord] = useState<string>('');
    const [allChecked, setAllChecked] = useState<boolean>(false);
    const [itemChecked, setItemChecked] = useState<Array<boolean>>([]);
    const [indeterminateChecked, setIndeterminateChecked] = useState<boolean>(false);
    const [selectedTokenIds, setSelectedTokenIds] = useState<Array<string>>([]);

    const defaultValue: TypeBlindBoxSelectItem = {
        id: 0,
        tokenId: '',
        nftIdentity: '',
        projectTitle: '',
        projectType: '',
        url: '',
    };

    let allTokenIds: Array<string> = [];
    for (let i = 0; i < itemList.length; i++) allTokenIds.push(itemList[i].tokenId);

    // -------------- Fetch Data -------------- //
    const getBlindBoxItemList = async () => {
        console.log('===========', signInDlgState.walletAccounts[0]);
        const resBlindBoxItem = await fetch(
            `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getBlindboxCandidate?address=${signInDlgState.walletAccounts[0]}&keyword=${keyWord}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            },
        );
        const dataBlindBoxItem = await resBlindBoxItem.json();
        const arrBlindBoxItem = dataBlindBoxItem.data === undefined ? [] : dataBlindBoxItem.data.result;

        let _itemList: Array<TypeBlindBoxSelectItem> = [];
        let _itemChecked: Array<boolean> = [];
        for (let i = 0; i < arrBlindBoxItem.length; i++) {
            let itemObject: TypeProductFetch = arrBlindBoxItem[i];
            let item: TypeBlindBoxSelectItem = { ...defaultValue };
            item.id = i + 1;
            item.tokenId = itemObject.tokenId;
            item.nftIdentity = itemObject.tokenIdHex;
            item.projectTitle = itemObject.name;
            item.projectType = itemObject.category;
            item.url = getImageFromAsset(itemObject.asset);
            _itemList.push(item);
            _itemChecked.push(false);
        }
        setItemList(_itemList);
        setItemChecked(_itemChecked);
    };

    const getFetchData = async () => {
        getBlindBoxItemList();
    };

    useEffect(() => {
        getFetchData();
    }, [keyWord]);
    // -------------- Fetch Data -------------- //

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        let _itemChecked: Array<boolean> = Array(itemList.length);
        if (event.target.checked) {
            _itemChecked.fill(true);
            setSelectedTokenIds(allTokenIds);
        } else {
            _itemChecked.fill(false);
            setSelectedTokenIds([]);
        }
        setItemChecked(_itemChecked);
        setAllChecked(event.target.checked);
    };

    const handleSelect = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        let checkState: Array<boolean> = [...itemChecked];
        let selTokenIds: Array<string> = [...selectedTokenIds];
        checkState[index] = event.target.checked;
        if (event.target.checked) {
            selTokenIds.push(itemList[index].tokenId);
        } else {
            const id = selTokenIds.indexOf(itemList[index].tokenId);
            selTokenIds.splice(id, 1);
        }
        setItemChecked(checkState);
        setSelectedTokenIds(selTokenIds);

        if (selTokenIds.length === itemList.length) {
            // all selected
            setIndeterminateChecked(false);
            setAllChecked(true);
        } else {
            if (selTokenIds.length === 0) setIndeterminateChecked(false);
            else setIndeterminateChecked(true);
            setAllChecked(false);
        }
    };

    return (
        <Stack spacing={3} width={720} maxHeight={600}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography fontSize={22} fontWeight={700}>
                    Blind Box Items
                </Typography>
                <Box width={300}>
                    <SearchField handleChange={(value: string) => setKeyWord(value)} />
                </Box>
            </Stack>
            <Box sx={{ overflowY: 'auto', overflowX: 'hidden' }}>
                <Grid container columns={25} rowGap={3} direction="row" alignItems="center">
                    <Grid item xs={1} paddingY={1}>
                        <Checkbox
                            color="primary"
                            checked={allChecked}
                            indeterminate={indeterminateChecked}
                            sx={{ padding: 0 }}
                            onChange={handleSelectAll}
                        />
                    </Grid>
                    <Grid item xs={4} paddingY={1}>
                        <TblHeaderTypo>ID</TblHeaderTypo>
                    </Grid>
                    <Grid item xs={5} paddingY={1}>
                        <TblHeaderTypo>NFT ImAGE</TblHeaderTypo>
                    </Grid>
                    <Grid item xs={5} paddingY={1}>
                        <TblHeaderTypo>NFT Identity</TblHeaderTypo>
                    </Grid>
                    <Grid item xs={5} paddingY={1}>
                        <TblHeaderTypo>project Title</TblHeaderTypo>
                    </Grid>
                    <Grid item xs={5} paddingY={1}>
                        <TblHeaderTypo>project type</TblHeaderTypo>
                    </Grid>
                    {itemList.map((item, index) => (
                        <Grid item container alignItems="center" key={`search-blind-item-${index}`}>
                            <Grid item xs={1}>
                                <Checkbox
                                    color="primary"
                                    sx={{ padding: 0 }}
                                    value="off"
                                    checked={itemChecked[index] === undefined ? false : itemChecked[index]}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        handleSelect(event, index);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TblBodyTypo>{item.id}</TblBodyTypo>
                            </Grid>
                            <Grid item xs={5}>
                                <Box borderRadius={2} width={72} height={50} overflow="hidden">
                                    <img
                                        src={item.url}
                                        width="100%"
                                        height="100%"
                                        style={{ objectFit: 'cover' }}
                                        alt=""
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={5}>
                                <TblBodyTypo>{reduceHexAddress(item.nftIdentity, 4)}</TblBodyTypo>
                            </Grid>
                            <Grid item xs={5}>
                                <TblBodyTypo>{item.projectTitle}</TblBodyTypo>
                            </Grid>
                            <Grid item xs={5}>
                                <TblBodyTypo>{item.projectType}</TblBodyTypo>
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <PrimaryButton
                onClick={() => {
                    let selectedTokenNames: Array<string> = [];
                    selectedTokenIds.forEach((item: string, index: number) => {
                        selectedTokenNames.push(itemList[itemList.findIndex((value: TypeBlindBoxSelectItem) => value.tokenId === item)].projectTitle);
                    });

                    setDialogState({
                        ...dialogState,
                        crtBlindTokenIds: selectedTokenIds.join(';'),
                        crtBlindTokenNames: selectedTokenNames.join(';'),
                    });
                    onClose();
                }}
            >
                Confirm
            </PrimaryButton>
        </Stack>
    );
};

export default SearchBlindBoxItems;
