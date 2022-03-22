import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { SecondaryButton } from 'src/components/Buttons/styles';
import ELAPrice from 'src/components/ELAPrice';
import ProductBadge from 'src/components/ProductBadge';
import { TypeYourEarning } from 'src/types/product-types';
import LooksEmptyBox from 'src/components/profile/LooksEmptyBox';

export interface ComponentProps {
    earnings: Array<TypeYourEarning>;
    onClose: () => void;
}

const YourEarnings: React.FC<ComponentProps> = ({ onClose, earnings }): JSX.Element => {
    return (
        <Stack spacing={5} width={{ xs: 360, md: 520 }}>
            <Stack>
                <DialogTitleTypo sx={{ textAlign: 'center' }}>Your Earnings</DialogTitleTypo>
            </Stack>
            <Stack spacing={3} maxHeight={{ xs: 400, md: '100%' }} sx={{ overflowY: 'auto', overflowX: 'hidden' }}>
                {earnings.length === 0 ? (
                    <LooksEmptyBox bannerTitle="Looks Empty Here" />
                ) : (
                    <>
                        {earnings.map((item, index) => (
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                key={`earning-item-${index}`}
                                spacing={3}
                            >
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <img
                                        src={item.avatar}
                                        width={40}
                                        height={40}
                                        style={{ borderRadius: '100px' }}
                                        alt=""
                                    />
                                    <Box>
                                        <Typography fontSize={18} fontWeight={700} sx={{ textTransform: 'capitalize' }}>
                                            {item.title}
                                        </Typography>
                                        <Typography fontSize={14} fontWeight={500}>
                                            {item.time}
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Stack alignItems="flex-end">
                                    <ELAPrice price_ela={item.price} price_ela_fontsize={14} />
                                    <ProductBadge badgeType={item.badge} />
                                </Stack>
                            </Stack>
                        ))}
                    </>
                )}
            </Stack>
            <SecondaryButton fullWidth onClick={onClose}>
                Close
            </SecondaryButton>
        </Stack>
    );
};

export default YourEarnings;
