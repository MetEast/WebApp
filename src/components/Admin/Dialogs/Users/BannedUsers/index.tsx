import React from 'react';
<<<<<<< HEAD
import { Stack, Box } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { PrimaryButton } from 'src/components/Buttons/styles';
import CustomTextField from 'src/components/TextField';
import { AdminUsersItemType } from 'src/types/admin-table-data-types';
import { Icon } from '@iconify/react';

export interface ComponentProps {
    user2Edit: AdminUsersItemType;
    onClose: () => void;
}

const BannedUsers: React.FC<ComponentProps> = ({ user2Edit, onClose }): JSX.Element => {
    return (
        <Stack spacing={3} width={340}>
            <Stack alignItems="center">
                <DialogTitleTypo>{user2Edit.status === 0 ? 'Ban User' : 'Unban User'}</DialogTitleTypo>
            </Stack>
            <Box borderRadius={'50%'} width={80} height={80} overflow="hidden" alignSelf="center">
                {user2Edit.avatar === '' ? (
                    <Icon icon="ph:user" fontSize={80} color="#1890FF" />
                ) : (
                    <img src={user2Edit.avatar} width="100%" height="100%" style={{ objectFit: 'cover' }} alt="" />
                )}
=======
import { Stack, Box, Typography } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { PrimaryButton } from 'src/components/Buttons/styles';
import CustomTextField from 'src/components/TextField';
import { Icon } from '@iconify/react';

export interface ComponentProps {}

const BannedUsers: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Stack spacing={3} width={340}>
            <Stack alignItems="center">
                <DialogTitleTypo>Ban User</DialogTitleTypo>
            </Stack>
            <Box borderRadius={'50%'} width={80} height={80} overflow="hidden" alignSelf="center">
                {/* {user2Edit.avatar === '' ? (
                    <Icon icon="ph:user" fontSize={80} color="#1890FF" />
                ) : (
                    <img src={user2Edit.avatar} width="100%" height="100%" style={{ objectFit: 'cover' }} alt="" />
                )} */}
>>>>>>> e90bfc3 (Ban/Unban users dlg template added)
            </Box>
            <CustomTextField title="USEN NICKNAME" placeholder="JOHN" disabled />
            <CustomTextField title="USER ADDRESS" placeholder="0xcd681b9edcb...4e4ad5e58688168500c346" disabled />
            <CustomTextField title="REMARKS" placeholder="Enter remarks" multiline rows={3} />
            <Stack direction="row" spacing={2}>
<<<<<<< HEAD
                <PrimaryButton btn_color="primary" fullWidth onClick={onClose}>
=======
                <PrimaryButton btn_color="primary" fullWidth>
>>>>>>> e90bfc3 (Ban/Unban users dlg template added)
                    close
                </PrimaryButton>
                <PrimaryButton btn_color="pink" fullWidth>
                    confirm
                </PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default BannedUsers;
