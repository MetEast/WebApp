import React from 'react';
import { Stack, Box, Grid, Typography, Checkbox } from '@mui/material';
import { PrimaryButton } from 'src/components/Buttons/styles';
import SearchField from 'src/components/SearchField';
import { TblHeaderTypo, TblBodyTypo } from './styles';

export interface ComponentProps {}

const SearchBlindBoxItems: React.FC<ComponentProps> = (): JSX.Element => {
    const items = [
        { id: '84560673', nft_identity: 'NFT Identity', project_title: 'Project Title', proect_type: 'Project Type' },
        { id: '84560673', nft_identity: 'NFT Identity', project_title: 'Project Title', proect_type: 'Project Type' },
        { id: '84560673', nft_identity: 'NFT Identity', project_title: 'Project Title', proect_type: 'Project Type' },
        { id: '84560673', nft_identity: 'NFT Identity', project_title: 'Project Title', proect_type: 'Project Type' },
        { id: '84560673', nft_identity: 'NFT Identity', project_title: 'Project Title', proect_type: 'Project Type' },
        { id: '84560673', nft_identity: 'NFT Identity', project_title: 'Project Title', proect_type: 'Project Type' },
        { id: '84560673', nft_identity: 'NFT Identity', project_title: 'Project Title', proect_type: 'Project Type' },
        { id: '84560673', nft_identity: 'NFT Identity', project_title: 'Project Title', proect_type: 'Project Type' },
        { id: '84560673', nft_identity: 'NFT Identity', project_title: 'Project Title', proect_type: 'Project Type' },
        { id: '84560673', nft_identity: 'NFT Identity', project_title: 'Project Title', proect_type: 'Project Type' },
        { id: '84560673', nft_identity: 'NFT Identity', project_title: 'Project Title', proect_type: 'Project Type' },
        { id: '84560673', nft_identity: 'NFT Identity', project_title: 'Project Title', proect_type: 'Project Type' },
    ];

    return (
        <Stack spacing={3} width={600} maxHeight={600}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography fontSize={22} fontWeight={700}>
                    Blind Box Items
                </Typography>
                <Box width={300}>
                    <SearchField handleChange={() => {}} />
                </Box>
            </Stack>
            <Box sx={{ overflowY: 'auto', overflowX: 'hidden' }}>
                <Grid container columns={20} columnSpacing={1} rowGap={3} direction="row" alignItems="center">
                    <Grid item xs={1} paddingY={1}>
                        <Checkbox color="primary" indeterminate={true} sx={{ padding: 0 }} />
                    </Grid>
                    <Grid item xs={4} paddingY={1}>
                        <TblHeaderTypo>ID</TblHeaderTypo>
                    </Grid>
                    <Grid item xs={5} paddingY={1}>
                        <TblHeaderTypo>NFT Identity</TblHeaderTypo>
                    </Grid>
                    <Grid item xs={5} paddingY={1}>
                        <TblHeaderTypo>project Title</TblHeaderTypo>
                    </Grid>
                    <Grid item xs={5} paddingY={1}>
                        <TblHeaderTypo>project type</TblHeaderTypo>
                    </Grid>
                    {items.map((item, index) => (
                        <>
                            <Grid item xs={1}>
                                <Checkbox color="primary" sx={{ padding: 0 }} />
                            </Grid>
                            <Grid item xs={4}>
                                <TblBodyTypo>{item.id}</TblBodyTypo>
                            </Grid>
                            <Grid item xs={5}>
                                <TblBodyTypo>{item.nft_identity}</TblBodyTypo>
                            </Grid>
                            <Grid item xs={5}>
                                <TblBodyTypo>{item.project_title}</TblBodyTypo>
                            </Grid>
                            <Grid item xs={5}>
                                <TblBodyTypo>{item.proect_type}</TblBodyTypo>
                            </Grid>
                        </>
                    ))}
                </Grid>
            </Box>
            <PrimaryButton>Confirm</PrimaryButton>
        </Stack>
    );
};

export default SearchBlindBoxItems;
