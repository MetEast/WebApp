import React, { useEffect } from 'react';
import { Stack, Box, Button, Typography } from '@mui/material';
import { SpacingProps } from '@mui/system';
import { SocialButton } from './styles';
import { Icon } from '@iconify/react';

export interface ComponentProps extends SpacingProps {}

const Footer: React.FC<ComponentProps> = ({ ...otherProps }): JSX.Element => {
    const socialButtonsList = ['ph:telegram-logo', 'ph:twitter-logo', 'ph:discord-logo', 'ph:github-logo'];

    return (
        <Stack spacing={2} {...otherProps}>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems="center"
                rowGap={3}
            >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <img src="/assets/images/header/logo.svg" alt="" />
                    <img src="/assets/images/header/meteast_label.svg" alt="" />
                </Stack>
                <Stack direction="row" spacing={1}>
                    {socialButtonsList.map((item) => (
                        <SocialButton size="small">
                            <Icon icon={item} fontSize={20} />
                        </SocialButton>
                    ))}
                </Stack>
            </Stack>
            <Stack
                direction={{ xs: 'column-reverse', sm: 'row' }}
                justifyContent="space-between"
                alignItems="center"
                rowGap={3}
            >
                <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Typography fontSize={12} fontWeight={500}>
                        Powered by
                    </Typography>
                    <img src="/assets/icons/elatos-ela.svg" alt="" />
                    <Typography fontSize={12} fontWeight={500}>
                        Elastos
                    </Typography>
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} rowGap={1} columnGap={2}>
                    <Button sx={{ fontSize: 16, fontWeight: 700, color: '#1890FF' }}>Docs</Button>
                    <Button sx={{ fontSize: 16, fontWeight: 700, color: '#1890FF' }}>Privacy policy</Button>
                </Stack>
            </Stack>
        </Stack>
    );
};

export default Footer;
