import React, { useState, useMemo, useEffect } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { AdminTableColumn, AdminUsersItemType } from 'src/types/admin-table-data-types';
import Table from 'src/components/Admin/Table';
import { Icon } from '@iconify/react';
import { reduceHexAddress } from 'src/services/common';
import { getAdminSearchParams, getAdminUserList } from 'src/services/fetch';
import { blankAdminUserItem } from 'src/constants/init-constants';
import { useSignInContext } from '../../../../context/SignInContext';

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
            cell: (props) => (
                <Typography fontSize={16}>
                    {props.value.length > 10 ? reduceHexAddress(props.value, 4) : props.value}
                </Typography>
            ),
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

    const data: AdminUsersItemType[] = useMemo(() => [...Array(1).keys()].map((item) => blankAdminUserItem), []);
    const [signInDlgState] = useSignInContext();
    const [totalCount, setTotalCount] = useState<number>(0);
    const [pageNum, setPageNum] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(5);
    const [tabledata, setTableData] = useState(data);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        let unmounted = false;
        const getFetchData = async () => {
            setIsLoading(true);
            const _adminUserList = await getAdminUserList(
                '',
                getAdminSearchParams(undefined, undefined, pageNum + 1, pageSize),
                0 /** 0: from Admin page, 1: from Moderators page, 2: from Banned Users page */,
                signInDlgState.token
            );
            if (!unmounted) {
                setTotalCount(_adminUserList.totalCount);
                setTableData(_adminUserList.data);
                setIsLoading(false);
            }
        };
        getFetchData().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, [pageNum, pageSize, signInDlgState.token]);

    return (
        <>
            <Stack height="100%" spacing={4}>
                <Typography fontSize={42} fontWeight={700}>
                    ADMINS
                </Typography>
                <Table
                    totalCount={totalCount}
                    pageNum={pageNum}
                    pageSize={pageSize}
                    tabledata={tabledata}
                    columns={columns}
                    checkable={false}
                    isLoading={isLoading}
                    emptyString="No Listed Admins"
                    setPageNum={setPageNum}
                    setPageSize={setPageSize}
                />
            </Stack>
        </>
    );
};

export default AdminUserAdmins;
