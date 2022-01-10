import React from 'react';
import { Box, Stack, Grid, Typography } from '@mui/material';
import { ViewAllBtn } from './styles';
import { TypeNFTTransaction } from 'src/types/product-types';
import SingleNFTTransactionType from 'src/components/SingleNFTTransactionType';
import ELAPrice from 'src/components/ELAPrice';

interface ComponentProps {
    transactionsList: Array<TypeNFTTransaction>;
}

const NFTTransactionTable: React.FC<ComponentProps> = ({ transactionsList }): JSX.Element => {
    const transactionsTblColumns = [
        { value: 'Type', width: 3 },
        { value: 'User', width: 3 },
        { value: 'Price', width: 4 },
        { value: 'Date', width: 2 },
    ];

    return (
        <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" marginTop={5}>
                <Typography fontSize={22} fontWeight={700}>
                    Latest transactions
                </Typography>
                <ViewAllBtn>View ALL</ViewAllBtn>
            </Stack>
            <Grid container alignItems="center" rowSpacing={2} marginTop={0}>
                {transactionsTblColumns.map((item) => (
                    <Grid
                        item
                        xs={item.width}
                        fontSize={14}
                        fontWeight={700}
                        display={{ xs: 'none', sm: 'block' }}
                        sx={{ textTransform: 'uppercase' }}
                    >
                        {item.value}
                    </Grid>
                ))}
                {transactionsList.map((item) => (
                    <Grid container item>
                        <Grid item xs={6} sm={transactionsTblColumns[0].width} order={{ xs: 3, sm: 1 }}>
                            <SingleNFTTransactionType transactionType={item.type} />
                        </Grid>
                        <Grid
                            item
                            xs={6}
                            sm={transactionsTblColumns[1].width}
                            order={{ xs: 4, sm: 2 }}
                            textAlign={{ xs: 'right', sm: 'left' }}
                        >
                            <Typography fontSize={16} fontWeight={400}>
                                {item.user}
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={6}
                            sm={transactionsTblColumns[2].width}
                            order={{ xs: 2, sm: 3 }}
                            textAlign={{ xs: 'right', sm: 'center' }}
                            alignContent={{ xs: 'right', sm: 'center' }}
                        >
                            <ELAPrice ela_price={item.price} />
                        </Grid>
                        <Grid item xs={6} sm={transactionsTblColumns[3].width} order={{ xs: 1, sm: 4 }}>
                            <Typography fontSize={12} fontWeight={500}>
                                {item.time.slice(0, 4) +
                                    '/' +
                                    item.time.slice(5, 7) +
                                    '/' +
                                    item.time.slice(8, 10) +
                                    ' ' +
                                    item.time.slice(11, 13) +
                                    ':' +
                                    item.time.slice(14, 16)}
                            </Typography>
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default NFTTransactionTable;
