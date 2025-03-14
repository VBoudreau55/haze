import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/index.css";
import { Amplify } from "aws-amplify";
import { AuthProvider } from "react-oidc-context";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./styles/theme";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_ZakuADvHR",
  client_id: "78e46q6f25uu1gahoqbjilqt9c",
  redirect_uri: "https://main.d1sdgkd4wd9p19.amplifyapp.com/",
  response_type: "code",
  scope: "email openid phone",
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
    <CssBaseline />
      <AuthProvider {...cognitoAuthConfig}>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
