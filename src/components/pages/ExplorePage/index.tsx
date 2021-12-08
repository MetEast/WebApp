import { Grid24Filled, GridDots24Filled } from '@fluentui/react-icons';
import { TextField, Box, Grid, Button } from '@mui/material';
import React, { useState } from 'react';
import Product from 'src/components/Product';
import { dummyProducts } from 'src/constants/dummyData';
import { H2Typography } from 'src/core/typographies';
import { TypeProduct } from 'src/types/product-types';

const ExplorePage: React.FC = (): JSX.Element => {
    const [productViewMode, setProductViewMode] = useState<'grid1' | 'grid2'>('grid1');

    const productList: Array<TypeProduct> = dummyProducts;

    return (
        <>
            <H2Typography>Explore</H2Typography>

            <Box display="flex">
                <TextField label="Search" fullWidth />
                <Box display="flex" alignItems="center">
                    <Box ml={2}>
                        <Button
                            onClick={() => setProductViewMode('grid1')}
                            sx={{ color: productViewMode === 'grid1' ? 'var(--color-base)' : 'black' }}
                        >
                            <Grid24Filled />
                        </Button>
                    </Box>
                    <Box>
                        <Button
                            onClick={() => setProductViewMode('grid2')}
                            sx={{ color: productViewMode === 'grid2' ? 'var(--color-base)' : 'black' }}
                        >
                            <GridDots24Filled />
                        </Button>
                    </Box>
                </Box>
            </Box>

            <Grid container mt={2.5} spacing={3}>
                {productList.map((item, index) => (
                    <Grid item xs={productViewMode === 'grid1' ? 12 : 6} key={`explore-product-${index}`}>
                        <Product product={item} />
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default ExplorePage;
