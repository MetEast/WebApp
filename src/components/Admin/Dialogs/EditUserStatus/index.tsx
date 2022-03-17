import React, { useState, useEffect } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { PrimaryButton } from 'src/components/Buttons/styles';
import CustomTextField from 'src/components/TextField';
import { AdminUsersItemType } from 'src/types/admin-table-data-types';
import { updateUserRole } from 'src/services/fetch';
import { useSignInContext } from 'src/context/SignInContext';

export interface ComponentProps {
    user2Edit: AdminUsersItemType;
    handleUserUpdate: (value: AdminUsersItemType) => void;
    onClose: () => void;
}

const EditUserStatus: React.FC<ComponentProps> = ({ user2Edit, handleUserUpdate, onClose }): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [onProgress, setOnProgress] = useState<boolean>(false);
    const [userStatus, setUserStatus] = useState<'user' | 'admin' | 'ban'>(
        user2Edit.status <= 1 ? 'admin' : user2Edit.status === 2 ? 'user' : 'ban',
    );
    const [remarks, setRemarks] = useState<string>(user2Edit.remarks);

    const [type, setType] = useState<number>(0); //0: ban general user, 1: unban general user, 2: add admin, 3: remove admin

    const handleUpdateUserRole = async () => {
        setOnProgress(true);
        const role = userStatus === 'admin' ? 1 : userStatus === 'user' ? 2 : 3;
        await updateUserRole(signInDlgState.token, user2Edit.wholeAddress, role, remarks);
        setOnProgress(false);
        const updatedUserInfo: AdminUsersItemType = { ...user2Edit, status: Math.abs(role - 1), remarks: remarks };
        handleUserUpdate(updatedUserInfo);
        onClose();
    };

    return (
        <Stack spacing={3} width={340}>
            <Stack alignItems="center">
                <DialogTitleTypo>Edit User Status</DialogTitleTypo>
            </Stack>
            <Box borderRadius={'50%'} width={80} height={80} overflow="hidden" alignSelf="center">
                <img src={user2Edit.avatar} width="100%" height="100%" style={{ objectFit: 'cover' }} alt="" />
            </Box>
            <CustomTextField title="USEN NICKNAME" inputValue={user2Edit.username} disabled />
            <CustomTextField title="USER ADDRESS" inputValue={user2Edit.address} disabled />
            {/* <Stack spacing={0.5}>
                <Typography fontSize={12} fontWeight={700}>
                    STATUS
                </Typography>
                <Stack direction="row" spacing={1}>
                    <PrimaryButton
                        size="small"
                        fullWidth
                        btn_color={userStatus === 'user' ? 'primary' : 'secondary'}
                        onClick={() => setUserStatus('user')}
                    >
                        user
                    </PrimaryButton>
                    <PrimaryButton
                        size="small"
                        fullWidth
                        btn_color={userStatus === 'admin' ? 'primary' : 'secondary'}
                        onClick={() => setUserStatus('admin')}
                    >
                        admin
                    </PrimaryButton>
                    <PrimaryButton
                        size="small"
                        fullWidth
                        btn_color={userStatus === 'ban' ? 'primary' : 'secondary'}
                        onClick={() => setUserStatus('ban')}
                    >
                        ban
                    </PrimaryButton>
                </Stack>
            </Stack> */}
            <CustomTextField
                title="REMARKS"
                placeholder="Enter remarks"
                multiline
                rows={3}
                inputValue={remarks}
                changeHandler={(value: string) => setRemarks(value)}
            />
            {/* <Stack direction="row" spacing={2}>
                <PrimaryButton btn_color="secondary" fullWidth onClick={onClose}>
                    close
                </PrimaryButton>
                <PrimaryButton btn_color="pink" fullWidth disabled={onProgress} onClick={handleUpdateUserRole}>
                    Confirm
                </PrimaryButton>
            </Stack> */}
            <Stack spacing={2}>
                {type === 0 && (
                    <PrimaryButton btn_color="pink" fullWidth>
                        ban general user
                    </PrimaryButton>
                )}
                {type === 1 && (
                    <PrimaryButton btn_color="secondary" fullWidth>
                        unban general user
                    </PrimaryButton>
                )}
                {type === 2 && (
                    <>
                        <PrimaryButton btn_color="green" fullWidth>
                            add admin
                        </PrimaryButton>
                        <PrimaryButton btn_color="pink" fullWidth>
                            ban general user
                        </PrimaryButton>
                    </>
                )}
                {type === 3 && (
                    <PrimaryButton btn_color="pink" fullWidth>
                        remove admin
                    </PrimaryButton>
                )}
            </Stack>
        </Stack>
    );
};

export default EditUserStatus;
