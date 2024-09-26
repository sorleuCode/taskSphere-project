import React from 'react'
import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import theme from "./theme";
import { store } from "./redux/store/store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@stream-io/video-react-sdk/dist/css/styles.css";

import "./index.css";

import { ConfirmProvider } from "material-ui-confirm";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import firebase from "firebase/compat/app";
import firebaseConfig from "./utils/cloudStorage";

const app = firebase.initializeApp(firebaseConfig);



ReactDOM.createRoot(document.getElementById("root")).render(
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
          <ToastContainer position="top-right" theme="colored" />

      </ConfirmProvider>
    </CssVarsProvider>
  </Provider>
);
