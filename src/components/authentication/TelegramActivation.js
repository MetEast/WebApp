import PropTypes from 'prop-types';
import {
  Dialog, DialogTitle, DialogContent, DialogContentText,
  TextField, DialogActions, Link, Button
} from '@mui/material';
import { useContext, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { api } from '../../config';
import ToastContext from '../../contexts/ToastContext';
import UserContext from '../../contexts/UserContext';
import CopyToClipboard from 'react-copy-to-clipboard';

TelegramActivation.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
};

export default function TelegramActivation({ open, onClose }) {
  const [code, setCode] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const { showToast } = useContext(ToastContext);
  const { user, setUser } = useContext(UserContext);

  const activationMessage = `Hey, I would like to activate my CR community voting account. My DID: ${user.did}`;

  function checkInputAndSubmit() {
    if (!code) {
      return;
    }

    setSubmitting(true);
    fetch(`${api.url}/api/v1/user/setTelegramVerificationCode?code=${code}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "token": localStorage.getItem('token')
      }
    }).then(response => response.json()).then(data => {
      setSubmitting(false);

      if (data.code === 200) {
        console.log(data);

        // Update local user with new active status
        user.active = true;
        setUser(user);

        showToast("Account successfully activated!", "success");
        onClose()
      } else {
        console.error(data);
        showToast("Wrong activation code", "error");
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  const copyActivationMessageToClipboard = () => {
    console.log("Copied");
  }

  return (
    <Dialog open={open} onClose={() => onClose()}>
      <DialogTitle>Activate your account</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <div style={{ padding: "20px" }}>
            <div style={{ marginBottom: "10px" }}>
              1. Please contact <Link href="https://t.me/benjaminpiette" target="_blank">@benjaminpiette</Link> on telegram and request an activation code. Click
              the button below to copy a request message that you can directly paste to the telegram admin.
            </div>
            <div style={{ marginBottom: "10px" }}>
              <CopyToClipboard text={activationMessage} onCopy={copyActivationMessageToClipboard}>
                <Button
                  size="small"
                  type="submit"
                  variant="contained"
                // loading={isSubmitting}
                // onClick={() => { checkInputAndSubmit() }}
                >
                  Copy request message
                </Button>
              </CopyToClipboard>
            </div>
            <div>
              2. When you get a confirmation code, paste it in the box below to activate your account.
            </div>
            <div>
              3. Start voting or create your own proposals.
            </div>
          </div>
        </DialogContentText>
        <TextField
          margin="dense"
          id="code"
          label="Code"
          type="number"
          fullWidth
          variant="standard"
          value={code}
          onChange={(event => { setCode(event.target.value) })}
        />
      </DialogContent>
      <DialogActions>
        {/* <Button onClick={() => { checkInputAndSubmit() }}>Activate</Button> */}
        <LoadingButton
          size="small"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          onClick={() => { checkInputAndSubmit() }}
        >
          Activate
        </LoadingButton>
      </DialogActions>
    </Dialog >
  )
}
