import React, { useState, useMemo } from 'react';
import { Typography, Stack, IconButton } from '@mui/material';
import Table from 'src/components/Admin/Table';
import { AdminBlindBoxItemType, AdminTableColumn } from 'src/types/admin-table-data-types';
import CustomTextField from 'src/components/TextField';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import { Icon } from '@iconify/react';
import ELAPrice from 'src/components/ELAPrice';
import { useDialogContext } from 'src/context/DialogContext';

const AdminBlindBoxes: React.FC = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    const columns: AdminTableColumn[] = [
        {
            id: 'blindbox_id',
            label: 'Mystery Box ID',
        },
        {
            id: 'blindbox_name',
            label: 'Mystery Box name',
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
            id: 'price',
            label: 'Price',
            cell: (props) => <ELAPrice price_ela={props.value} price_ela_fontsize={14} />,
            width: 160,
        },
        {
            id: 'sale_begins',
            label: 'Sale begins',
            width: 160,
        },
        {
            id: 'sale_ends',
            label: 'Sale Ends',
            width: 160,
        },
        {
            id: 'transactions',
            label: '# Transactions',
            width: 160,
        },
        {
            id: 'purchases',
            label: '# purchases',
            width: 160,
        },
        {
            id: 'available',
            label: '# Available',
        },
        {
            id: 'latest_trans_time',
            label: 'Latest transaction time',
            width: 220,
        },
        {
            id: 'liked',
            label: '# Liked',
        },
        {
            id: 'page_views',
            label: 'Pageviews',
        },
        {
            id: 'edits',
            label: '',
            cell: (props) => (
                <Stack direction="row" spacing={1}>
                    <IconButton sx={{ height: 40, borderRadius: 3, background: '#FDEEEE' }}>
                        <Icon icon="ph:trash" color="#EB5757" />
                    </IconButton>
                    <IconButton sx={{ height: 40, borderRadius: 3, background: '#E8F4FF' }}>
                        <Icon icon="ph:pencil-simple" color="#1890FF" />
                    </IconButton>
                    <IconButton sx={{ height: 40, borderRadius: 3, background: '#1890FF' }}>
                        <Icon icon="ph:eye" color="white" />
                    </IconButton>
                </Stack>
            ),
        },
    ];

    const data: AdminBlindBoxItemType[] = useMemo(
        () =>
            [...Array(136).keys()].map(
                (item) =>
                    ({
                        id: item,
                        blindbox_id: String(item + 1).padStart(4, '0'),
                        blindbox_name: 'Mystery Box Title',
                        status: 'offline',
                        price: 199,
                        sale_begins: '2022-06-18  08:50:00',
                        sale_ends: '2022-06-18  08:50:00',
                        transactions: 88,
                        purchases: 88,
                        available: 88,
                        latest_trans_time: '2022-06-18  08:50:00',
                        liked: 88,
                        page_views: 2384,
                    } as AdminBlindBoxItemType),
            ),
        [],
    );

    const [tabledata] = useState(data);

    return (
        <>
            <Stack height="100%" spacing={4}>
                <Stack direction="row" alignItems="flex-end" columnGap={1}>
                    <CustomTextField title="Mystery Box ID" placeholder="Enter ID" />
                    <CustomTextField title="Mystery Box Name" placeholder="Enter Name" />
                    <PrimaryButton size="small" sx={{ paddingX: 3 }}>
                        <Icon
                            icon="ph:magnifying-glass"
                            fontSize={20}
                            color="white"
                            style={{ marginBottom: 2, marginRight: 4 }}
                        />
                        {`Search`}
                    </PrimaryButton>
                    <Stack spacing={0.5} marginLeft={2}>
                        <Typography fontSize={12} fontWeight={700}>
                            Mystery Box Status
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <SecondaryButton size="small" sx={{ paddingX: 3 }}>
                                Offline
                            </SecondaryButton>
                            <SecondaryButton size="small" sx={{ paddingX: 3 }}>
                                Online
                            </SecondaryButton>
                        </Stack>
                    </Stack>
                    <PrimaryButton
                        size="small"
                        sx={{ paddingX: 3, marginLeft: 2 }}
                        onClick={() => {
                            setDialogState({ ...dialogState, createBlindBoxDlgOpened: true, createBlindBoxDlgStep: 0 });
                        }}
                    >
                        <Icon icon="ph:plus" fontSize={20} color="white" style={{ marginBottom: 2, marginRight: 4 }} />
                        {`New Mystery Box`}
                    </PrimaryButton>
                </Stack>
                <Table tabledata={tabledata} columns={columns} />
            </Stack>
        </>
    );
};

export default AdminBlindBoxes;
