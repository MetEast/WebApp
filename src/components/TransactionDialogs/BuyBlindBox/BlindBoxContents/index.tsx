import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import { useDialogContext } from 'src/context/DialogContext';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { EffectCards } from 'swiper';

export interface ComponentProps {}

const testImages = [
    '/assets/images/blindbox/blindbox-nft-template1.png',
    '/assets/images/blindbox/blindbox-nft-template2.png',
    '/assets/images/blindbox/blindbox-nft-template3.png',
    '/assets/images/blindbox/blindbox-nft-template4.png',
    '/assets/images/avatar-template.png',
];

const BlindBoxContents: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState] = useDialogContext();
    const [imgIndex, setImgIndex] = useState<number>(0);
    const [swiper, setSwiper] = useState<{ slidePrev: () => void; slideNext: () => void }>();

    return (
        <Stack spacing={3} width={320}>
            <Stack alignItems="center">
                <DialogTitleTypo>Blind Box Contents</DialogTitleTypo>
            </Stack>
            <Stack alignItems="center">
                <PageNumberTypo>
                    {imgIndex + 1} of {dialogState.buyBlindAmount}
                    {/* {imgIndex + 1} of {testImages.length} */}
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
                    {/* {testImages.map((item, index) => (
                        <SwiperSlide style={{ borderRadius: 16 }}>
                            <img src={item} width="100%" height="100%" style={{ objectFit: 'cover' }} alt="" />
                        </SwiperSlide>
                    ))} */}
                    {dialogState.buyBlindImages.map((item, index) => (
                        <SwiperSlide>
                            <img
                                src={dialogState.buyBlindImages[imgIndex]}
                                width="100%"
                                height="100%"
                                style={{ objectFit: 'cover' }}
                                alt=""
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <Typography fontSize={18} fontWeight={700} marginTop={2}>
                    {dialogState.buyBlindName}
                </Typography>
                <Typography fontSize={14} fontWeight={400}>
                    created by {dialogState.buyBlindCreator}
                </Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
                <SecondaryButton fullWidth onClick={() => swiper?.slidePrev()}>
                    Previous
                </SecondaryButton>
                <PrimaryButton fullWidth onClick={() => swiper?.slideNext()}>
                    Next
                </PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default BlindBoxContents;
