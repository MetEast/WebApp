import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import { SaleTypeButton, SelectBtn } from './styles';
import ELAPriceInput from '../../components/ELAPriceInput';
import { TypeSelectItem } from 'src/types/select-types';
import { useSnackbar } from 'notistack';
import { useDialogContext } from 'src/context/DialogContext';
import Select from 'src/components/Select';
import { Icon } from '@iconify/react';
import { sellNFTSaleEndsOptions } from 'src/constants/select-constants';

export interface ComponentProps {}

const EnterSaleDetails: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    const [saleType, setSaleType] = useState<'buynow' | 'auction'>('buynow');
    const [saleEnds, setSaleEnds] = useState<TypeSelectItem>();
    const [saleEndsSelectOpen, setSaleEndsSelectOpen] = useState(false);
    const [price, setPrice] = useState<number>(0);
    // const [royalty, setRoyalty] = useState<string>('');
    const [minPrice, setMinPrice] = useState<number>(0);
    const { enqueueSnackbar } = useSnackbar();

    const handleNextStep = () => {
        if (
            (saleType === 'buynow' && price !== null) ||
            (saleType === 'auction' && minPrice !== null && saleEnds?.value !== undefined && saleEnds.value !== '')
        ) {
            if (
                (saleType === 'buynow' && (isNaN(price) || price === 0)) ||
                (saleType === 'auction' && (isNaN(minPrice) || minPrice === 0))
            ) {
                enqueueSnackbar('Invalid number!', {
                    variant: 'warning',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
            } else {
                setDialogState({
                    ...dialogState,
                    sellPrice: price,
                    sellMinPrice: minPrice,
                    sellSaleEnds: saleEnds || { label: '', value: '' },
                    sellSaleType: saleType,
                    createNFTDlgStep: 4,
                });
            }
        } else
            enqueueSnackbar('Form validation failed!', {
                variant: 'warning',
                anchorOrigin: { horizontal: 'right', vertical: 'top' },
            });
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
                    Your item will be automatically sold to the first buyer
                </Typography>
                {saleType === 'buynow' && (
                    <>
                        <ELAPriceInput title="Price" handleChange={(value) => setPrice(value)} />
                        {/* <ELAPriceInput title="Royalties" handleChange={(value) => setRoyalty(value)} /> */}
                    </>
                )}
                {saleType === 'auction' && (
                    <>
                        <ELAPriceInput title="Minimum Price" handleChange={(value) => setMinPrice(value)} />
                        <Stack spacing={0.5}>
                            <Typography fontSize={12} fontWeight={700}>
                                Sale Ends
                            </Typography>
                            <Select
                                titlebox={
                                    <SelectBtn fullWidth isOpen={saleEndsSelectOpen ? 1 : 0}>
                                        {saleEnds ? saleEnds.label : 'Select'}
                                        <Icon icon="ph:caret-down" className="arrow-icon" />
                                    </SelectBtn>
                                }
                                options={sellNFTSaleEndsOptions}
                                isOpen={saleEndsSelectOpen ? 1 : 0}
                                handleClick={(value: string) => {
                                    const item = sellNFTSaleEndsOptions.find((option) => option.value === value);
                                    setSaleEnds(item);
                                }}
                                setIsOpen={setSaleEndsSelectOpen}
                            />
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
                            sellSaleEnds: { label: '', value: '' },
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
