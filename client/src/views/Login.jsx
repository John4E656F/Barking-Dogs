import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { validateEmail } from "../utils/emailValidation";
import { login } from '../store/user'
import { loginUser } from '../api/requests/requests'
import {
    Container,
    Grid,
    Typography,
    Box,
    TextField,
    Button,
} from '@mui/material'



const Login = (props) => {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        email: {
            value: "",
            touched: false,
            valid: false,
        },

        password: {
            value: "",
            touched: false,
            valid: false,
        },

        onSubmitInvalid: false,
    });

    useEffect(() => {
      if (user.token) return navigate("/home");
    }, [user])

    const inputChangeHandler = (event) => {
        const  { name, value } = event.target;
        if (name === "email") {
			setForm((prevForm) => ({
				...prevForm,
				email: {
					...prevForm.email,
					value: value,
					touched: true,
					valid: value.length > 0 && validateEmail(value),
				},
			}));
        } else if (name === "password") {
			setForm((prevForm) => ({
				...prevForm,
				password: {
					...prevForm.password,
					value: value,
					touched: true,
					valid: value.length >= 4 && value.length <= 60,
				},
			}));
		}  
    };

    let [emailSpan, passwordSpan] = [null, null];

    if ((!form.email.valid && form.email.touched) || (form.onSubmitInvalid && !form.email.valid)) {
        emailSpan = <span>Please enter a valid email or phone number.</span>;
    }

    if((!form.password.valid && form.password.touched) || (form.onSubmitInvalid && !form.password.valid)) {
        passwordSpan = <span>Your password must contain between 4 and 60 characters.</span>
    }

    const formSubmitHandler = (event) => {
        event.preventDefault();
        if (!form.email.valid || !form.password.valid) {
            setForm((prevForm) => ({...prevForm, onSubmitvalid: true}));
        } else {
          const loginDetails = {
            "email" : form.email.value, 
            "password" : form.password.value
        };
        const response = (data) => {
          dispatch(login(data))
          navigate("/home")
      }

      loginUser(loginDetails, response)
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={formSubmitHandler} noValidate sx={{ mt: 1 }}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      value={form.email.value}
                      onChange={inputChangeHandler}
                    />
                    {emailSpan}
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      value={form.password.value}
                      onChange={inputChangeHandler}
                    />
                    {passwordSpan}
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Sign In
                    </Button>
                    <Grid container>
                      <Grid item xs>
                        <Link href="#" variant="body2">
                          Forgot password?
                        </Link>
                      </Grid>
                      <Grid item>
                        <Link href="#" variant="body2">
                          {"Don't have an account? Sign Up"}
                        </Link>
                      </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
