import React from 'react';
import { Stack, Box, Grid, Typography } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { Icon } from '@iconify/react';
import { PrimaryButton } from 'src/components/Buttons/styles';
import ELAPrice from 'src/components/ELAPrice';

export interface ComponentProps {
    onClose: () => void;
}

const EditProfile: React.FC<ComponentProps> = ({ onClose }): JSX.Element => {
    return (
        <Stack spacing={5} width={{ xs: 400, md: 600 }}>
            <Stack>
                <DialogTitleTypo sx={{ textAlign: 'center' }}>Edit Profile</DialogTitleTypo>
            </Stack>
            <Box>
                <Grid container columnSpacing={3}>
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
                </Grid>
            </Box>
        </Stack>
    );
};

export default EditProfile;
