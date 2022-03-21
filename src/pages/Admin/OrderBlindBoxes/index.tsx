import React, { useState, useMemo } from 'react';
import { Stack, Typography } from '@mui/material';
import { AdminOrdersBlindBoxItemType, AdminTableColumn } from 'src/types/admin-table-data-types';
import Table from 'src/components/Admin/Table';
import ELAPrice from 'src/components/ELAPrice';
import { PrimaryButton } from 'src/components/Buttons/styles';
import { Icon } from '@iconify/react';

const AdminOrderBlindBoxes: React.FC = (): JSX.Element => {
    const columns: AdminTableColumn[] = [
        {
            id: 'blindbox_id',
            label: 'Mystery Box ID',
        },
        {
            id: 'blindbox_title',
            label: 'Mystery Box Title',
            width: 160,
        },
        {
            id: 'status',
            label: 'Status',
            cell: (props) => (
                <Typography
                    display="inline-block"
                    fontSize={14}
                    fontWeight={500}
                    paddingX={1}
                    borderRadius={2}
                    color="#EB5757"
                    sx={{ background: '#FDEEEE' }}
                >
                    {props.value}
                </Typography>
            ),
        },
        {
            id: 'order_amount',
            label: 'Order Amount',
            cell: (props) => <ELAPrice price_ela={props.value} price_ela_fontsize={14} />,
            width: 160,
        },
        {
            id: 'created',
            label: 'Created',
            width: 160,
        },
        {
            id: 'buyer_id',
            label: 'Buyer ID',
        },
        {
            id: 'purchases',
            label: '# purchases',
            width: 160,
        },
        {
            id: 'buyer_nickname',
            label: 'Buyer Nickname',
            width: 160,
        },
        {
            id: 'seller_nickname',
            label: 'Seller Nickname',
            width: 160,
        },
        {
            id: 'details',
            label: '',
            cell: (props) => (
                <PrimaryButton size="small" sx={{ paddingX: 3, marginLeft: 2 }}>
                    <Icon icon="ph:eye" fontSize={20} color="white" style={{ marginBottom: 2, marginRight: 4 }} />
                    {`Details`}
                </PrimaryButton>
            ),
        },
    ];

    const data: AdminOrdersBlindBoxItemType[] = useMemo(
        () =>
            [...Array(88).keys()].map(
                (item) =>
                    ({
                        id: item,
                        blindbox_id: String(84560673 + item),
                        blindbox_title: 'Mystery Box Title',
                        status: 'Unpaid',
                        order_amount: 199,
                        created: '2022-06-18  08:50:00',
                        buyer_id: '84560673943',
                        purchases: 373,
                        buyer_nickname: 'Nickname',
                        seller_nickname: 'Nickname',
                    } as AdminOrdersBlindBoxItemType),
            ),
        [],
    );

    const [tabledata] = useState(data);

    return (
        <Stack height="100%" spacing={4}>
            <Stack direction="row" alignItems="flex-end" columnGap={1}></Stack>
            <Table tabledata={tabledata} columns={columns} />
        </Stack>
    );
};

export default AdminOrderBlindBoxes;
