import React, { useState, useEffect } from 'react';
import { Stack, Box, Grid, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import SearchField from 'src/components/SearchField';
import { TblHeaderTypo, TblBodyTypo, ImageBox } from './styles';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import { TypeBlindBoxSelectItem, TypeProductFetch } from 'src/types/product-types';
import { reduceHexAddress } from 'src/services/common';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Icon } from '@iconify/react';

export interface ComponentProps {
    onClose: () => void;
}

const testItemsList: Array<TypeBlindBoxSelectItem> = [
    {
        id: 1,
        tokenId: '32459024',
        nftIdentity: 'NFT Identity',
        projectTitle: 'Project Title',
        projectType: 'Project Type',
        url: '/assets/images/blindbox/blindbox-nft-template1.png',
    },
    {
        id: 2,
        tokenId: '32459024',
        nftIdentity: 'NFT Identity',
        projectTitle: 'Project Title',
        projectType: 'Project Type',
        url: '/assets/images/blindbox/blindbox-nft-template2.png',
    },
    {
        id: 3,
        tokenId: '32459024',
        nftIdentity: 'NFT Identity',
        projectTitle: 'Project Title',
        projectType: 'Project Type',
        url: '/assets/images/blindbox/blindbox-nft-template3.png',
    },
    {
        id: 4,
        tokenId: '32459024',
        nftIdentity: 'NFT Identity',
        projectTitle: 'Project Title',
        projectType: 'Project Type',
        url: '/assets/images/blindbox/blindbox-nft-template4.png',
    },
    {
        id: 5,
        tokenId: '32459024',
        nftIdentity: 'NFT Identity',
        projectTitle: 'Project Title',
        projectType: 'Project Type',
        url: '/assets/images/blindbox/blindbox-nft-template2.png',
    },
];

const SearchBlindBoxItems: React.FC<ComponentProps> = ({ onClose }): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    // const [itemList, setItemList] = useState<Array<TypeBlindBoxSelectItem>>([]);
    const [itemList, setItemList] = useState<Array<TypeBlindBoxSelectItem>>(testItemsList);
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
        // getFetchData();
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

    const theme = useTheme();
    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Stack spacing={3} width={{ xs: '100%', md: 720 }} maxHeight={600}>
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', md: 'center' }}
                rowGap={2}
            >
                <Typography fontSize={22} fontWeight={700}>
                    Blind Box Items
                </Typography>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <SearchField
                        handleChange={(value: string) => setKeyWord(value)}
                        sx={{ width: { xs: 200, md: 300 } }}
                    />
                    <Stack direction="row" alignItems="center" spacing={0.5} display={{ xs: 'flex', md: 'none' }}>
                        <Checkbox
                            color="primary"
                            checked={allChecked}
                            indeterminate={indeterminateChecked}
                            sx={{ padding: 0 }}
                            onChange={handleSelectAll}
                        />
                        <Typography fontSize={16} fontWeight={700} paddingTop="2px">
                            ALL
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>
            {matchDownMd && (
                <Typography fontSize={22} fontWeight={400} color="#4C4C4C">
                    5 Nft Selected
                </Typography>
            )}
            <Box sx={{ overflowY: 'auto', overflowX: 'hidden' }}>
                {matchDownMd ? (
                    <Grid container columnSpacing={3.5} rowGap={2}>
                        {itemList.map((item, index) => (
                            <Grid item xs={6}>
                                <Stack width="100%" spacing={1}>
                                    <ImageBox selected={true}>
                                        <Box className="image_box">
                                            <img src={item.url} alt="" />
                                        </Box>
                                        <Box className="check_box">
                                            <Icon icon="ph:check" fontSize={20} color="#1890FF" />
                                        </Box>
                                    </ImageBox>
                                    <Typography fontSize={12} fontWeight={700}>
                                        {item.projectTitle}
                                    </Typography>
                                </Stack>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
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
                )}
            </Box>
            <Stack direction="row" spacing={2}>
                <SecondaryButton fullWidth>Back</SecondaryButton>
                <PrimaryButton
                    fullWidth
                    onClick={() => {
                        setDialogState({
                            ...dialogState,
                            crtBlindTokenIds: selectedTokenIds.join(';'),
                        });
                        onClose();
                    }}
                >
                    Confirm
                </PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default SearchBlindBoxItems;
