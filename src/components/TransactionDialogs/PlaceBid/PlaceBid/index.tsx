import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import ELAPriceInput from '../../components/ELAPriceInput';
// import { TypeSelectItem } from 'src/types/select-types';
// import Select from 'src/components/Select';
// import { SelectBtn } from './styles';
// import { Icon } from '@iconify/react';
import { useDialogContext } from 'src/context/DialogContext';
// import { auctionNFTExpirationOptions } from 'src/constants/select-constants';

export interface ComponentProps {}

const PlaceBid: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    // const [expiration, setExpiration] = useState<TypeSelectItem>();
    // const [expirationSelectOpen, setExpirationSelectOpen] = useState(false);
    // const [expirationError, setExpirationError] = useState(false);
    const [bidAmount, setBidAmount] = useState(0);
    const [bidAmountError, setBidAmountError] = useState(false);

    return (
        <Stack spacing={5} width={320} paddingY={6}>
            <Stack alignItems="center">
                <PageNumberTypo>1 of 2</PageNumberTypo>
                <DialogTitleTypo>Place Bid</DialogTitleTypo>
            </Stack>
            <Stack spacing={2}>
                <Stack spacing={1}>
                    <ELAPriceInput
                        title="Bid Amount"
                        inputValue={bidAmount.toString()}
                        error={bidAmountError}
                        // errorText={`Bid amount must be greater than ${
                        //     dialogState.placeBidMinLimit >= dialogState.placeBidLastBid
                        //         ? dialogState.placeBidMinLimit
                        //         : dialogState.placeBidLastBid
                        // }`}
                        minValue={
                            dialogState.placeBidMinLimit >= dialogState.placeBidLastBid
                                ? dialogState.placeBidMinLimit
                                : dialogState.placeBidLastBid
                        }
                        handleChange={(value) => {
                            setBidAmount(value);
                        }}
                    />
                    <Typography fontSize={14} fontWeight={500}>
                        {`Bid amount must be greater than ${
                            dialogState.placeBidMinLimit >= dialogState.placeBidLastBid
                                ? dialogState.placeBidMinLimit
                                : dialogState.placeBidLastBid
                        }.`}
                    </Typography>
                </Stack>
                {/* <Stack spacing={0.5}>
                    <Typography fontSize={12} fontWeight={700}>
                        Bid Expiration
                    </Typography>
                    <Select
                        titlebox={
                            <SelectBtn fullWidth isopen={expirationSelectOpen ? 1 : 0}>
                                {expiration ? expiration.label : 'Select'}
                                <Icon icon="ph:caret-down" className="arrow-icon" />
                            </SelectBtn>
                        }
                        selectedItem={expiration}
                        options={auctionNFTExpirationOptions}
                        isOpen={expirationSelectOpen ? 1 : 0}
                        error={expirationError}
                        errorText="Bid expiration should be selected."
                        handleClick={(value: string) => {
                            const item = auctionNFTExpirationOptions.find((option) => option.value === value);
                            setExpiration(item);
                            setExpirationError(false);
                        }}
                        setIsOpen={setExpirationSelectOpen}
                    />
                </Stack> */}
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <SecondaryButton
                    fullWidth
                    onClick={() => {
                        setDialogState({
                            ...dialogState,
                            placeBidAmount: 0,
                            // placeBidExpire: { label: '', value: '' },
                            // placeBidTxFee: 0,
                            placeBidDlgOpened: false,
                            placeBidName: '',
                            placeBidTxHash: '',
                            placeBidOrderId: '',
                            placeBidMinLimit: 0,
                            placeBidLastBid: -1,
                        });
                    }}
                >
                    close
                </SecondaryButton>
                <PrimaryButton
                    fullWidth
                    onClick={() => {
                        if (bidAmount > dialogState.placeBidMinLimit && bidAmount > dialogState.placeBidLastBid) {
                            setDialogState({
                                ...dialogState,
                                placeBidDlgOpened: true,
                                placeBidDlgStep: 1,
                                placeBidAmount: bidAmount,
                                // placeBidExpire: expiration,
                            });
                        } else {
                            // setExpirationError(expiration === undefined);
                            setBidAmountError(
                                isNaN(bidAmount) ||
                                    bidAmount <= dialogState.placeBidMinLimit ||
                                    bidAmount <= dialogState.placeBidLastBid,
                            );
                        }
                    }}
                >
                    Next
                </PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default PlaceBid;
