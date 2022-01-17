import PropTypes from 'prop-types';
// import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import jwtDecode from 'jwt-decode';
import { DID } from "@elastosfoundation/elastos-connectivity-sdk-js";
import { LoadingButton } from '@mui/lab';
import { essentialsConnector } from "../Connectivity";
// import UserContext from "../../../contexts/UserContext";
// import ToastContext from "../../../contexts/ToastContext";

interface ComponentProps {
  action: string;
  title: string;
}

// LoginForm.propTypes = {
//   action: PropTypes.string,
//   title: PropTypes.string
// };

const LoginForm: React.FC<ComponentProps> = ({action, title}) => {
  const navigate = useNavigate();
  // const { setUser } = useContext(UserContext);
  // const { showToast } = useContext(ToastContext);

  const formik = useFormik({
    initialValues: {

    },
    onSubmit: async () => {
      if (action === "signin") {
        const didAccess = new DID.DIDAccess();
        console.log(didAccess);
        let presentation;
        console.log("Trying to sign in using the connectivity SDK");
        try {
          // presentation = await didAccess.requestCredentials({
          //   claims: [
          //     DID.simpleIdClaim("Your name", "name", false)
          //   ]
          // });
          presentation = await didAccess.requestCredentials({
            claims: [
              DID.simpleIdClaim("Your name", "name", false)
            ]
          });
          console.log("------------------presentation", presentation);
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
          fetch(`http://localhost:3006/api/v1/login`,
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

                console.log("Sign in: setting user to:", user);

                // setUser(user);

                formik.setSubmitting(false);

                navigate('/dashboard/home');
              } else {
                console.log(data);
              }
            }).catch((error) => {
              console.log(error);
              // showToast(`Failed to call the backend API. Check your connectivity and make sure ${process.env.REACT_APP_API_URL || "http://localhost:3006"} is reachable`, "error");
            })
        }
      }
      else {
        formik.setSubmitting(false);
        navigate('/dashboard/home');
      }
    }
  });

  const { isSubmitting, handleSubmit } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          {title}
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}

export default LoginForm;