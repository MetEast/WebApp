import React, { useState, useMemo, useEffect } from 'react';
import Table from 'src/components/Admin/Table';
import { AdminNFTItemType, AdminTableColumn } from 'src/types/admin-table-data-types';
import ELAPrice from 'src/components/ELAPrice';
import { Typography, Stack } from '@mui/material';
import { enumBadgeType } from 'src/types/product-types';
import ProductBadge from 'src/components/ProductBadge';
import { PrimaryButton, PinkButton } from 'src/components/Buttons/styles';
import CustomTextField from 'src/components/TextField';
import { TypeSelectItem } from 'src/types/select-types';
import Select from 'src/components/Select';
import { SelectBtn } from './styles';
import { Icon } from '@iconify/react';
import ModalDialog from 'src/components/ModalDialog';
import RemoveNFT from 'src/components/Admin/Dialogs/RemoveNFT';
import { getAdminNFTItemList, getAdminSearchParams } from 'src/services/fetch';
import { adminNftSaleTypeOptions, adminNftStateOptions } from 'src/constants/select-constants';
import { blankAdminNFTItem } from 'src/constants/init-constants';

const AdminNFTs: React.FC = (): JSX.Element => {
    const columns: AdminTableColumn[] = [
        {
            id: 'token_id',
            label: 'TOKEN ID',
        },
        {
            id: 'nft_title',
            label: 'NFT Title',
        },
        {
            id: 'selling_price',
            label: 'SELLING Price',
            cell: (props) => <ELAPrice price_ela={props.value} price_ela_fontsize={14} />,
            width: 160,
        },
        {
            id: 'nft_owner',
            label: 'NFT owner',
        },
        {
            id: 'nft_creator',
            label: 'NFT CREATOR',
        },
        {
            id: 'created_date',
            label: 'CRETED DATE',
            width: 160,
        },
        {
            id: 'listed_date',
            label: 'LISTED DATE',
            width: 160,
        },
        {
            id: 'likes',
            label: '# Likes',
            width: 100,
        },
        {
            id: 'views',
            label: '# Views',
            width: 100,
        },
        {
            id: 'sale_type',
            label: 'SALE TYPE',
            cell: (props) => <ProductBadge badgeType={props.value} />,
        },
        {
            id: 'status',
            label: 'STATUS',
            cell: (props) => (
                <Typography
                    display="inline-block"
                    fontSize={14}
                    fontWeight={500}
                    paddingX={1}
                    paddingY={0.5}
                    borderRadius={2}
                    color={props.value === 'Online' ? '#1EA557' : '#EB5757'}
                    sx={{ background: props.value === 'Online' ? '#C9F5DC' : '#FDEEEE' }}
                >
                    {props.value}
                </Typography>
            ),
        },
        {
            id: 'edits',
            label: '',
            cell: (props) => (
                <Stack direction="row" spacing={1}>
                    <PinkButton
                        size="small"
                        sx={{ paddingX: 3 }}
                        onClick={(event: React.MouseEvent) => onRemove(event, props.data)}
                    >
                        <Icon
                            icon="ph:trash"
                            fontSize={20}
                            color="#EB5757"
                            style={{ marginBottom: 2, marginRight: 4 }}
                        />
                        {`Remove`}
                    </PinkButton>
                    <PrimaryButton size="small" sx={{ paddingX: 3 }}>
                        <Icon icon="ph:eye" fontSize={20} color="white" style={{ marginBottom: 2, marginRight: 4 }} />
                        {`Details`}
                    </PrimaryButton>
                </Stack>
            ),
            width: 280,
        },
    ];

    const data: AdminNFTItemType[] = useMemo(() => [...Array(1).keys()].map((item) => blankAdminNFTItem), []);

    const [tabledata, setTabledata] = useState<Array<AdminNFTItemType>>(data);
    const [inputString, setInputString] = useState<string>('');
    const [keyWord, setKeyWord] = useState<string>('');
    const [nftState, setNftState] = useState<TypeSelectItem>();
    const [nftStateSelectOpen, setNftStateSelectOpen] = useState<boolean>(false);
    const [saleType, setSaleType] = useState<TypeSelectItem>();
    const [saleTypeSelectOpen, setSaleTypeSelectOpen] = useState<boolean>(false);
    const [id2Remove, setId2Remove] = useState<number>(0);
    const [showRemoveNFTDlg, setShowRemoveNFTDlg] = useState<boolean>(false);
    
    useEffect(() => {
        let unmounted = false;
        const getFetchData = async () => {
            const _adminNFTList = await getAdminNFTItemList(getAdminSearchParams(keyWord, nftState, saleType));
            if (!unmounted) {
                setTabledata(_adminNFTList);
            }
        };
        getFetchData().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, [saleType, nftState, keyWord]);

    const handleNFTStateChange = (value: string) => {
        const item = adminNftStateOptions.find((option) => option.value === value);
        setNftState(item);
    };

    const handleSaleTypeChange = (value: string) => {
        const item = adminNftSaleTypeOptions.find((option) => option.value === value);
        setSaleType(item);
    };

    const onRemove = (event: React.MouseEvent, data: AdminNFTItemType) => {
        event.stopPropagation();
        setId2Remove(tabledata.findIndex((value: AdminNFTItemType) => value.tokenId === data.tokenId));
        setShowRemoveNFTDlg(true);
    };

    return (
        <>
            <Stack height="100%" spacing={4}>
                <Stack direction="row" alignItems="flex-end" spacing={8}>
                    <Stack direction="row" alignItems="flex-end" spacing={1}>
                        <CustomTextField
                            title="Search"
                            inputValue={inputString}
                            placeholder="TokenID, NFT title, or Address"
                            sx={{ width: 260 }}
                            changeHandler={(value: string) => setInputString(value)}
                        />
                        <PrimaryButton size="small" sx={{ paddingX: 3 }} onClick={() => setKeyWord(inputString)}>
                            <Icon
                                icon="ph:magnifying-glass"
                                fontSize={20}
                                color="white"
                                style={{ marginBottom: 2, marginRight: 4 }}
                            />
                            {`Search`}
                        </PrimaryButton>
                    </Stack>
                    <Stack direction="row" alignItems="flex-end" spacing={1}>
                        <Stack spacing={0.5}>
                            <Typography fontSize={12} fontWeight={700}>
                                NFT Status
                            </Typography>
                            <Select
                                titlebox={
                                    <SelectBtn fullWidth isOpen={nftStateSelectOpen ? 1 : 0}>
                                        {nftState ? nftState.label : 'Select'}
                                        <Icon icon="ph:caret-down" className="arrow-icon" />
                                    </SelectBtn>
                                }
                                selectedItem={nftState}
                                options={adminNftStateOptions}
                                isOpen={nftStateSelectOpen ? 1 : 0}
                                handleClick={handleNFTStateChange}
                                setIsOpen={setNftStateSelectOpen}
                                width={140}
                            />
                        </Stack>
                        <Stack spacing={0.5}>
                            <Typography fontSize={12} fontWeight={700}>
                                Sale Type
                            </Typography>
                            <Select
                                titlebox={
                                    <SelectBtn fullWidth isOpen={saleTypeSelectOpen ? 1 : 0}>
                                        {saleType ? saleType.label : 'Select'}
                                        <Icon icon="ph:caret-down" className="arrow-icon" />
                                    </SelectBtn>
                                }
                                selectedItem={saleType}
                                options={adminNftSaleTypeOptions}
                                isOpen={saleTypeSelectOpen ? 1 : 0}
                                handleClick={handleSaleTypeChange}
                                setIsOpen={setSaleTypeSelectOpen}
                                width={140}
                            />
                        </Stack>
                    </Stack>
                </Stack>
                <Table tabledata={tabledata} columns={columns} checkable={false} />
            </Stack>
            <ModalDialog
                open={showRemoveNFTDlg}
                onClose={() => {
                    setShowRemoveNFTDlg(false);
                }}
            >
                <RemoveNFT
                    tokenId={tabledata[id2Remove].tokenId}
                    tokenTitle={tabledata[id2Remove].nft_title}
                    tokenCreator={tabledata[id2Remove].nft_creator}
                    tokenIdHex={tabledata[id2Remove].tokenIdHex}
                    tokenImage={tabledata[id2Remove].nft_image}
                    onClose={() => {
                        setShowRemoveNFTDlg(false);
                    }}
                />
            </ModalDialog>
        </>
    );
};

export default AdminNFTs;
