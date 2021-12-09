import React, { useState } from 'react';
import ConnectDID from 'src/components/profile/ConnectDID';
import ConnectWallet from 'src/components/profile/ConnectWallet';
import WalletConnection from 'src/components/profile/WalletConnection';

const ProfilePage: React.FC = (): JSX.Element => {
    const [step, setStep] = useState<number>(0);

    const handleClick = (newStep: number) => () => {
        setStep(newStep);
    };

    return (
        <>
            {step === 0 && <ConnectDID onClickConnect={handleClick(1)} />}
            {step === 1 && <ConnectWallet onClickConnect={handleClick(2)} />}
            {step === 2 && <WalletConnection onClickClose={handleClick(0)} />}
        </>
    );
};

export default ProfilePage;
