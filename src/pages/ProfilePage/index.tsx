import React, { useState } from 'react';
import Notifications from 'src/components/Notifications';
import PrivateProfile from 'src/components/profile/PrivateProfile';
import PrivateProfilePage from './profile';
import ModalDialog from 'src/components/ModalDialog';
import ConnectDID from 'src/components/profile/ConnectDID';
import ConnectWallet from 'src/components/profile/ConnectWallet';
import ChooseWallet from 'src/components/profile/ChooseWallet';

const ProfilePage: React.FC = (): JSX.Element => {
    const [step, setStep] = useState<number>(0);

    const handleClick = (newStep: number) => () => {
        setStep(newStep);
    };

    return (
        <>
            <PrivateProfilePage />
            {/* <ModalDialog open={true} onClose={() => {}}>
                <ConnectDID onClickConnect={() => {}}/>
            </ModalDialog> */}
            {/* <ModalDialog open={true} onClose={() => {}}>
                <ConnectWallet onClickConnect={() => {}} onClickNotifications={() => {}}/>
            </ModalDialog> */}
            {/* <ModalDialog open={true} onClose={() => {}}>
                <ChooseWallet onClickClose={() => {}}/>
            </ModalDialog> */}

            {/* {step === 0 && <WalletConnection onClickClose={handleClick(1)} />}
            {step === 1 && <PrivateProfile onClickNotifications={handleClick(2)} />}
            {step === 2 && <Notifications onClose={handleClick(1)} />} */}
        </>
    );
};

export default ProfilePage;
