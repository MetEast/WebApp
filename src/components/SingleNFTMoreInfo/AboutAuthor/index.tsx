import React, { useState } from 'react';
import { Stack, Typography, Grid, Snackbar, Alert } from '@mui/material';
import { reduceHexAddress } from 'src/services/common';
import { Icon } from '@iconify/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyToClipboardButton } from './styles';

interface ComponentProps {
    name: string;
    description: string;
    img: string;
    address: string
}

interface ClipboardProps {
    value: string;
    copied: boolean;
}

const AboutAuthor: React.FC<ComponentProps> = ({name, description, img, address}): JSX.Element => {
    // const [state, setState] = useState<ClipboardProps>({value: '', copied: false});
  
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
                            <CopyToClipboard text={address} onCopy={() => alert("Copied to clipboard")}>
                                <CopyToClipboardButton><Icon icon="ph:copy" className="arrow-icon" /></CopyToClipboardButton>
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
