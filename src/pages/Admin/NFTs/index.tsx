import React, { useState, useMemo } from 'react';
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
                    <PinkButton size="small" sx={{ paddingX: 3 }} onClick={onRemove}>
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

    const data: AdminNFTItemType[] = useMemo(
        () =>
            [...Array(800).keys()].map(
                (item) =>
                    ({
                        id: item,
                        token_id: '0x43d…5e4',
                        nft_title: 'Testing',
                        selling_price: 199,
                        nft_owner: '0xec3dxxx56',
                        nft_creator: '0x93cdxx45',
                        created_date: '2022-06-18  08:50:00',
                        listed_date: '2022-06-18  08:50:00',
                        likes: 377,
                        views: 377,
                        sale_type: item % 2 === 0 ? enumBadgeType.BuyNow : enumBadgeType.OnAuction,
                        status: item % 2 === 0 ? 'Online' : 'Removed',
                    } as AdminNFTItemType),
            ),
        [],
    );

    const nftStateOptions: Array<TypeSelectItem> = [
        {
            label: 'online',
            value: 'online',
        },
        {
            label: 'removed',
            value: 'removed',
        },
    ];

    const saleTypeOptions: Array<TypeSelectItem> = [
        {
            label: 'Buy now',
            value: 'Buy now',
        },
        {
            label: 'On auction',
            value: 'On auction',
        },
    ];

    const [tabledata, setTabledata] = useState(data);

    const [nftState, setNftState] = useState<TypeSelectItem>();
    const [nftStateSelectOpen, setNftStateSelectOpen] = useState(false);

    const [saleType, setSaleType] = useState<TypeSelectItem>();
    const [saleTypeSelectOpen, setSaleTypeSelectOpen] = useState(false);

    const handleNFTStateChange = (value: string) => {
        const item = nftStateOptions.find((option) => option.value === value);
        setNftState(item);
    };

    const handleSaleTypeChange = (value: string) => {
        const item = saleTypeOptions.find((option) => option.value === value);
        setSaleType(item);
    };

    const [showRemoveNFTDlg, setShowRemoveNFTDlg] = useState<boolean>(false);
    const onRemove = (event: React.MouseEvent) => {
        event.stopPropagation();
        setShowRemoveNFTDlg(true);
    };

    return (
        <>
            <Stack height="100%" spacing={4}>
                <Stack direction="row" alignItems="flex-end" spacing={8}>
                    <Stack direction="row" alignItems="flex-end" spacing={1}>
                        <CustomTextField
                            title="Search"
                            placeholder="TokenID, NFT title, or Address"
                            sx={{ width: 260 }}
                        />
                        <PrimaryButton size="small" sx={{ paddingX: 3 }}>
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
                                options={nftStateOptions}
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
                                options={saleTypeOptions}
                                isOpen={saleTypeSelectOpen ? 1 : 0}
                                handleClick={handleSaleTypeChange}
                                setIsOpen={setSaleTypeSelectOpen}
                                width={140}
                            />
                        </Stack>
                    </Stack>
                </Stack>
                <Table tabledata={tabledata} columns={columns} />
            </Stack>
            <ModalDialog
                open={showRemoveNFTDlg}
                onClose={() => {
                    setShowRemoveNFTDlg(false);
                }}
            >
                <RemoveNFT
                    onClose={() => {
                        setShowRemoveNFTDlg(false);
                    }}
                />
            </ModalDialog>
        </>
    );
};

export default AdminNFTs;
