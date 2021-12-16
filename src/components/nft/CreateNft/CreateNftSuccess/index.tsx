import React from 'react';
import { Box, Button } from '@mui/material';
import { H6Typography, H4Typography, H2Typography } from 'src/core/typographies';
import { useNavigate } from 'react-router-dom';

export interface ICreateNftSuccessProps {}

const CreateNftSuccess: React.FC<ICreateNftSuccessProps> = (): JSX.Element => {
    const navigate = useNavigate();

    const handleClickViewOnExplorer = () => {};

    return (
        <Box textAlign="center">
            <H6Typography mt={3} sx={{ fontWeight: 600 }}>
                Success!
            </H6Typography>
            <H2Typography mt={3}>Your NFT has been Minted!</H2Typography>
            <H4Typography mt={2.5} sx={{ fontWeight: 400, lineHeight: '1.5rem' }}>
                Congratulations! Your artwork has officially been minted as NFT on Elastos Smart Chain (ESC)
            </H4Typography>
            <Box mt={2.5} textAlign="center">
                <Button variant="outlined" onClick={handleClickViewOnExplorer}>
                    View on explorer
                </Button>
            </Box>
        </Box>
    );
};

export default CreateNftSuccess;
