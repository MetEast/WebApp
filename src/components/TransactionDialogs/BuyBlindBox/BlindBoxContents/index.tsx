import React, {useState} from 'react';
import { Stack, Typography, Box } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import { useDialogContext } from 'src/context/DialogContext';

export interface ComponentProps {}

const BlindBoxContents: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState] = useDialogContext();
    const [imgIndex, setImgIndex] = useState<number>(1);

    return (
        <Stack spacing={3} width={320}>
            <Stack alignItems="center">
                <DialogTitleTypo>Blind Box Contents</DialogTitleTypo>
            </Stack>
            <Stack alignItems="center">
                <PageNumberTypo>{imgIndex} of {dialogState.buyBlindAmount}</PageNumberTypo>
                <Box borderRadius={4} overflow="hidden">
                    <img src={dialogState.buyBlindImages[imgIndex - 1]} alt="" />
                </Box>
                <Typography fontSize={18} fontWeight={700} marginTop={2}>
                    {dialogState.buyBlindName}
                </Typography>
                <Typography fontSize={14} fontWeight={400}>
                    created by {dialogState.buyBlindCreator}
                </Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
                <SecondaryButton
                    fullWidth
                    onClick={() => {
                        if(imgIndex > 1) setImgIndex(imgIndex - 1);
                    }}
                >
                    Previous
                </SecondaryButton>
                <PrimaryButton
                    fullWidth
                    onClick={() => {
                        if(imgIndex < dialogState.buyBlindAmount) setImgIndex(imgIndex + 1);
                    }}
                >
                    Next
                </PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default BlindBoxContents;
