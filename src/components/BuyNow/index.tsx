import React from 'react';
import { Button, Box, Grid } from '@mui/material';
import { H2Typography, H3Typography, H4Typography, H5Typography, H6Typography } from 'src/core/typographies';
import { ProductImageContainer } from '../Product/styledComponents';
import { AuthorImage } from './styledComponents';
import StandardTable from '../tables/StandardTable';
import { Flag20Filled, Link20Filled } from '@fluentui/react-icons';

export interface IBuyNowProps {}

const BuyNow: React.FC<IBuyNowProps> = (): JSX.Element => {
    return (
        <Box>
            <Box mb={1} display="flex" justifyContent="space-between">
                <Button variant="outlined">Back</Button>
                <Box display="flex">
                    <Box mr={1}>
                        <Button variant="outlined" sx={{ paddingTop: '9px', paddingBottom: '9px', lineHeight: 1 }}>
                            <Link20Filled />
                            Share
                        </Button>
                    </Box>
                    <Button variant="outlined" sx={{ paddingTop: '4px', paddingBottom: '4px', lineHeight: 1 }}>
                        <Flag20Filled />
                        Flag
                    </Button>
                </Box>
            </Box>
            <H2Typography>Artwork Title</H2Typography>
            <H6Typography>Sold by ElastosArt</H6Typography>

            <ProductImageContainer mt={2}>
                <img src={'https://scalablesolutions.io/wp-content/uploads/2021/03/NFTs.png'} alt="" />
            </ProductImageContainer>

            <H5Typography>
                Project Description. Project Description. Project Description. Project Description. Project Description.
                Project Description. Project Description.
            </H5Typography>

            <Box mt={2}>
                <H6Typography>Price</H6Typography>
                <Box display="flex">
                    <H3Typography>ELA 199.00</H3Typography>
                    <H6Typography>~$860.00</H6Typography>
                </Box>
            </Box>

            <Box pt={1} pb={1}>
                <Button variant="contained">Buy Now</Button>
            </Box>
            <H6Typography>Accepted currencies:</H6Typography>

            <Box mt={3.5}>
                <Box display="flex">
                    <Box>
                        <AuthorImage src="https://miro.medium.com/focal/58/58/50/50/0*sViPWB4sXg5xE1TT" alt="" />
                    </Box>
                    <Box ml={1} display="flex" alignItems="center">
                        <H5Typography>Author's name</H5Typography>
                    </Box>
                </Box>
                <H6Typography>
                    One Sentence Introduction. One Sentence Introduction. One Sentence Introduction.
                </H6Typography>
            </Box>

            <H4Typography mt={6}>Chain Informations</H4Typography>
            <Box mt={1}>
                <Grid container>
                    <Grid item xs={4}>
                        <H6Typography>Chain Name</H6Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <H6Typography>Elastos Smart Chain</H6Typography>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={4}>
                        <H6Typography>Platform ID</H6Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <H6Typography>574</H6Typography>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={4}>
                        <H6Typography>Chain ID</H6Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <H6Typography sx={{ wordWrap: 'break-word', color: 'var(--color-base)' }}>
                            0x0548d861114855da46bcf8739885b4627c2372700fa1a4bdf43e7a2d7e13667d
                        </H6Typography>
                    </Grid>
                </Grid>
            </Box>

            <H4Typography mt={4}>Latest Events</H4Typography>
            <StandardTable
                titles={['TYPE', 'USER', 'PRICE', 'DATE']}
                rows={[
                    ['Sold to', 'Nickname', '8.88ELA', '2022/02/28 10:00'],
                    ['Bid from', 'Nickname', '8.88ELA', '2022/02/28 10:00'],
                    ['Listed by', 'Nickname', '8.88ELA', '2022/02/28 10:00'],
                    ['Minted by', 'Nickname', '8.88ELA', '2022/02/28 10:00'],
                ]}
            />

            <Box textAlign="center" mt={2}>
                <Button variant="outlined">View More...</Button>
            </Box>
        </Box>
    );
};

export default BuyNow;
