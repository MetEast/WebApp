import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { Icon } from '@iconify/react';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';

export interface ComponentProps {
    onClose: () => void;
}

const ManageProfile: React.FC<ComponentProps> = ({ onClose }): JSX.Element => {
    const [signedIn, setSignedIn] = React.useState<boolean>(true);

    return (
        <Stack spacing={5} width={{ md: 470 }} paddingY={{ xs: 4, sm: 0 }}>
            <Stack>
                <DialogTitleTypo sx={{ textAlign: 'center' }}>Manage Profile</DialogTitleTypo>
            </Stack>
            <Stack padding={3} borderRadius={6} sx={{ background: '#F0F1F2' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Icon icon="ph:user" fontSize={20} color="black" />
                        <Typography fontSize={14} fontWeight={700} color="black" sx={{ textTransform: 'uppercase' }}>
                            Identity
                        </Typography>
                    </Stack>
                    <PrimaryButton sx={{ height: 32, borderRadius: 2.5, fontSize: 14 }}>
                        {signedIn ? 'sign out' : 'sign in'}
                    </PrimaryButton>
                </Stack>
                {signedIn && (
                    <>
                        <Typography fontSize={18} fontWeight={700} marginTop={3}>
                            Damian Anderson
                        </Typography>
                        <Stack direction="row" spacing={0.5}>
                            <Icon icon="ph:copy" color="#1890FF" style={{ marginTop: '1px', cursor: 'pointer' }} />
                            <Typography fontSize={14} fontWeight={400}>
                                {`did:elastos:${`io2jy4d...JNwDa`}`}
                            </Typography>
                        </Stack>
                    </>
                )}
            </Stack>
            <Stack padding={3} borderRadius={6} sx={{ background: '#F0F1F2' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Icon icon="ph:wallet" fontSize={20} color="black" />
                        <Typography fontSize={14} fontWeight={700} color="black" sx={{ textTransform: 'uppercase' }}>
                            Wallet
                        </Typography>
                    </Stack>
                    <PrimaryButton sx={{ height: 32, borderRadius: 2.5, fontSize: 14 }}>Disconnect</PrimaryButton>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={0.25} marginTop={3}>
                    <img src="/assets/icons/elatos-ela.svg" alt="" style={{ marginBottom: '2px' }} />
                    <Typography fontSize={18} fontWeight={700}>
                        199.00 ELA
                    </Typography>
                </Stack>
                <Stack direction="row" spacing={0.5}>
                    <Icon icon="ph:copy" color="#1890FF" style={{ marginTop: '1px', cursor: 'pointer' }} />
                    <Typography fontSize={14} fontWeight={400}>
                        0x8d1...19Ff
                    </Typography>
                </Stack>
            </Stack>
            <SecondaryButton fullWidth onClick={onClose}>
                Close
            </SecondaryButton>
        </Stack>
    );
};

export default ManageProfile;
