import React from 'react';
import { Link } from 'react-router-dom';
import { Stack, Button, Typography, Link as ExternalLink } from '@mui/material';
import { SpacingProps } from '@mui/system';
import { SocialButton } from './styles';
import { Icon } from '@iconify/react';
import generatedGitInfo from '../../generatedGitInfo.json';
import { contactConfig } from 'src/config';

export interface ComponentProps extends SpacingProps {}

const Footer: React.FC<ComponentProps> = ({ ...otherProps }): JSX.Element => {
    const socialButtonsList = [
        { icon: 'ph:telegram-logo', url: contactConfig.telegram },
        { icon: 'ph:discord-logo', url: contactConfig.discord },
        { icon: 'ph:twitter-logo', url: contactConfig.twitter },
        { icon: 'ph:instagram-logo', url: contactConfig.instagram },
        { icon: 'carbon:logo-medium', url: contactConfig.medium },
        { icon: 'ph:github-logo', url: contactConfig.github },
    ];

    return (
        <Stack spacing={2} {...otherProps}>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems="center"
                rowGap={3}
            >
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <img src="/assets/images/header/logo.svg" width={30} height={28} alt="" />
                        <img src="/assets/images/header/meteast_label.svg" width={126} height={15} alt="" />
                    </Stack>
                </Link>
                <Stack direction="row" spacing={1}>
                    {socialButtonsList.map((item, index) => (
                        <ExternalLink href={item.url} target="_blank" key={`social-link-${index}`}>
                            <SocialButton size="small">
                                <Icon icon={item.icon} fontSize={20} />
                            </SocialButton>
                        </ExternalLink>
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
                    <Link to="../../tokenomics/index.html" target="_blank" style={{ textDecoration: 'none' }}>
                        <Button
                            sx={{ fontSize: 12, fontWeight: 700, color: { xs: '#1890FF', sm: 'black' }, padding: 1 }}
                        >
                            Tokenomics
                        </Button>
                    </Link>
                    <Link
                        to="../../TermsOfService/TermsOfService.pdf"
                        target="_blank"
                        style={{ textDecoration: 'none' }}
                        rel="noopener noreferrer"
                    >
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
