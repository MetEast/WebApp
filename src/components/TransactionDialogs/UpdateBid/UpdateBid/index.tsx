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

const UpdateBid: React.FC<ComponentProps> = (): JSX.Element => {
    const [expiration, setExpiration] = useState<TypeSelectItem>();
    const [expirationSelectOpen, setExpirationSelectOpen] = useState(false);
    const [bidAmount, setBidAmount] = useState(0);

    return (
        <Stack spacing={5} width={320} paddingY={6}>
            <Stack alignItems="center">
                <PageNumberTypo>1 of 2</PageNumberTypo>
                <DialogTitleTypo>Update Bid</DialogTitleTypo>
                <Typography fontSize={16} fontWeight={400} marginTop={1}>
                    Current Bid: 16.8 ELA
                </Typography>
            </Stack>
            <Stack spacing={2.5}>
                <ELAPriceInput
                    title="New Bid Amount"
                    handleChange={(value) => {
                        setBidAmount(value);
                    }}
                />
                <Stack spacing={0.5}>
                    <Typography fontSize={12} fontWeight={700}>
                        Expiration
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
                <SecondaryButton fullWidth>close</SecondaryButton>
                <PrimaryButton fullWidth>Next</PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default UpdateBid;
