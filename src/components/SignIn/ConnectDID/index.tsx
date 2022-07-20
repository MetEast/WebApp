import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import { Typography, Stack, Button } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { SignInState, useSignInContext } from 'src/context/SignInContext';
import { Icon } from '@iconify/react';
import { enumAuthType } from 'src/types/auth-types';

export interface ComponentProps {
    onConnect: (wallet: enumAuthType) => void;
}

const ConnectDID: React.FC<ComponentProps> = ({ onConnect }): JSX.Element => {
    const navigate = useNavigate();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [signInDlgState, setSignInDlgState] = useSignInContext();

    document.addEventListener('keydown', (event) => {
        // Press ESC to go back
        if (event.keyCode === 27) {
            event.preventDefault();
            navigate('/');
        }
    });

    return (
        <Stack alignItems="center" width={360}>
            <SecondaryButton
                size="small"
                onClick={() => {
                    setSignInDlgState((prevState: SignInState) => {
                        const _state = { ...prevState };
                        _state.signInDlgOpened = false;
                        return _state;
                    });
                }}
                sx={{ width: 105, alignSelf: 'flex-start', display: { xs: 'flex', md: 'none' } }}
            >
                <Icon
                    icon="ph:caret-left-bold"
                    fontSize={20}
                    color="#1890FF"
                    style={{ marginLeft: -4, marginRight: 8, marginBottom: 2 }}
                />
                Back
            </SecondaryButton>
            <DialogTitleTypo marginTop={4}>Let's Get Started</DialogTitleTypo>
            <Typography fontSize={16} fontWeight={400} textAlign="center" marginTop={1}>
                Please connect your wallet
            </Typography>
            <Stack width="100%" alignItems="center" spacing={2} paddingX={4} marginTop={5} boxSizing="border-box">
                <PrimaryButton fullWidth onClick={() => onConnect(enumAuthType.ElastosEssentials)}>
                    <img src="/assets/icons/elastos-essential.svg" alt="" style={{ marginRight: 8 }} />
                    {`Elastos Essentials`}
                </PrimaryButton>
                <SecondaryButton fullWidth onClick={() => onConnect(enumAuthType.MetaMask)}>
                    <img src="/assets/icons/metamask.svg" alt="" style={{ marginRight: 8 }} />
                    {`Metamask`}
                </SecondaryButton>
                <Button
                    sx={{ fontSize: 14, fontWeight: 700 }}
                    onClick={() => {
                        setSignInDlgState((prevState: SignInState) => {
                            const _state = { ...prevState };
                            _state.signInDlgOpened = false;
                            _state.downloadEssentialsDlgOpened = true;
                            return _state;
                        });
                    }}
                >
                    don't have a wallet?
                </Button>
                <Typography fontSize={12} fontWeight={500} textAlign="center" color="#A3A9B1">
                    We do not own your private keys and cannot access your funds without your confirmation
                </Typography>
            </Stack>
        </Stack>
    );
};

export default ConnectDID;
