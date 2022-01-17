import PropTypes from 'prop-types';
import {
  Dialog, DialogTitle, DialogContent, DialogContentText,
  TextField, DialogActions, Link, Button
} from '@mui/material';
import { useContext, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { DID as ConnDID } from "@elastosfoundation/elastos-connectivity-sdk-js";
import { api, TrustedKYCProviders } from '../../config';
import ToastContext from '../../contexts/ToastContext';
import UserContext from '../../contexts/UserContext';
import CopyToClipboard from 'react-copy-to-clipboard';
import { essentialsConnector } from "../../utils/connectivity";

KYCActivation.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
};

export default function KYCActivation({ open, onClose }) {
  const [code, setCode] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const { showToast } = useContext(ToastContext);
  const { user, setUser } = useContext(UserContext);

  async function checkInputAndSubmit() {
    setSubmitting(true);

    const didAccess = new ConnDID.DIDAccess();
    let presentation;

    console.log("Calling the connectivity SDK to get KYC credentials");
    try {
      presentation = await didAccess.requestCredentials({
        claims: [
          ConnDID.simpleTypeClaim("Your name", "NameCredential", true)
            .withIssuers(TrustedKYCProviders)
            .withNoMatchRecommendations([
              { title: "KYC-me.io", url: "https://kyc-me.io", urlTarget: "internal" }
            ]),
          /* ConnDID.simpleTypeClaim("Your nationality", "NationalityCredential", true).withNoMatchRecommendations([
            { title: "KYC-me.io", url: "https://kyc-me.io", urlTarget: "internal" }
          ]), */
          ConnDID.simpleTypeClaim("Your birth date", "BirthDateCredential", true)
            .withIssuers(TrustedKYCProviders)
            .withNoMatchRecommendations([
              { title: "KYC-me.io", url: "https://kyc-me.io", urlTarget: "internal" }
            ])
        ]
      });
    } catch (e) {
      // Possible exception while using wallet connect (i.e. not an identity wallet)
      // Kill the wallet connect session
      console.warn("Error while requesting credentials", e);

      try {
        await essentialsConnector.getWalletConnectProvider().disconnect();
      }
      catch (e) {
        console.error("Error while trying to disconnect wallet connect session", e);
      }

      return;
    }

    if (presentation) {
      const did = presentation.getHolder().getMethodSpecificId();

      console.log(`Calling the KYC activation api for ${did}`);
      const response = await fetch(`${api.url}/api/v1/user/kycactivation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": localStorage.getItem('token')
        },
        body: JSON.stringify(presentation.toJSON())
      });
      console.log(`KYC activation api response:`, response);

      if (response && response.ok) {
        setSubmitting(false);

        user.active = true;
        setUser(user);

        console.log("User was activated");
        showToast("Account successfully activated!", "success");

        onClose();
      } else {
        if (response)
          console.error(response.statusText, await response.text());
        showToast(`Failed to call the backend API. Check your connectivity and make sure ${api.url} is reachable`, "error");
      }
    }
  }

  return (
    <Dialog open={open} onClose={() => onClose()}>
      <DialogTitle>Activate your account</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <div style={{ padding: "20px" }}>
            <div style={{ marginBottom: "10px" }}>
              Please provide proof of your real identity to get activated and be able to vote or create proposals.
              This proof is provided by specific DID credentials that you can acquire
              from <Link href="https://kyc-me.io" target="_system">the KYC-me App</Link>.
            </div>
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          size="small"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          onClick={() => { checkInputAndSubmit() }}
        >
          Provide identity proof
        </LoadingButton>
      </DialogActions>
    </Dialog >
  )
}
