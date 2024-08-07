import React from 'react'
import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import theme from "./theme";
import { store } from "./redux/store/store";
import { Provider } from "react-redux";
// Cấu hình react-toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

// Cấu hình MUI Dialog
import { ConfirmProvider } from "material-ui-confirm";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import firebase from "firebase/compat/app";
import firebaseConfig from "./utils/cloudStorage";

const app = firebase.initializeApp(firebaseConfig);



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <CssVarsProvider theme={theme}>
        <ConfirmProvider
          defaultOptions={{
            allowClose: false,
            dialogProps: { maxWidth: "xs" },
            buttonOrder: ["confirm", "cancel"],
            cancellationButtonProps: { color: "inherit" },
            confirmationButtonProps: { color: "secondary", variant: "outlined" },
          }}
        >
          <CssBaseline />
          <BrowserRouter>
            <App />
          </BrowserRouter>
          <ToastContainer position="bottom-left" theme="colored" />
        </ConfirmProvider>
      </CssVarsProvider>
    </Provider>
  </React.StrictMode>
);