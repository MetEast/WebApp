import React from 'react';
import { Stack, Box, Grid, Typography } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { Icon } from '@iconify/react';
import { PrimaryButton, SecondaryButton, PinkButton } from 'src/components/Buttons/styles';

export interface ComponentProps {
    onClose: () => void;
}

const EditProfile: React.FC<ComponentProps> = ({ onClose }): JSX.Element => {
    return (
        <Stack spacing={4} width={{ xs: 400, md: 600 }}>
            <Stack>
                <DialogTitleTypo sx={{ textAlign: 'center' }}>Edit Profile</DialogTitleTypo>
            </Stack>
            <Box>
                <Grid container columnSpacing={3} rowSpacing={2}>
                    <Grid item xs={6}>
                        <Stack padding={3} borderRadius={6} sx={{ background: '#F0F1F2' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Icon icon="ph:user" fontSize={20} color="black" />
                                    <Typography
                                        fontSize={14}
                                        fontWeight={700}
                                        color="black"
                                        sx={{ textTransform: 'uppercase' }}
                                    >
                                        Identity
                                    </Typography>
                                </Stack>
                                <PrimaryButton sx={{ height: 32, borderRadius: 2.5, fontSize: 14 }}>
                                    sign out
                                </PrimaryButton>
                            </Stack>
                            <Typography fontSize={14} fontWeight={400} marginTop={3} alignSelf="flex-end">
                                0x8d1...19Ff
                            </Typography>
                            <Typography fontSize={18} fontWeight={700} alignSelf="flex-end">
                                Damian Anderson
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={6}>
                        <Stack padding={3} borderRadius={6} sx={{ background: '#F0F1F2' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Icon icon="ph:wallet" fontSize={20} color="black" />
                                    <Typography
                                        fontSize={14}
                                        fontWeight={700}
                                        color="black"
                                        sx={{ textTransform: 'uppercase' }}
                                    >
                                        Wallet
                                    </Typography>
                                </Stack>
                                <PrimaryButton sx={{ height: 32, borderRadius: 2.5, fontSize: 14 }}>
                                    Disconnect
                                </PrimaryButton>
                            </Stack>
                            <Typography fontSize={14} fontWeight={400} marginTop={3} alignSelf="flex-end">
                                0x8d1...19Ff
                            </Typography>
                            <Stack direction="row" alignItems="center" alignSelf="flex-end" spacing={0.25}>
                                <img src="/assets/icons/elatos-ela.svg" alt="" style={{ marginBottom: '2px' }} />
                                <Typography fontSize={18} fontWeight={700}>
                                    {`199.00 ELA`}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid item xs={6}>
                        <Stack spacing={1}>
                            <Typography fontSize={12} fontWeight={700}>
                                Avatar Picture
                            </Typography>
                            <Box height={156} borderRadius={5} overflow="hidden">
                                <img
                                    src="/assets/images/blindbox/blindbox-nft-template2.png"
                                    alt=""
                                    width="100%"
                                    height="100%"
                                    style={{ objectFit: 'cover' }}
                                />
                            </Box>
                            <Stack direction="row" spacing={1}>
                                <PinkButton fullWidth size="small">
                                    <Icon icon="ph:trash" fontSize={20} style={{ marginBottom: 2, marginRight: 4 }} />
                                    {`Delete`}
                                </PinkButton>
                                <SecondaryButton fullWidth size="small">
                                    <Icon
                                        icon="ph:pencil-simple"
                                        fontSize={20}
                                        style={{ marginBottom: 4, marginRight: 4 }}
                                    />
                                    {`Edit`}
                                </SecondaryButton>
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid item xs={6}>
                        <Stack spacing={1}>
                            <Typography fontSize={12} fontWeight={700}>
                                Cover Picture
                            </Typography>
                            <Box height={156} borderRadius={5} overflow="hidden">
                                <img
                                    src="/assets/images/blindbox/blindbox-nft-template3.png"
                                    alt=""
                                    width="100%"
                                    height="100%"
                                    style={{ objectFit: 'cover' }}
                                />
                            </Box>
                            <Stack direction="row" spacing={1}>
                                <PinkButton fullWidth size="small">
                                    <Icon icon="ph:trash" fontSize={20} style={{ marginBottom: 2, marginRight: 4 }} />
                                    {`Delete`}
                                </PinkButton>
                                <SecondaryButton fullWidth size="small">
                                    <Icon
                                        icon="ph:pencil-simple"
                                        fontSize={20}
                                        style={{ marginBottom: 4, marginRight: 4 }}
                                    />
                                    {`Edit`}
                                </SecondaryButton>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
            <PrimaryButton fullWidth size="small">
                CONFIRM
            </PrimaryButton>
            <Stack direction="row" spacing={2}>
                <SecondaryButton fullWidth size="small">
                    BACK
                </SecondaryButton>
                <PrimaryButton fullWidth size="small">
                    CONFIRM
                </PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default EditProfile;
