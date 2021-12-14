import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button, Grid, styled, TextField } from '@mui/material';
import { H5Typography, H6Typography } from 'src/core/typographies';
import { useState } from 'react';
import { Grid24Filled, GridDots24Filled } from '@fluentui/react-icons';
import { TypeProduct } from 'src/types/product-types';
import { dummyProducts } from 'src/constants/dummyData';
import Product from 'src/components/Product';

const TabNumber = styled(H6Typography)`
    background: var(--color-base);
    border-radius: 12px;
    padding-left: 8px;
    padding-right: 8px;
    margin-left: 4px;
    color: white;
`;

interface ITabPanelProps {
    value: number;
    index: number;
}

const TabPanel: React.FC<ITabPanelProps> = ({ value, index, children, ...other }): JSX.Element => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
};

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function NftTabs() {
    const [value, setValue] = React.useState(0);
    const [productViewMode, setProductViewMode] = useState<'grid1' | 'grid2'>('grid2');

    const productList: Array<TypeProduct> = dummyProducts;

    const handleChange = (event: React.SyntheticEvent<Element, Event>, value: any) => {
        setValue(value);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab
                        label={
                            <Box display="flex">
                                <H5Typography sx={{ fontWeight: 600 }}>ALL</H5Typography>
                                <TabNumber>28</TabNumber>
                            </Box>
                        }
                        {...a11yProps(0)}
                    />
                    <Tab
                        label={
                            <Box display="flex">
                                <H5Typography sx={{ fontWeight: 600 }}>ACQUIRED</H5Typography>
                                <TabNumber>28</TabNumber>
                            </Box>
                        }
                        {...a11yProps(1)}
                    />
                    <Tab
                        label={
                            <Box display="flex">
                                <H5Typography sx={{ fontWeight: 600 }}>CREATED</H5Typography>
                                <TabNumber>28</TabNumber>
                            </Box>
                        }
                        {...a11yProps(2)}
                    />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <Box display="flex">
                    <TextField label="Search" fullWidth />
                    <Box display="flex" alignItems="center">
                        <Box ml={2}>
                            <Grid24Filled
                                onClick={() => setProductViewMode('grid1')}
                                style={{ color: productViewMode === 'grid1' ? 'var(--color-base)' : 'black' }}
                            />
                        </Box>
                        <Box ml={1}>
                            <GridDots24Filled
                                onClick={() => setProductViewMode('grid2')}
                                style={{ color: productViewMode === 'grid2' ? 'var(--color-base)' : 'black' }}
                            />
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
            </TabPanel>
            <TabPanel value={value} index={1}></TabPanel>
            <TabPanel value={value} index={2}></TabPanel>
        </Box>
    );
}
