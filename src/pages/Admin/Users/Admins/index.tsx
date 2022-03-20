import React, { useState, useMemo } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { AdminTableColumn, AdminUsersItemType } from 'src/types/admin-table-data-types';
import Table from 'src/components/Admin/Table';
import { Icon } from '@iconify/react';
import { reduceHexAddress } from 'src/services/common';

const AdminUserAdmins: React.FC = (): JSX.Element => {
    const statusValues = [{ label: 'Admin', bgcolor: '#C9F5DC', color: '#1EA557' }];

    const columns: AdminTableColumn[] = [
        {
            id: 'address',
            label: 'Address',
            cell: (props) => <Typography fontSize={16}>{reduceHexAddress(props.value, 7)}</Typography>,
            width: 80,
        },
        {
            id: 'username',
            label: 'Username',
            width: 80,
        },
        {
            id: 'avatar',
            label: 'Avatar',
            cell: (props) => (
                <Box borderRadius="50%" width={50} height={50} overflow="hidden" alignSelf="center">
                    {props.value === '' ? (
                        <Icon icon="ph:user" fontSize={40} color="#1890FF" />
                    ) : (
                        <img src={props.value} width="100%" height="100%" style={{ objectFit: 'cover' }} alt="" />
                    )}
                </Box>
            ),
            width: 80,
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
            width: 80,
        },
        {
            id: 'remarks',
            label: '',
        },
    ];

    const data: AdminUsersItemType[] = useMemo(
        () =>
            [...Array(800).keys()].map(
                (item) =>
                    ({
                        id: item,
                        address: 'efgd....' + (1001 + item),
                        username: 'Shaba',
                        avatar: '/assets/images/avatar-template.png',
                        status: 0,
                        remarks: '',
                    } as AdminUsersItemType),
            ),
        [],
    );

    const [tabledata, setTableData] = useState(data);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    return (
        <>
            <Stack height="100%" spacing={4}>
                <Typography fontSize={42} fontWeight={700}>
                    ADMINS
                </Typography>
                <Table tabledata={tabledata} columns={columns} checkable={false} isLoading={isLoading} />
            </Stack>
        </>
    );
};

export default AdminUserAdmins;