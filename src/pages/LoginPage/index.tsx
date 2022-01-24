import React, { useState } from 'react';
import authAtom from 'src/recoil/auth';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import ModalDialog from 'src/components/ModalDialog';
import ConnectDID from 'src/components/profile/ConnectDID';
// import ChooseWallet from 'src/components/profile/ChooseWallet';
import jwtDecode from 'jwt-decode';
import { DID } from "@elastosfoundation/elastos-connectivity-sdk-js";
import { essentialsConnector, useConnectivitySDK } from 'src/components/ConnectWallet/EssentialConnectivity';
// import { storeWithExpireTime } from 'src/services/common';
import { useCookies } from "react-cookie";

const LoginPage: React.FC = (): JSX.Element => {
    const [tokenCookies, setTokenCookie, removeTokenCookie] = useCookies(["token"]);
    const [didCookies, setDidCookie, removeDidCookie] = useCookies(["did"]);
    const [auth, setAuth] = useRecoilState(authAtom);
    const [showModal, setShowModal] = useState<boolean>(true);
    const navigate = useNavigate();

    // prevent sign-in again after page refresh
    if (localStorage.getItem("token") !== null && localStorage.getItem("did")  !== null) {
      setAuth({isLoggedIn: true});
      navigate('/profile');
    }

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
        } catch (e) {
          // Possible exception while using wallet connect (i.e. not an identity wallet)
          // Kill the wallet connect session
          console.warn("Error while getting credentials", e);

          try {
            await essentialsConnector.getWalletConnectProvider().disconnect();
          }
          catch (e) {
            console.error("Error while trying to disconnect wallet connect session", e);
          }

          return;
        }

        if (presentation) {
            const did = presentation.getHolder().getMethodSpecificId() || "";
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/login`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(presentation.toJSON())
              }).then(response => response.json()).then(data => {
                if (data.code === 200) {
                  const token = data.token;

                  // storeWithExpireTime("did", did, 24 * 3600 * 1000);
                  // storeWithExpireTime("token", token, 24 * 3600 * 1000);
                  // localStorage.setItem("did", did);
                  // localStorage.setItem("token", token);
                  setTokenCookie("token", token, {path: '/'});
                  setDidCookie("did", did, {path: '/'});
  
                  const user = jwtDecode(token);
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
                alert(`Failed to call the backend API. Check your connectivity and make sure ${process.env.REACT_APP_BACKEND_URL} is reachable`);
            });
        }
    };
    
    // const logIn = async () => {
    //     localStorage.setItem("did", "did");
    //     localStorage.setItem("token", "token");
    //     setShowModal(false)
    //     await setAuth({isLoggedIn: true});
    //     navigate('/profile');
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