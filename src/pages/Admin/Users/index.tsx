import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { AdminTableColumn, AdminUsersItemType } from 'src/types/admin-table-data-types';
import Table from 'src/components/Admin/Table';
import CustomTextField from 'src/components/TextField';
import { PrimaryButton } from 'src/components/Buttons/styles';
import { Icon } from '@iconify/react';

const AdminUsers: React.FC = (): JSX.Element => {
    const statusValues = [
        { label: 'Admin', bgcolor: '#C9F5DC', color: '#1EA557' },
        { label: 'User', bgcolor: '#E8F4FF', color: '#1890FF' },
        { label: 'Banned', bgcolor: '#FDEEEE', color: '#EB5757' },
    ];
    const columns: AdminTableColumn[] = [
        {
            id: 'address',
            label: 'Address',
        },
        {
            id: 'username',
            label: 'Username',
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
                    paddingTop="2px"
                    paddingBottom="1px"
                    borderRadius={2}
                    color={statusValues[props.value].color}
                    sx={{ background: statusValues[props.value].bgcolor }}
                >
                    {statusValues[props.value].label}
                </Typography>
            ),
        },
        {
            id: 'remarks',
            label: 'Remarks',
            cell: (props) => (
                <Typography fontSize={14} fontWeight={600}>
                    {props.value}
                </Typography>
            ),
        },
    ];

    const data: AdminUsersItemType[] = [
        {
            id: 0,
            address: 'efgd....1234',
            username: 'Shaba',
            status: 2,
            remarks: 'This user tried to scam buyers by uploading a fake NFT.',
        },
        {
            id: 1,
            address: 'efgd....1213',
            username: 'Michael',
            status: 0,
            remarks: 'Bots',
        },
        {
            id: 2,
            address: 'e413....1441',
            username: 'Tang',
            status: 0,
            remarks: '-',
        },
        {
            id: 3,
            address: 'efgd....1dfa',
            username: 'asralf',
            status: 1,
            remarks: '',
        },
        {
            id: 4,
            address: 'e413....1gas',
            username: 'John',
            status: 2,
            remarks: 'Bots',
        },
        {
            id: 5,
            address: 'efgd....1af4',
            username: 'Doe',
            status: 2,
            remarks: 'Bots',
        },
        {
            id: 6,
            address: 'e413....11fa',
            username: 'Hannah',
            status: 2,
            remarks: 'Multiple reports by the users about this user. Fake NFTs.',
        },
    ];

    const [tabledata] = useState(data);

    return (
        <Stack height="100%" spacing={4}>
            <Stack direction="row" alignItems="flex-end" columnGap={1}>
                <CustomTextField placeholder="Search anything..." sx={{ width: 320 }} />
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

export default AdminUsers;
