import React, { useState, useEffect } from 'react';
import { Stack, Box, Grid, Typography, Checkbox, Skeleton } from '@mui/material';
import { PrimaryButton } from 'src/components/Buttons/styles';
import SearchField from 'src/components/SearchField';
import { TblHeaderTypo, TblBodyTypo, MobileImageBox, ImageBox } from './styles';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import { TypeBlindBoxSelectItem } from 'src/types/product-types';
import { reduceHexAddress } from 'src/services/common';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Icon } from '@iconify/react';
import { getBBCandiatesList, getBBCandiates } from 'src/services/fetch';
import { useSnackbar } from 'notistack';
import LooksEmptyBox from 'src/components/Profile/LooksEmptyBox';

export interface ComponentProps {
    maxSelect: number;
    onClose: () => void;
}

const SearchBlindBoxItems: React.FC<ComponentProps> = ({ maxSelect, onClose }): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const { enqueueSnackbar } = useSnackbar();
    const [loadingItemsList, setLoadingItemsList] = useState<boolean>(true);
    const [bbCandidateLists, setBBCandidateLists] = useState<Array<any>>([]);
    const [itemList, setItemList] = useState<Array<TypeBlindBoxSelectItem>>([]);
    const [keyWord, setKeyWord] = useState<string>('');
    const [emptyKeyword, setEmptyKeyword] = useState<number>(0);
    const [allChecked, setAllChecked] = useState<boolean>(false);
    const [itemChecked, setItemChecked] = useState<Array<boolean>>([]);
    const [indeterminateChecked, setIndeterminateChecked] = useState<boolean>(false);
    const [selectedTokenIds, setSelectedTokenIds] = useState<Array<string>>(
        dialogState.crtBlindTokenIds.split(';').filter((value: string) => value.length > 0),
    );

    let allTokenIds: Array<string> = [];
    for (let i = 0; i < itemList.length; i++) allTokenIds.push(itemList[i].tokenId);

    // -------------- Fetch Data -------------- //
    useEffect(() => {
        let unmounted = false;
        const getFetchData = async () => {
            if (!unmounted) setLoadingItemsList(true);
            const _BBCandidatesList = await getBBCandiatesList(signInDlgState.address, keyWord, signInDlgState.token);
            if (!unmounted) {
                setBBCandidateLists(_BBCandidatesList);
                setLoadingItemsList(false);
            }
        };
        if (signInDlgState.address) getFetchData().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, [signInDlgState.address, signInDlgState.token, keyWord]);
    // -------------- Fetch Data -------------- //

    useEffect(() => {
        const _BBCandidates = getBBCandiates(bbCandidateLists, selectedTokenIds);
        setItemList(_BBCandidates.candidates);
        // setLoadingItemsList(false);
        setItemChecked(_BBCandidates.itemChecked);
        setAllChecked(_BBCandidates.allChecked);
        setIndeterminateChecked(_BBCandidates.indeterminateChecked);
    }, [bbCandidateLists, selectedTokenIds]);

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

    const handleSelectSingle = (index: number) => {
        let checkState: Array<boolean> = [...itemChecked];
        let selTokenIds: Array<string> = [...selectedTokenIds];
        checkState[index] = !itemChecked[index];
        if (!itemChecked[index]) {
            if (selectedTokenIds.length < maxSelect) selTokenIds.push(itemList[index].tokenId);
            else {
                enqueueSnackbar(`Can not select more than ${maxSelect}`, {
                    variant: 'error',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                return;
            }
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

    const handleKeywordChanged = (value: string) => {
        if(!value) {
            const _BBCandidates = getBBCandiates(bbCandidateLists, selectedTokenIds);
            setItemList(_BBCandidates.candidates);
            return;
        }

        setItemList((prevState: any[] ) => {
            return prevState.filter((item: any) => {
                const regex = new RegExp(value, 'gi');
                return item.projectTitle.search(regex) !== -1;
            });
        });
    }

    const theme = useTheme();
    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Stack
            spacing={2}
            width={{ xs: '100%', md: 720 }}
            justifyContent="space-between"
            height={{ xs: '90%', md: '70vh' }}
        >
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', md: 'center' }}
                rowGap={2}
            >
                <Typography fontSize={22} fontWeight={700}>
                    Mystery Box Items
                </Typography>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <SearchField
                        emptyKeyword={emptyKeyword}
                        // handleChange={(value: string) => setKeyWord(value)}
                        handleChange={(value: string) => {handleKeywordChanged(value)}}
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
                {matchDownMd && (
                    <>
                        {loadingItemsList ? (
                            <Skeleton
                                variant="rectangular"
                                animation="wave"
                                width="100%"
                                height={36}
                                sx={{ borderRadius: 2, bgcolor: '#E8F4FF' }}
                            />
                        ) : (
                            <Typography fontSize={22} fontWeight={400} color="#4C4C4C">
                                {selectedTokenIds.length} Nft Selected
                            </Typography>
                        )}
                    </>
                )}
            </Stack>
            <Box height="100%" sx={{ overflowY: 'auto', overflowX: 'hidden' }}>
                {matchDownMd ? (
                    <Grid container columnSpacing={3.5} rowGap={2}>
                        {(loadingItemsList ? [...Array(6)] : itemList).map((item, index) => (
                            <Grid item key={index} xs={6}>
                                <Stack width="100%" spacing={1}>
                                    {loadingItemsList ? (
                                        <MobileImageBox selected={false}>
                                            <Box className="skeleton_box">
                                                <Skeleton
                                                    variant="rectangular"
                                                    animation="wave"
                                                    width="100%"
                                                    height="100%"
                                                    sx={{ bgcolor: '#E8F4FF' }}
                                                />
                                            </Box>
                                        </MobileImageBox>
                                    ) : (
                                        <MobileImageBox
                                            selected={itemChecked[index] === undefined ? false : itemChecked[index]}
                                            onClick={() => handleSelectSingle(index)}
                                        >
                                            <Box className="image_box">
                                                <img src={item.url} alt="" />
                                            </Box>
                                            <Box className="check_box">
                                                <Icon icon="ph:check" fontSize={20} color="#1890FF" />
                                            </Box>
                                        </MobileImageBox>
                                    )}
                                    {loadingItemsList ? (
                                        <Skeleton
                                            variant="rectangular"
                                            animation="wave"
                                            width="100%"
                                            height={24}
                                            sx={{ borderRadius: 2, bgcolor: '#E8F4FF' }}
                                        />
                                    ) : (
                                        <Typography fontSize={12} fontWeight={700}>
                                            {item.projectTitle}
                                        </Typography>
                                    )}
                                </Stack>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Grid container columns={25} rowGap={3} direction="row" alignItems="center" columnSpacing={2}>
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
                        {(loadingItemsList ? [...Array(5)] : itemList).map((item, index) => (
                            <Grid
                                item
                                container
                                columns={25}
                                alignItems="center"
                                columnSpacing={2}
                                key={`search-blind-item-${index}`}
                            >
                                {loadingItemsList ? (
                                    <Grid item xs={5}>
                                        <Skeleton
                                            variant="rectangular"
                                            animation="wave"
                                            width="100%"
                                            height={24}
                                            sx={{ borderRadius: 2, bgcolor: '#E8F4FF' }}
                                        />
                                    </Grid>
                                ) : (
                                    <>
                                        <Grid item xs={1}>
                                            <Checkbox
                                                color="primary"
                                                sx={{ padding: 0 }}
                                                value="off"
                                                checked={itemChecked[index] === undefined ? false : itemChecked[index]}
                                                onClick={() => handleSelectSingle(index)}
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TblBodyTypo>{item.id}</TblBodyTypo>
                                        </Grid>
                                    </>
                                )}
                                {loadingItemsList ? (
                                    <Grid item xs={5}>
                                        <Skeleton
                                            variant="rectangular"
                                            animation="wave"
                                            width={72}
                                            height={50}
                                            sx={{ borderRadius: 2, bgcolor: '#E8F4FF' }}
                                        />
                                    </Grid>
                                ) : (
                                    <Grid item xs={5}>
                                        <ImageBox>
                                            <img src={item.url} alt="" />
                                        </ImageBox>
                                    </Grid>
                                )}
                                {loadingItemsList ? (
                                    <Grid item xs={15}>
                                        <Skeleton
                                            variant="rectangular"
                                            animation="wave"
                                            width="100%"
                                            height={24}
                                            sx={{ borderRadius: 2, bgcolor: '#E8F4FF' }}
                                        />
                                    </Grid>
                                ) : (
                                    <>
                                        <Grid item xs={5}>
                                            <TblBodyTypo>{reduceHexAddress(item.nftIdentity, 4)}</TblBodyTypo>
                                        </Grid>
                                        <Grid item xs={5}>
                                            <TblBodyTypo>{item.projectTitle}</TblBodyTypo>
                                        </Grid>
                                        <Grid item xs={5}>
                                            <TblBodyTypo>{item.projectType}</TblBodyTypo>
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                        ))}
                    </Grid>
                )}
                {!itemList.length && !loadingItemsList && (
                    <LooksEmptyBox
                        bannerTitle={keyWord ? 'No Products Found For This Search' : 'Looks Empty Here'}
                        buttonLabel={keyWord ? 'Back to all Items' : ''}
                        sx={{ marginTop: { xs: 3, md: 5 } }}
                        onBannerBtnClick={() => {
                            // only with keyword
                            setEmptyKeyword(emptyKeyword + 1);
                            setKeyWord('');
                        }}
                    />
                )}
            </Box>
            <Stack direction="row" spacing={2}>
                <PrimaryButton btn_color="secondary" fullWidth onClick={onClose}>
                    Back
                </PrimaryButton>
                <PrimaryButton
                    fullWidth
                    onClick={() => {
                        if (selectedTokenIds.length > maxSelect) {
                            enqueueSnackbar(`Can not select more than ${maxSelect}`, {
                                variant: 'error',
                                anchorOrigin: { horizontal: 'right', vertical: 'top' },
                            });
                        } else {
                            const selectedTokenNames: Array<string> = [];
                            selectedTokenIds.forEach((item: string) => {
                                selectedTokenNames.push(
                                    itemList[
                                        itemList.findIndex((value: TypeBlindBoxSelectItem) => value.tokenId === item)
                                    ].projectTitle,
                                );
                            });

                            setDialogState({
                                ...dialogState,
                                crtBlindTokenIds: selectedTokenIds.join(';'),
                                crtBlindTokenNames: selectedTokenNames.join(';'),
                            });
                            onClose();
                        }
                    }}
                >
                    Confirm
                </PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default SearchBlindBoxItems;
