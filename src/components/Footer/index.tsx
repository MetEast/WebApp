import React from 'react';
import { Stack, Button, Typography, Link } from '@mui/material';
import { SpacingProps } from '@mui/system';
import { SocialButton } from './styles';
import { Icon } from '@iconify/react';
import generatedGitInfo from '../../generatedGitInfo.json';

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
                <Link href="/">
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <img src="/assets/images/header/logo.svg" alt="" />
                        <img src="/assets/images/header/meteast_label.svg" alt="" />
                    </Stack>
                </Link>
                <Stack direction="row" spacing={1}>
                    {socialButtonsList.map((item, index) => (
                        <SocialButton size="small" key={`social-button-${index}`}>
                            <Icon icon={item} fontSize={20} />
                        </SocialButton>
                    ))}
                </Stack>
            </Stack>
            <Stack
                direction={{ xs: 'column-reverse', sm: 'row' }}
                justifyContent="space-between"
                alignItems="center"
                rowGap={1}
            >
                <Stack direction="row" alignItems="center" spacing={1} position="relative">
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography fontSize={12} fontWeight={500}>
                            Powered by
                        </Typography>
                        <img src="/assets/icons/elatos-ela.svg" alt="" />
                        <Typography fontSize={12} fontWeight={500}>
                            Elastos
                        </Typography>
                    </Stack>
                    <Typography
                        fontSize={12}
                        fontWeight={500}
                        sx={{
                            color: '#1890FF',
                            paddingX: 1,
                            paddingY: 0.5,
                            borderRadius: 2,
                            background: '#E8F4FF',
                        }}
                    >
                        v1 - {generatedGitInfo.gitCommitHash}
                    </Typography>
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} rowGap={0} columnGap={2}>
                    <Button sx={{ fontSize: 12, fontWeight: 700, color: { xs: '#1890FF', sm: 'black' }, padding: 1 }}>
                        Docs
                    </Button>
                    <Button sx={{ fontSize: 12, fontWeight: 700, color: { xs: '#1890FF', sm: 'black' }, padding: 1 }}>
                        Privacy policy
                    </Button>
                </Stack>
            </Stack>
        </Stack>
    );
};

export default Footer;
