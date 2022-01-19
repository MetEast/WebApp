import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { reduceHexAddress } from 'src/services/common';
import { Icon } from '@iconify/react';

interface ComponentProps {
    tokenId: string;
    ownerName: string;
    ownerAddress: string;
    createTime: string;
    royalties: number;
}

const ChainDetails: React.FC<ComponentProps> = ({tokenId, ownerName, ownerAddress, royalties, createTime}): JSX.Element => {
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
                <Grid item xs={7} fontSize={12} color={'#1890FF'} textAlign={"right"}>
                    {reduceHexAddress(tokenId, 5)}
                    <Icon icon="ph:caret-down" className="arrow-icon" />
                </Grid>
                <Grid item xs={5} fontWeight={400}>Owner</Grid>
                <Grid container item xs={7}>
                    <Grid item xs={12} textAlign={"right"}>{ownerName}</Grid>
                    <Grid item xs={12} fontSize={12} color={'#1890FF'} textAlign={"right"}>{reduceHexAddress(ownerAddress, 4)}</Grid>
                </Grid>
                <Grid item xs={5} fontWeight={400}>Created date</Grid>
                <Grid item xs={7} textAlign={"right"}>{createTime}</Grid>
                <Grid item xs={5} fontWeight={400}>Royalties</Grid>
                <Grid item xs={7} textAlign={"right"}>{royalties}%</Grid>
            </Grid>
        </Box>
    );
};

export default ChainDetails;
