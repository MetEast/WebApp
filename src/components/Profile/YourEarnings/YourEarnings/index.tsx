import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { SecondaryButton } from 'src/components/Buttons/styles';
import ELAPrice from 'src/components/ELAPrice';
import ProductBadge from 'src/components/ProductBadge';
import { TypeYourEarning } from 'src/types/product-types';
import LooksEmptyBox from 'src/components/Profile/LooksEmptyBox';
import { useStyles } from './styles';

export interface ComponentProps {
    earnings: Array<TypeYourEarning>;
    onClose: () => void;
}

const YourEarnings: React.FC<ComponentProps> = ({ onClose, earnings }): JSX.Element => {
    const classes = useStyles();

    return (
        <Stack
            spacing={5}
            width={{ xs: '100%', md: 520 }}
            height={{ xs: '90vh', sm: 'auto' }}
            maxHeight={{ sm: '70vh' }}
            sx={{
                overflowY: 'auto',
                overflowX: 'hidden',
            }}
            className={classes.earnings_list__container}
        >
            <Stack>
                <DialogTitleTypo sx={{ textAlign: 'center' }}>Your Earnings</DialogTitleTypo>
            </Stack>
            <Stack spacing={3} marginBottom="auto !important">
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
                                        style={{ borderRadius: '100px', objectFit: 'cover' }}
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
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        {item.badges.map((badge, index) => (
                                            <ProductBadge badgeType={badge} />
                                        ))}
                                    </Stack>
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
