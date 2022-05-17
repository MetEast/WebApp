import React from 'react';
import { Stack, Button, Typography, Link } from '@mui/material';
import { SpacingProps } from '@mui/system';
import { SocialButton } from './styles';
import { Icon } from '@iconify/react';
import generatedGitInfo from '../../generatedGitInfo.json';

export interface ComponentProps extends SpacingProps {}

const Footer: React.FC<ComponentProps> = ({ ...otherProps }): JSX.Element => {
    const socialButtonsList = [
        { icon: 'ph:telegram-logo', url: 'https://t.me/MetEastofficial' },
        { icon: 'ph:discord-logo', url: 'https://discord.gg/s7DNxA8jd8' },
        { icon: 'ph:twitter-logo', url: 'https://twitter.com/Meteast2022' },
        { icon: 'ph:instagram-logo', url: 'https://www.instagram.com/meteast2022/' },
        { icon: 'carbon:logo-medium', url: 'https://medium.com/@Meteast2022' },
        { icon: 'ph:github-logo', url: 'https://github.com/meteast' },
    ];

    return (
        <Stack spacing={2} {...otherProps}>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems="center"
                rowGap={3}
            >
                <Link href="/">
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <img src="/assets/images/header/logo.svg" width={30} height={28} alt="" />
                        <img src="/assets/images/header/meteast_label.svg" width={126} height={15} alt="" />
                    </Stack>
                </Link>
                <Stack direction="row" spacing={1}>
                    {socialButtonsList.map((item, index) => (
                        <Link href={item.url} target="_blank" key={`social-link-${index}`}>
                            <SocialButton size="small">
                                <Icon icon={item.icon} fontSize={20} />
                            </SocialButton>
                        </Link>
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
                <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" rowGap={0} columnGap={2}>
                    <Link href="../../tokenomics/index.html" target="_blank" sx={{ textDecoration: 'none' }}>
                        <Button
                            sx={{ fontSize: 12, fontWeight: 700, color: { xs: '#1890FF', sm: 'black' }, padding: 1 }}
                        >
                            Tokenomics
                        </Button>
                    </Link>
                    <Link href="../../TermsOfService/TermsOfService.pdf" target='_blank' rel='noopener noreferrer' sx={{ textDecoration: 'none' }}>
                        <Button
                            sx={{ fontSize: 12, fontWeight: 700, color: { xs: '#1890FF', sm: 'black' }, padding: 1 }}
                        >
                            Terms of Service
                        </Button>
                    </Link>
                </Stack>
            </Stack>
        </Stack>
    );
};

export default Footer;
