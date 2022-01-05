import React from 'react';
import { Box, Grid, Typography } from '@mui/material';

interface ComponentProps {}

const ChainDetails: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Box>
            <Typography fontSize={22} fontWeight={700} sx={{ textTransform: 'capitalize' }}>
                Chain details
            </Typography>
            <Grid
                container
                rowSpacing={1}
                fontSize={12}
                fontWeight={500}
                padding={4}
                borderRadius={5}
                marginTop={1}
                sx={{ background: '#F0F1F2' }}
            >
                <Grid item xs={5}>
                    Chain name
                </Grid>
                <Grid item xs={7}>
                    Elastos Smart Chain
                </Grid>
                <Grid item xs={5}>
                    Platform ID
                </Grid>
                <Grid item xs={7}>
                    574
                </Grid>
                <Grid item xs={5}>
                    Chain ID
                </Grid>
                <Grid item xs={7} sx={{ overflowWrap: 'break-word' }} color="#1890FF">
                    0x0548d861114855da46bcf8739885b4627c2372700fa1a4bdf43e7a2d7e13667d
                </Grid>
            </Grid>
        </Box>
    );
};

export default ChainDetails;
