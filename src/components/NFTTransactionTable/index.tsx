import React, { useState, useEffect } from 'react';
import { Box, Stack, Grid, Typography } from '@mui/material';
import { ViewAllBtn } from './styles';
import { enumTransactionType, TypeNFTTransaction } from 'src/types/product-types';
import SingleNFTTransactionType from 'src/components/SingleNFTTransactionType';
import ELAPrice from 'src/components/ELAPrice';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDialogContext } from 'src/context/DialogContext';
import Username from 'src/components/Username';

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
    const theme = useTheme();
    const matchDownSm = useMediaQuery(theme.breakpoints.down('sm'));
    const priceAlign = matchDownSm ? true : false;
    const [dialogState, setDialogState] = useDialogContext();
    const [transactions, setTransactions] = useState<Array<TypeNFTTransaction>>(transactionsList.slice(0, 5));

    useEffect(() => {
        setTransactions(transactionsList.slice(0, 5));
    }, [transactionsList]);

    return (
        <Box>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography fontSize={22} fontWeight={700}>
                    Latest transactions
                </Typography>
                <ViewAllBtn
                    onClick={() => {
                        if (
                            transactionsList.length &&
                            transactionsList[transactionsList.length - 1].type === enumTransactionType.CreatedBy
                        )
                            setDialogState({
                                ...dialogState,
                                allTxDlgOpened: true,
                                allTxNFTCreation: transactionsList[transactionsList.length - 1],
                            });
                        else setDialogState({ ...dialogState, allTxDlgOpened: true });
                    }}
                >
                    View ALL
                </ViewAllBtn>
            </Stack>
            <Grid container alignItems="center" rowSpacing={2} marginTop={0}>
                {transactionsTblColumns.map((item, index) => (
                    <Grid
                        key={index}
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
                {transactions.map((item, index) => (
                    <Grid container item key={index}>
                        <Grid item xs={6} sm={transactionsTblColumns[0].width} order={{ xs: 3, sm: 1 }}>
                            <SingleNFTTransactionType transactionType={item.type} transactionHash={item.txHash} />
                        </Grid>
                        <Grid
                            item
                            xs={6}
                            sm={transactionsTblColumns[1].width}
                            order={{ xs: 4, sm: 2 }}
                            textAlign={{ xs: 'right', sm: 'left' }}
                        >
                            <Username username={item.user} fontSize={16} fontWeight={400} />
                        </Grid>
                        <Grid
                            item
                            xs={6}
                            sm={transactionsTblColumns[2].width}
                            order={{ xs: 2, sm: 3 }}
                            textAlign={{ xs: 'right', sm: 'left' }}
                        >
                            <ELAPrice price_ela={item.price} price_ela_fontsize={14} alignRight={priceAlign} />
                        </Grid>
                        <Grid item xs={6} sm={transactionsTblColumns[3].width} order={{ xs: 1, sm: 4 }}>
                            <Typography fontSize={12} fontWeight={500}>
                                {item.time}
                            </Typography>
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default NFTTransactionTable;
