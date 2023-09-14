import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useEffect, useState } from "react";
import GoogleButton from "react-google-button";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Login() {
  const [user, setUser] = useState(null);
  const [emails, setEmails] = useState([]);

  const search = window.location.search;
  const params = new URLSearchParams(search);

  const login = useGoogleLogin({
    onSuccess: (codeResponse: any) => setUser(codeResponse.access_token),
    onError: (error: any) => console.log("Login Failed:", error),
  });

  const getEmails = () => {
    axios
      .get(`https://api.polyverse.app/api/whitelisted-emails/`, {
        headers: {
          Accept: "application/json",
        },
      })
      .then((res) => {
        let emails = res.data;
        setEmails(emails);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getEmails();
  }, []);

  const saveUserProfile = (data: any, token: any, id: any) => {
    axios
      .patch(`https://api.polyverse.app/api/whitelisted-emails/${id}/`, {
        img_url: data.picture,
        name: data.name,
        social_token: token,
      })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        window.location.href = "/talk";
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user}`,
          {
            headers: {
              Authorization: `Bearer ${user}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          for (let i of emails) {
            if (i.email === res.data.email) {
              localStorage.setItem("id", i.id);
              localStorage.setItem("email", res.data.email);
              localStorage.setItem("name", res.data.name);

              saveUserProfile(res.data, user, i.id);
            }
          }
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  const validateToken = (token: string, email: string) => {
    axios
      .post(`https://api.polyverse.app/api/verify-token/`, {
        token: token,
        email: email,
      })
      .then((res) => {
        let data = res.data;
        localStorage.setItem("id", data.id);
        localStorage.setItem("email", data.email);
        window.location.href = "/talk";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const user = localStorage.getItem("id");
    const token = params.get("token");
    const email = params.get("email");
    if (user) {
      window.location.href = "/talk";
    } else {
      if (token && email) {
        validateToken(token, email);
      }
    }
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h2" variant="h4">
            AvatarX
          </Typography>
          <Typography component="h2" variant="h5">
            Sign in
          </Typography>
          <br />
          <br />
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 4 }}
          >
            <GoogleButton onClick={() => login()} />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
