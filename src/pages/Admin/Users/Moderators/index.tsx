import React, { useState, useMemo } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { AdminTableColumn, AdminUsersItemType } from 'src/types/admin-table-data-types';
import { blankAdminUserItem } from 'src/constants/init-constants';
import Table from 'src/components/Admin/Table';
import CustomTextField from 'src/components/TextField';
import { PrimaryButton } from 'src/components/Buttons/styles';
import { Icon } from '@iconify/react';
import ModalDialog from 'src/components/ModalDialog';
import Moderators from 'src/components/Admin/Dialogs/Users/Moderators';
import { reduceHexAddress } from 'src/services/common';

const AdminUserModerators: React.FC = (): JSX.Element => {
    const statusValues = [
        { label: 'User', bgcolor: '#E8F4FF', color: '#1890FF' },
        { label: 'Moderator', bgcolor: '#0B1054', color: '#FFFFFF' },
    ];

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
        {
            id: 'edits',
            label: '',
            cell: (props) => (
                <PrimaryButton
                    btn_color={(props.data as AdminUsersItemType).status === 0 ? 'green' : 'pink'}
                    size="small"
                    sx={{ paddingX: 3 }}
                    onClick={(event: React.MouseEvent) => onEdit(event, props.data)}
                >
                    {(props.data as AdminUsersItemType).status === 0 ? 'ADD MODERATOR' : 'remove Moderator'}
                </PrimaryButton>
            ),
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
                        status: item % 2,
                        remarks: '',
                    } as AdminUsersItemType),
            ),
        [],
    );

    const [tabledata, setTableData] = useState(data);
    const [id2Edit, setId2Edit] = useState<number>(0);
    const [showModeratorsDlg, setShowModeratorsDlg] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onEdit = (event: React.MouseEvent, data: AdminUsersItemType) => {
        event.stopPropagation();
        setId2Edit(tabledata.findIndex((value: AdminUsersItemType) => value.address === data.address));
        setShowModeratorsDlg(true);
    };

    return (
        <>
            <Stack height="100%" spacing={4}>
                <Stack direction="row" alignItems="flex-end" columnGap={1}>
                    <CustomTextField
                        title="Add Moderator"
                        placeholder="Search for an address or username"
                        sx={{ width: 320 }}
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
                <Table tabledata={tabledata} columns={columns} checkable={false} isLoading={isLoading} />
            </Stack>
            <ModalDialog
                open={showModeratorsDlg}
                onClose={() => {
                    setShowModeratorsDlg(false);
                }}
            >
                <Moderators
                    user2Edit={tabledata.length === 0 ? blankAdminUserItem : tabledata[id2Edit]}
                    onClose={() => {
                        setShowModeratorsDlg(false);
                    }}
                />
            </ModalDialog>
        </>
    );
};

export default AdminUserModerators;