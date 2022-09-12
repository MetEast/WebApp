import React, { useState } from 'react';
import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Icon } from '@iconify/react';
import { DialogTitleTypo, PageNumberTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import { useDialogContext } from 'src/context/DialogContext';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { EffectCards } from 'swiper';
import { reduceUserName } from 'src/services/common';

export interface ComponentProps { }

const BlindBoxContents: React.FC<ComponentProps> = (): JSX.Element => {
    const theme = useTheme();
    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
    const [dialogState, setDialogState] = useDialogContext();
    const [imgIndex, setImgIndex] = useState<number>(0);
    const [swiper, setSwiper] = useState<{ slidePrev: () => void; slideNext: () => void }>();

    return (
        <>
            {matchDownMd && <Box sx={{width: 'inherit'}}>
                <SecondaryButton
                    size="small"
                    sx={{ paddingX: 2.5 }}
                    onClick={() => {
                        setDialogState({
                            ...dialogState,
                            buyBlindBoxDlgOpened: false,
                            buyBlindBoxDlgStep: 0,
                            buyBlindName: '',
                            buyBlindPriceEla: 0,
                            buyBlindPriceUsd: 0,
                            buyBlindAmount: 1,
                            buyBlindBoxId: '',
                            buyBlindMaxPurchases: 0,
                            buyBlindInstock: 0,
                        });
                        window.location.reload();
                    }}
                >
                    <Icon
                        icon="ph:caret-left-bold"
                        fontSize={20}
                        color="#1890FF"
                        style={{ marginLeft: -4, marginRight: 8 }}
                    />
                    Back
                </SecondaryButton>
            </Box>}
            <Stack spacing={3} marginTop={5} width={320}>
                <Stack alignItems="center">
                    <DialogTitleTypo>Mystery Box Contents</DialogTitleTypo>
                </Stack>
                <Stack alignItems="center">
                    <PageNumberTypo>
                        {imgIndex + 1} of {dialogState.buyBlindAmount}
                    </PageNumberTypo>
                    <Swiper
                        effect={'cards'}
                        grabCursor={true}
                        modules={[EffectCards]}
                        onInit={(ev) => {
                            setSwiper(ev);
                        }}
                        onSlideChange={({ activeIndex }) => {
                            setImgIndex(activeIndex);
                        }}
                        className="mySwiper"
                        style={{ width: 240, height: 240 }}
                    >
                        {dialogState.buyBlindImages.map((item, index) => (
                            <SwiperSlide style={{ borderRadius: 16 }} key={index}>
                                <img
                                    src={item}
                                    width="100%"
                                    height="100%"
                                    style={{ objectFit: 'cover' }}
                                    alt=""
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <Typography fontSize={18} fontWeight={700} marginTop={2}>
                        {dialogState.buyBlindNames[imgIndex]}
                    </Typography>
                    <Typography fontSize={14} fontWeight={400}>
                        created by {reduceUserName(dialogState.buyBlindCreators[imgIndex], 4)}
                    </Typography>
                </Stack>
                {dialogState.buyBlindAmount > 1 && (
                    <Stack direction="row" spacing={2}>
                        <SecondaryButton fullWidth disabled={imgIndex === 0} onClick={() => swiper?.slidePrev()}>
                            Previous
                        </SecondaryButton>
                        <PrimaryButton fullWidth disabled={imgIndex + 1 === dialogState.buyBlindAmount} onClick={() => swiper?.slideNext()}>
                            Next
                        </PrimaryButton>
                    </Stack>
                )}
            </Stack>
        </>
    );
};

export default BlindBoxContents;
