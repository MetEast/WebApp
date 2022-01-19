import React, { useState } from 'react';
import authAtom from 'src/recoil/auth';
import { useRecoilValue, useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import ModalDialog from 'src/components/ModalDialog';
import ConnectDID from 'src/components/profile/ConnectDID';
// import ChooseWallet from 'src/components/profile/ChooseWallet';
import jwtDecode from 'jwt-decode';
import { DID } from "@elastosfoundation/elastos-connectivity-sdk-js";
import { essentialsConnector, useConnectivitySDK } from 'src/components/ConnectWallet/EssentialConnectivity';

const LoginPage: React.FC = (): JSX.Element => {
    const [showModal, setShowModal] = useState<boolean>(true);
    const [auth, setAuth] = useRecoilState(authAtom);
    const navigate = useNavigate();
    
    useConnectivitySDK();
    
    const handleWalletConnection = async () => {
        const didAccess = new DID.DIDAccess();
        let presentation;
        console.log("Trying to sign in using the connectivity SDK");
        try {
          presentation = await didAccess.requestCredentials({
            claims: [
              DID.simpleIdClaim("Your name", "name", false)
            ]
          });
          console.log("presentation: ", presentation);
        } catch (e) {
          // Possible exception while using wallet connect (i.e. not an identity wallet)
          // Kill the wallet connect session
          console.warn("Error while getting credentials", e);

          try {
            alert("dberror");
            await essentialsConnector.getWalletConnectProvider().disconnect();
          }
          catch (e) {
            console.error("Error while trying to disconnect wallet connect session", e);
          }

          return;
        }

        if (presentation) {
            const did = presentation.getHolder().getMethodSpecificId() || "";
            fetch(`${process.env.REACT_APP_BACKEND_URL || "http://localhost:3006"}/api/v1/login`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(presentation.toJSON())
              }).then(response => response.json()).then(data => {
                if (data.code === 200) {
                  const token = data.data;
  
                  localStorage.setItem("did", did);
                  localStorage.setItem("token", token);
  
                  const user = jwtDecode(token);
                  //
                  
                  console.log("Sign in: setting user to:", user);
                  // setUser(user);
                  setShowModal(false)
                  setAuth({isLoggedIn: true});
                  navigate('/profile');
                } else {
                  console.log(data);
                }
              }).catch((error) => {
                console.log(error);
                // showToast(`Failed to call the backend API. Check your connectivity and make sure ${process.env.REACT_APP_BACKEND_URL || "http://localhost:3001"} is reachable`, "error");
              })
          }
    };

    // const logIn = async() => {
    //   setShowModal(false)
    //   await setAuth({isLoggedIn: true});
    //   navigate('/profile');
    // };
    
    return (
        <ModalDialog
            open={showModal}
            onClose={() => {
                setShowModal(false);
            }}
        >
            <ConnectDID onConnect={handleWalletConnection} />
        </ModalDialog>
    );
};

export default LoginPage;