import React, { useState } from 'react';
import { Stack, TextField, Typography } from '@mui/material';
import { TitleTypography, PageNumberTypography } from '../../styles';
import { IconBtn } from './styles';
import ELAPrice from 'src/components/ELAPrice';
import { Icon } from '@iconify/react';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';

export interface ComponentProps {}

const BuyBlindBox: React.FC<ComponentProps> = (): JSX.Element => {
    const [amount, setAmount] = useState<number>(1);

    return (
        <Stack spacing={5}>
            <Stack alignItems="center">
                <PageNumberTypography>1 of 2</PageNumberTypography>
                <TitleTypography>Buy Blind Box</TitleTypography>
            </Stack>
            <Stack alignItems="center">
                <Typography fontSize={14} fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                    Item
                </Typography>
                <Typography fontSize={18} fontWeight={700}>
                    Blind Box Title
                </Typography>
                <ELAPrice ela_price={199} />
                <Typography fontSize={14} fontWeight={700} marginTop={4} sx={{ textTransform: 'uppercase' }}>
                    Quantity
                </Typography>
                <Stack direction="row" spacing={1} marginTop={1}>
                    <IconBtn
                        onClick={() => {
                            amount >= 1 && setAmount(amount - 1);
                        }}
                    >
                        <Icon icon="ph:minus" color="#1890FF" />
                    </IconBtn>
                    <TextField
                        value={amount}
                        sx={{
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                                width: 60,
                                height: 40,
                                '& fieldset': {
                                    borderWidth: 0,
                                },
                                '&.Mui-focused fieldset': {
                                    borderWidth: 0,
                                },
                                '& input': {
                                    textAlign: 'center',
                                },
                            },
                        }}
                    />
                    <IconBtn
                        onClick={() => {
                            setAmount(amount + 1);
                        }}
                    >
                        <Icon icon="ph:plus" color="#1890FF" />
                    </IconBtn>
                </Stack>
                <Typography fontSize={14} fontWeight={700} marginTop={4} sx={{ textTransform: 'uppercase' }}>
                    Subtotal
                </Typography>
                <ELAPrice ela_price={199} usd_price={480} />
            </Stack>
            <Stack direction="row" spacing={1}>
                <SecondaryButton sx={{ width: 152 }}>close</SecondaryButton>
                <PrimaryButton sx={{ width: 152 }}>Confirm</PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default BuyBlindBox;
