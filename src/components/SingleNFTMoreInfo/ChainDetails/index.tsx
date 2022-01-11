import React from 'react';
import { Box, Grid, Typography } from '@mui/material';

interface ComponentProps {
    tokenId: string;
    owner: string;
    createTime: string;
    royalties: string;
}

const ChainDetails: React.FC<ComponentProps> = ({tokenId, owner, royalties, createTime}): JSX.Element => {
    return (
        <Box>
            <Typography fontSize={22} fontWeight={700} sx={{ textTransform: 'capitalize' }}>
                Details
            </Typography>
            <Grid
                container
                rowSpacing={1}
                fontSize={14}
                fontWeight={500}
                padding={4}
                borderRadius={5}
                marginTop={1}
                sx={{ background: '#F0F1F2' }}
            >
                <Grid item xs={5} fontWeight={400}>Chain Name</Grid>
                <Grid item xs={7} textAlign={"right"}>Elastos Smart Chain</Grid>
                <Grid item xs={5} fontWeight={400}>Token Standard</Grid>
                <Grid item xs={7} textAlign={"right"}>ERC1155</Grid>
                <Grid item xs={5} fontWeight={400}>Token ID</Grid>
                <Grid item xs={7} fontSize={12} color={'#1890FF'} textAlign={"right"}>{tokenId}</Grid>
                <Grid item xs={5} fontWeight={400}>Owner</Grid>
                <Grid item xs={7} fontSize={12} color={'#1890FF'} textAlign={"right"}>{owner}</Grid>
                <Grid item xs={5} fontWeight={400}>Created date</Grid>
                <Grid item xs={7} textAlign={"right"}>{createTime}</Grid>
                <Grid item xs={5} fontWeight={400}>Royalties</Grid>
                <Grid item xs={7} textAlign={"right"}>{royalties}%</Grid>
            </Grid>
        </Box>
    );
};

export default ChainDetails;
