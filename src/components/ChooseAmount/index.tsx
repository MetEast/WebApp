import { Box, Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import { H3Typography, H2Typography, H5Typography, H6Typography, H4Typography } from 'src/core/typographies';
import { dummyProducts } from 'src/constants/dummyData';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductImage } from './styledComponents';

export interface IChooseAmountProps {}

const ChooseAmount: React.FC<IChooseAmountProps> = (): JSX.Element => {
    const [amount, setAmount] = useState<number>(1);
    const params = useParams();
    const navigate = useNavigate();

    const productId = params.id! as string;

    const product = dummyProducts.find((item) => item.id === productId);

    const handleClickContinue = () => {
        navigate(`/blind-buy-now/${productId}/summary`);
    };

    return (
        <>
            <Box textAlign="center">
                <H3Typography>1/2</H3Typography>
                <H3Typography>Buy Blind Box</H3Typography>
                <H2Typography>Choose Quantity</H2Typography>
            </Box>
            <Box mt={4}>
                <H5Typography sx={{ fontWeight: 700 }}>ITEM</H5Typography>
                <Box display="flex">
                    <Box mr={2}>
                        <ProductImage src={product?.image} alt="" />
                    </Box>
                    <Box>
                        <H6Typography>Collection Name</H6Typography>
                        <H4Typography>{product?.name}</H4Typography>
                        <H5Typography>{`ELA ${product?.price}`}</H5Typography>
                    </Box>
                </Box>
            </Box>
            <Box mt={3.5}>
                <H5Typography sx={{ fontWeight: 700 }}>QUANTITY</H5Typography>
                <Box display="flex" mt={1.5}>
                    <Button
                        variant="contained"
                        onClick={() => {
                            amount >= 1 && setAmount(amount - 1);
                        }}
                    >
                        -
                    </Button>
                    <TextField
                        sx={{ width: '100px', marginRight: '1rem', marginLeft: '1rem' }}
                        type="number"
                        value={amount}
                        disabled
                    />
                    <Button
                        variant="contained"
                        onClick={() => {
                            setAmount(amount + 1);
                        }}
                    >
                        +
                    </Button>
                </Box>
                <Box mt={4.5} display="flex" justifyContent={'space-around'}>
                    <H4Typography>Subtotal</H4Typography>
                    <H4Typography>ELA {product?.price && !isNaN(amount) ? product.price * amount : null}</H4Typography>
                </Box>
                <Box textAlign="center" mt={2}>
                    <H4Typography sx={{ opacity: 0.5 }}>Wallet amount: 8.88</H4Typography>
                </Box>
            </Box>
            <Box mt={4}>
                <Button variant="contained" fullWidth onClick={handleClickContinue}>
                    Continue
                </Button>
            </Box>
        </>
    );
};

export default ChooseAmount;
