import React, { useState, useMemo } from 'react';
import { Typography, Stack, IconButton } from '@mui/material';
import Table from 'src/components/Admin/Table';
import { AdminBlindBoxItemType, AdminTableColumn } from 'src/types/admin-table-data-types';
import CustomTextField from 'src/components/TextField';
import { PrimaryButton } from 'src/components/Buttons/styles';
import { Icon } from '@iconify/react';

const AdminBlindBoxes: React.FC = (): JSX.Element => {
    const columns: AdminTableColumn[] = [
        {
            id: 'blindbox_id',
            label: 'Blind Box ID',
        },
        {
            id: 'blindbox_name',
            label: 'Blind Box name',
        },
        {
            id: 'status',
            label: 'Status',
        },
        {
            id: 'price',
            label: 'Price',
        },
        {
            id: 'sale_begins',
            label: 'Sale begins',
        },
        {
            id: 'sale_ends',
            label: 'Sale Ends',
        },
    ];

    const data: AdminBlindBoxItemType[] = useMemo(
        () =>
            [...Array(136).keys()].map(
                (item) =>
                    ({
                        id: item,
                        blindbox_id: String(item + 1).padStart(4, '0'),
                        blindbox_name: 'Blind Box Title',
                        status: 'online',
                        price: 199,
                        sale_begins: '2022-06-18  08:50:00',
                        sale_ends: '2022-06-18  08:50:00',
                    } as AdminBlindBoxItemType),
            ),
        [],
    );

    const [tabledata, setTabledata] = useState(data);

    return (
        <Stack height="100%" spacing={4}>
            <Stack direction="row" alignItems="flex-end" spacing={1}>
                <CustomTextField title="Blind Box ID" placeholder="Enter ID" />
                <CustomTextField title="Blind Box Name" placeholder="Enter Name" />
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
            <Table tabledata={tabledata} columns={columns} />
        </Stack>
    );
};

export default AdminBlindBoxes;
