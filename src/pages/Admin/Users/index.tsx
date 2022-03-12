import React, { useState, useMemo } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { AdminTableColumn, AdminUsersItemType } from 'src/types/admin-table-data-types';
import Table from 'src/components/Admin/Table';
import CustomTextField from 'src/components/TextField';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import { Icon } from '@iconify/react';
import ModalDialog from 'src/components/ModalDialog';
import EditUserStatus from 'src/components/Admin/Dialogs/EditUserStatus';

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
                    <img src={props.value} width="100%" height="100%" style={{ objectFit: 'cover' }} alt="" />
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
            label: 'Remarks',
            cell: (props) => (
                <Typography fontSize={14} fontWeight={600}>
                    {props.value}
                </Typography>
            ),
        },
        {
            id: 'edits',
            label: '',
            cell: (props) => (
                <SecondaryButton size="small" sx={{ paddingX: 3 }} onClick={onEdit}>
                    <Icon
                        icon="ph:pencil-simple"
                        fontSize={20}
                        color="#1890FF"
                        style={{ marginBottom: 2, marginRight: 8 }}
                    />
                    {`Edit`}
                </SecondaryButton>
            ),
        },
    ];

    const data: AdminUsersItemType[] = useMemo(
        () =>
            [...Array(800).keys()].map(
                (item) =>
                    ({
                        id: item,
                        address: 'efgd....1234',
                        username: 'Shaba',
                        avatar: '/assets/images/avatar-template.png',
                        status: item % 3,
                        remarks: 'This user tried to scam buyers by uploading a fake NFT.',
                    } as AdminUsersItemType),
            ),
        [],
    );

    const [tabledata, setTableData] = useState(data);

    const [showEditUserStatusDlg, setShowEditUserStatusDlg] = useState<boolean>(false);
    const onEdit = (event: React.MouseEvent) => {
        event.stopPropagation();
        setShowEditUserStatusDlg(true);
    };

    return (
        <>
            <Stack height="100%" spacing={4}>
                <Stack direction="row" alignItems="flex-end" columnGap={1}>
                    <CustomTextField title="Search" placeholder="Search anything..." sx={{ width: 320 }} />
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
                <Table tabledata={tabledata} columns={columns} checkable={false} />
            </Stack>
            <ModalDialog
                open={showEditUserStatusDlg}
                onClose={() => {
                    setShowEditUserStatusDlg(false);
                }}
            >
                <EditUserStatus
                    onClose={() => {
                        setShowEditUserStatusDlg(false);
                    }}
                />
            </ModalDialog>
        </>
    );
};

export default AdminUsers;
