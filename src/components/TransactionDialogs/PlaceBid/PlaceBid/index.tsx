import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import ELAPriceInput from '../../components/ELAPriceInput';
import { TypeSelectItem } from 'src/types/select-types';
import Select from 'src/components/Select';
import { SelectBtn } from './styles';
import { Icon } from '@iconify/react';
import { useDialogContext } from 'src/context/DialogContext';
import { useSnackbar } from 'notistack';
import { auctionNFTExpirationOptions } from 'src/constants/select-constants';

export interface ComponentProps {}

const PlaceBid: React.FC<ComponentProps> = (): JSX.Element => {
    
    const [dialogState, setDialogState] = useDialogContext();
    const { enqueueSnackbar } = useSnackbar();
    const [expiration, setExpiration] = useState<TypeSelectItem>();
    const [expirationSelectOpen, setExpirationSelectOpen] = useState(false);
    const [bidAmount, setBidAmount] = useState(0);

    return (
        <Stack spacing={5} width={320} paddingY={6}>
            <Stack alignItems="center">
                <PageNumberTypo>1 of 2</PageNumberTypo>
                <DialogTitleTypo>Place Bid</DialogTitleTypo>
            </Stack>
            <Stack spacing={2}>
                <ELAPriceInput
                    title="Bid Amount"
                    handleChange={(value) => {
                        setBidAmount(value);
                    }}
                />
                <Stack spacing={0.5}>
                    <Typography fontSize={12} fontWeight={700}>
                        Category
                    </Typography>
                    <Select
                        titlebox={
                            <SelectBtn fullWidth isopen={expirationSelectOpen ? 1 : 0}>
                                {expiration ? expiration.label : 'Select'}
                                <Icon icon="ph:caret-down" className="arrow-icon" />
                            </SelectBtn>
                        }
                        options={auctionNFTExpirationOptions}
                        isOpen={expirationSelectOpen ? 1 : 0}
                        handleClick={(value: string) => {
                            const item = auctionNFTExpirationOptions.find((option) => option.value === value);
                            setExpiration(item);
                        }}
                        setIsOpen={setExpirationSelectOpen}
                    />
                </Stack>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <SecondaryButton
                    fullWidth
                    onClick={() => {
                        setDialogState({
                            ...dialogState,
                            placeBidAmount: 0,
                            placeBidExpire: { label: '', value: '' },
                            placeBidTxFee: 0,
                            placeBidDlgOpened: false,
                            placeBidName: '',
                            placeBidTxHash: '',
                            placeBidOrderId: 0
                        });
                    }}
                >
                    close
                </SecondaryButton>
                <PrimaryButton
                    fullWidth
                    onClick={() => {
                        if (bidAmount !== 0 && expiration?.value !== undefined && expiration?.value !== '')
                            setDialogState({
                                ...dialogState,
                                placeBidDlgOpened: true,
                                placeBidDlgStep: 1,
                                placeBidAmount: bidAmount,
                                placeBidExpire: expiration
                            });
                        else
                            enqueueSnackbar('Form validation failed!', {
                                variant: 'warning',
                                anchorOrigin: { horizontal: 'right', vertical: 'top' },
                            });
                    }}
                >
                    Next
                </PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default PlaceBid;
