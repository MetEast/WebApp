import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import { SaleTypeButton } from './styles';
import ELAPriceInput from '../../components/ELAPriceInput';
import { useDialogContext } from 'src/context/DialogContext';
import DateTimePicker from 'src/components/DateTimePicker/DateTimePicker';

export interface ComponentProps {}

const EnterSaleDetails: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    const [saleType, setSaleType] = useState<'buynow' | 'auction'>('buynow');
    const [saleEnds, setSaleEnds] = useState<string>('');
    const [price, setPrice] = useState<number>(0);
    // const [royalty, setRoyalty] = useState<string>('');
    const [minPrice, setMinPrice] = useState<number>(0);
    const [buyNowPriceError, setBuyNowPriceError] = useState<boolean>(false);
    const [auctionMinumPriceError, setAuctionMinumPriceError] = useState<boolean>(false);
    const [saleEndsError, setSaleEndsError] = useState<number>(0); // 0: no error, 1: not selected, 2: not valid

    const handleNextStep = () => {
        if (
            (saleType === 'buynow' && price > 0) ||
            (saleType === 'auction' && minPrice > 0 && saleEnds && parseInt(saleEnds) * 1e3 > new Date().getTime())
        ) {
            setDialogState({
                ...dialogState,
                sellPrice: price,
                sellMinPrice: minPrice,
                sellSaleEnds: parseInt(saleEnds),
                sellSaleType: saleType,
                createNFTDlgStep: 4,
            });
        } else {
            if (saleType === 'buynow') {
                setBuyNowPriceError(isNaN(price) || price <= 0);
            } else if (saleType === 'auction') {
                setAuctionMinumPriceError(isNaN(minPrice) || minPrice <= 0);
                setSaleEndsError(!saleEnds ? 1 : parseInt(saleEnds) * 1e3 <= new Date().getTime() ? 2 : 0);
            }
        }
    };

    return (
        <Stack spacing={5} width={320}>
            <Stack alignItems="center">
                <PageNumberTypo>1 of 2</PageNumberTypo>
                <DialogTitleTypo>Enter sale details</DialogTitleTypo>
            </Stack>
            <Stack spacing={1}>
                <Stack direction="row" spacing={2}>
                    <SaleTypeButton fullWidth selected={saleType === 'buynow'} onClick={() => setSaleType('buynow')}>
                        Buy now
                    </SaleTypeButton>
                    <SaleTypeButton fullWidth selected={saleType === 'auction'} onClick={() => setSaleType('auction')}>
                        auction
                    </SaleTypeButton>
                </Stack>
                <Typography fontSize={16} fontWeight={400} textAlign="center">
                    {saleType === 'buynow'
                        ? `Your item will be automatically sold to the first buyer.`
                        : `Your item will be automatically sold to the highest bidder.`}
                </Typography>
                {saleType === 'buynow' && (
                    <>
                        <ELAPriceInput
                            title="Price"
                            inputValue={price.toString()}
                            error={buyNowPriceError}
                            errorText="The price can't be empty."
                            handleChange={(value) => setPrice(value)}
                        />
                        {/* <ELAPriceInput title="Royalties" handleChange={(value) => setRoyalty(value)} /> */}
                    </>
                )}
                {saleType === 'auction' && (
                    <>
                        <ELAPriceInput
                            title="Minimum Price"
                            inputValue={minPrice.toString()}
                            error={auctionMinumPriceError}
                            errorText="Minumum price can't be empty."
                            handleChange={(value) => setMinPrice(value)}
                        />
                        <Stack spacing={0.5}>
                            <Typography fontSize={12} fontWeight={700}>
                                Sale Ends
                            </Typography>
                            <Stack direction="row" spacing={1} justifyContent="space-between" display="flex">
                                <DateTimePicker
                                    onChangeDate={(value: Date) => {
                                        setSaleEnds(parseInt((value.getTime() / 1e3).toString()).toString());
                                        setSaleEndsError(0);
                                    }}
                                    value={!isNaN(parseInt(saleEnds)) ? parseInt(saleEnds) : 0}
                                    error={saleEndsError > 0}
                                />
                            </Stack>
                            {saleEndsError > 0 && (
                                <Typography fontSize={12} fontWeight={500} color="#EB5757">
                                    {saleEndsError === 1
                                        ? 'Sale Ends should be selected.'
                                        : 'Sale Ends should be selected after the current time.'}
                                </Typography>
                            )}
                        </Stack>
                    </>
                )}
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <SecondaryButton
                    fullWidth
                    onClick={() => {
                        setDialogState({
                            ...dialogState,
                            sellSaleType: 'buynow',
                            sellPrice: 0,
                            sellMinPrice: 0,
                            sellSaleEnds: 0,
                            createNFTDlgOpened: false,
                        });
                    }}
                >
                    close
                </SecondaryButton>
                <PrimaryButton fullWidth onClick={handleNextStep}>
                    Next
                </PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default EnterSaleDetails;
