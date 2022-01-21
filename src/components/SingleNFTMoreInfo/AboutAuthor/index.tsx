import React from 'react';
import { Stack, Typography, Grid, Snackbar, Alert } from '@mui/material';
import { reduceHexAddress } from 'src/services/common';
import { Icon } from '@iconify/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyToClipboardButton } from './styles';
import { useSnackbar } from 'notistack';


interface ComponentProps {
    name: string;
    description: string;
    img: string;
    address: string
}

const AboutAuthor: React.FC<ComponentProps> = ({name, description, img, address}): JSX.Element => {
    const { enqueueSnackbar } = useSnackbar();
    const showSnackBar = () => {
        enqueueSnackbar('Copied to Clipboard!', { variant: "success", anchorOrigin: {horizontal: "right", vertical: "top"} });
    };

    return (
        <Stack spacing={1}>
            <Typography fontSize={{sm:22, xs:18}} fontWeight={700} sx={{ textTransform: 'capitalize' }}>
                Created By
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
                <Grid container columnSpacing={1} rowGap={5}>
                    <Grid item>
                        <img src={img} width={39} height={39} style={{borderRadius: "9999px"}} alt="" />
                    </Grid>
                    <Grid item>
                        <Typography fontSize={16} fontWeight={700} sx={{ textTransform: 'uppercase' }} >
                            {name}
                        </Typography>
                        <Typography fontSize={12} fontWeight={700} color={"#1890FF"}>                    
                            {reduceHexAddress(address, 4)}
                            <CopyToClipboard text={address} onCopy={showSnackBar}>
                                <CopyToClipboardButton><Icon icon="ph:copy" /></CopyToClipboardButton>
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
