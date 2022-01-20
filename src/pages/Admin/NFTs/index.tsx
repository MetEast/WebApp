import React, { useState, useMemo } from 'react';
import Table from 'src/components/Admin/Table';
import { AdminNFTItemType, AdminTableColumn } from 'src/types/admin-table-data-types';
import ELAPrice from 'src/components/ELAPrice';
import { Typography, Stack, Box } from '@mui/material';
import { enumBadgeType } from 'src/types/product-types';
import ProductBadge from 'src/components/ProductBadge';
import { Icon } from '@iconify/react';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import CustomTextField from 'src/components/TextField';

const AdminNFTs: React.FC = (): JSX.Element => {
    const columns: AdminTableColumn[] = [
        {
            id: 'rulenumber',
            label: 'Rule Number',
            width: 160,
        },
        {
            id: 'nftid',
            label: 'NFT ID',
        },
        {
            id: 'nfttitle',
            label: 'NFT Title',
        },
        {
            id: 'state',
            label: 'State',
            cell: (props) => (
                <Typography
                    display="inline-block"
                    fontSize={14}
                    fontWeight={500}
                    paddingX={1}
                    borderRadius={2}
                    color="#1EA557"
                    sx={{ background: '#C9F5DC' }}
                >
                    {props.value}
                </Typography>
            ),
        },
        {
            id: 'classification',
            label: 'Classification',
        },
        {
            id: 'original_price',
            label: 'Original Price',
            cell: (props) => <ELAPrice price_ela={props.value} />,
            width: 160,
        },
        {
            id: 'original_owner',
            label: 'original owner',
            width: 160,
        },
        {
            id: 'sale_started',
            label: 'sale started',
            width: 160,
        },
        {
            id: 'latest_deal_price',
            label: 'Latest deal price',
            cell: (props) => <ELAPrice price_ela={props.value} />,
            width: 160,
        },
        {
            id: 'latest_original_owner',
            label: 'Latest original owner',
            width: 200,
        },
        {
            id: 'latest_deal',
            label: 'latest deal',
            width: 160,
        },
        {
            id: 'latest_update',
            label: 'Latest Update',
            width: 160,
        },
        {
            id: 'number_of_deals',
            label: 'number of deals',
            width: 160,
        },
        {
            id: 'number_of_bids',
            label: 'number of Bids',
            width: 160,
        },
        {
            id: 'sort',
            label: 'Sort',
        },
        {
            id: 'sales_mode',
            label: 'sales mode',
            cell: (props) => <ProductBadge badgeType={props.value} />,
        },
        {
            id: 'likes',
            label: '# Likes',
        },
        {
            id: 'views',
            label: '# Views',
        },
        {
            id: 'edits',
            label: '',
            cell: (props) => (
                <Stack direction="row" spacing={1}>
                    <SecondaryButton size="small" sx={{ paddingX: 3 }}>
                        <Icon
                            icon="ph:pencil-simple"
                            fontSize={20}
                            color="#1890FF"
                            style={{ marginBottom: 2, marginRight: 4 }}
                        />
                        {`Edit`}
                    </SecondaryButton>
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
            [...Array(278).keys()].map(
                (item) =>
                    ({
                        id: item,
                        rulenumber: String(item + 1).padStart(5, '0'),
                        nftid: String(item + 1).padStart(5, '0'),
                        nfttitle: 'NFT Title',
                        state: 'online',
                        classification: 'Blind Box',
                        original_price: 199,
                        original_owner: 'Nickname',
                        sale_started: '2022-06-18  08:50:00',
                        latest_deal_price: 199,
                        latest_original_owner: 'Nickname',
                        latest_deal: '2022-06-18  08:50:00',
                        latest_update: '2022-06-18  08:50:00',
                        number_of_deals: 377,
                        number_of_bids: 377,
                        sort: 32,
                        sales_mode: enumBadgeType.BuyNow,
                        likes: 377,
                        views: 377,
                    } as AdminNFTItemType),
            ),
        [],
    );

    const [tabledata, setTabledata] = useState(data);

    return (
        <Stack height="100%" spacing={4}>
            <Stack direction="row" spacing={1}>
                <CustomTextField title="NFT ID" placeholder="Enter ID" />
                <CustomTextField title="NFT Title" placeholder="Enter Title" />
            </Stack>
            <Table tabledata={tabledata} columns={columns} />
        </Stack>
    );
};

export default AdminNFTs;
