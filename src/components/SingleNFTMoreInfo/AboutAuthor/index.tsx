import React from 'react';
import { Stack, Typography, Grid, Skeleton } from '@mui/material';
import { reduceHexAddress } from 'src/services/common';
import { Icon } from '@iconify/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyToClipboardButton } from './styles';
import { useSnackbar } from 'notistack';
import Username from 'src/components/Username';

interface ComponentProps {
    name: string;
    description: string;
    img: string;
    address: string;
}

const AboutAuthor: React.FC<ComponentProps> = ({ name, description, img, address }): JSX.Element => {
    const { enqueueSnackbar } = useSnackbar();
    const showSnackBar = () => {
        enqueueSnackbar('Copied to Clipboard!', {
            variant: 'success',
            anchorOrigin: { horizontal: 'right', vertical: 'top' },
        });
    };

    return (
        <Stack spacing={1}>
            <Typography fontSize={{ xs: 18, md: 22 }} fontWeight={700} sx={{ textTransform: 'capitalize' }}>
                Created By
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
                <Grid container columnSpacing={1} rowGap={5}>
                    <Grid item>
                        {img ? (
                            img !== 'default' ? (
                                <img
                                    src={img}
                                    width={40}
                                    height={40}
                                    style={{ borderRadius: '9999px', objectFit: 'cover' }}
                                    alt=""
                                />
                            ) : (
                                <Icon icon="ph:user" width={40} height={40} color="#1890FF" />
                            )
                        ) : (
                            <Skeleton
                                variant="rectangular"
                                animation="wave"
                                width={40}
                                height={40}
                                sx={{ borderRadius: '50%', bgcolor: '#E8F4FF' }}
                            />
                        )}
                    </Grid>
                    <Grid item>
                        <Username username={name} fontSize={16} fontWeight={700} />
                        <Typography fontSize={12} fontWeight={700} color={'#1890FF'}>
                            {reduceHexAddress(address, 4)}
                            <CopyToClipboard text={address} onCopy={address !== '' ? showSnackBar : () => {}}>
                                <CopyToClipboardButton>
                                    <Icon icon="ph:copy" />
                                </CopyToClipboardButton>
                            </CopyToClipboard>
                        </Typography>
                    </Grid>
                </Grid>
            </Stack>
            <Typography fontSize={16} fontWeight={400}>
                {description}
            </Typography>
        </Stack>
    );
};

export default AboutAuthor;
