import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import { SaleTypeButton } from './styles';
import ELAPriceInput from '../../components/ELAPriceInput';
import Select from '../../components/Select';
import { TypeSelectItem } from 'src/types/select-types';
import { useSnackbar } from 'notistack';
import { TypeSaleInputForm } from 'src/types/mint-types';
import { useDialogContext } from 'src/context/DialogContext';

export interface ComponentProps {
    inputData: TypeSaleInputForm;
    setInputData: (value: TypeSaleInputForm) => void;
}

const EnterSaleDetails: React.FC<ComponentProps> = ({inputData, setInputData}): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();

    const saleEndsOptions: Array<TypeSelectItem> = [
        {
            label: '1 month',
            value: '7 month',
        },
        {
            label: '1 week',
            value: '1 week',
        },
        {
            label: '1 day',
            value: '1 day',
        },
    ];

    const [saleType, setSaleType] = useState<'buynow' | 'auction'>('buynow');
    const [saleEnds, setSaleEnds] = useState<TypeSelectItem>();
    const [price, setPrice] = useState<string>('');
    const [royalty, setRoyalty] = useState<string>('');
    const [minPrice, setMinPrice] = useState<string>('');
    const { enqueueSnackbar } = useSnackbar();
    
    const defaultValue: TypeSaleInputForm = {
        saleType: 'buynow',
        price: '',
        royalty: '',
        minPirce: '',
        saleEnds: {label: '', value: ''}
    };

    const handleSaleEndsChange = (value: string) => {
        const item = saleEndsOptions.find((option) => option.value === value);
        setSaleEnds(item);
    };

    const handleNextStep = () => {
        console.log(saleEnds);
        if ((saleType === 'buynow' && price !== '' && royalty !== '') || (saleType === 'auction' && minPrice !== '' && saleEnds?.value !== undefined && saleEnds.value !== '')) {
            if (parseFloat(price) === NaN || parseFloat(royalty) === NaN || parseFloat(minPrice) === NaN) 
                enqueueSnackbar('Not a valid number!', { variant: "warning", anchorOrigin: {horizontal: "right", vertical: "top"} });
            else {
                let tempFormData: TypeSaleInputForm = {...inputData}; 
                tempFormData.price = price;
                tempFormData.royalty = royalty;
                tempFormData.minPirce = minPrice;
                tempFormData.saleEnds = saleEnds || {label: '', value: ''};
                tempFormData.saleType = saleType;
                setInputData(tempFormData);
                setDialogState({ ...dialogState, createNFTDlgOpened: true, createNFTDlgStep: 4 });
            }
        }
        else enqueueSnackbar('Form validation failed!', { variant: "warning", anchorOrigin: {horizontal: "right", vertical: "top"} });
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
                        <ELAPriceInput title="Royalties" handleChange={(value) => setRoyalty(value)} />
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
                                options={saleEndsOptions}
                                selected={saleEnds}
                                placeholder="Select"
                                handleClick={handleSaleEndsChange}
                            />
                        </Stack>
                    </>
                )}
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <SecondaryButton 
                    fullWidth 
                    onClick={ () => {
                        setInputData(defaultValue);
                        setDialogState({ ...dialogState, createNFTDlgOpened: false });
                    }}
                >
                    close
                </SecondaryButton>
                <PrimaryButton fullWidth onClick={handleNextStep}>Next</PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default EnterSaleDetails;
