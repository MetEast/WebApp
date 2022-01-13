import React, { useState, useEffect } from 'react';
import ModalDialog from 'src/components/ModalDialog';
import ConnectDID from 'src/components/profile/ConnectDID';
import ChooseWallet from 'src/components/profile/ChooseWallet';
import PrivateProfilePage from './profile';

const ProfilePage: React.FC = (): JSX.Element => {
    
    const [step, setStep] = useState<number>(0);
    const handleClick = (newStep: number) => () => {
        setStep(newStep);
    };
    return (
        <>
            {(step === 0 || step === 1) && (
                <ModalDialog open={true} onClose={() => {}}>
                    {step === 0 && <ConnectDID onConnect={handleClick(1)} />}
                    {step === 1 && <ChooseWallet onConnect={handleClick(2)} />}
                </ModalDialog>
            )}
            {step === 2 && <PrivateProfilePage />}
        </>
    );
};

export default ProfilePage;
