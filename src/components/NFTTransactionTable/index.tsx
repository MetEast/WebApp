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
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography fontSize={18} fontWeight={700}>
                    Latest transactions
                </Typography>
                <ViewAllBtn>View ALL</ViewAllBtn>
            </Stack>
            <Grid container alignItems="center" rowSpacing={2} marginTop={0}>
                {transactionsTblColumns.map((item) => (
                    <Grid item xs={item.width} fontSize={14} fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                        {item.value}
                    </Grid>
                ))}
                {transactionsList.map((item) => (
                    <>
                        <Grid item xs={transactionsTblColumns[0].width}>
                            <SingleNFTTransactionType transactionType={item.type} />
                        </Grid>
                        <Grid item xs={transactionsTblColumns[1].width}>
                            <Typography fontSize={16} fontWeight={400}>
                                {item.user}
                            </Typography>
                        </Grid>
                        <Grid item xs={transactionsTblColumns[2].width}>
                            <ELAPrice ela_price={item.price} />
                        </Grid>
                        <Grid item xs={transactionsTblColumns[3].width}>
                            <Typography fontSize={12} fontWeight={500}>
                                {item.time}
                            </Typography>
                        </Grid>
                    </>
                ))}
            </Grid>
        </Box>
    );
};

export default NFTTransactionTable;
