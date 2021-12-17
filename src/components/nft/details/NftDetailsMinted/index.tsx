import React from 'react';
import { Box, Button } from '@mui/material';
import { H5Typography, H2Typography, H4Typography } from 'src/core/typographies';

export interface INftDetailsMintedProps {}

const NftDetailsMinted: React.FC<INftDetailsMintedProps> = (): JSX.Element => {
    return (
        <Box>
            <Box mb={3} display="flex" justifyContent="space-between">
                <Button variant="outlined">Back</Button>
                <Button variant="contained">View File</Button>
            </Box>
            <Box>
                <H2Typography>Project Name</H2Typography>
                <H5Typography>Created by You</H5Typography>
            </Box>
            <Box mt={3}>
                <Button variant="contained" fullWidth>
                    Sell
                </Button>
            </Box>
            <Box mt={10}>
                <H4Typography>Creation Details</H4Typography>

                <Box mt={2.5} display="flex" justifyContent="space-between">
                    <H5Typography sx={{ fontWeight: 600 }}>DATE</H5Typography>
                    <H5Typography>2022/02/28 10:00</H5Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default NftDetailsMinted;
