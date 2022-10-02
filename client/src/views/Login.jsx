import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { validateEmail } from "../utils/emailValidation";
import { login } from '../store/user'
import { loginUser } from '../api/requests/requests'
import {
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

    //For setting error spans once any of the fields are touched.
    const fieldBlurHandler = (event) => {
        if (event.target.name === "email") {
            if (form.email.value === "") {
                setForm((prevForm) => ({
                    ...prevForm,
                    email: { ...prevForm.email, touched: true},
                }));
            }
        }

        if (event.target.name === "password") {
            if (form.password.value === "") {
                setForm((prevForm) => ({
                    ...prevForm,
                    password: { ...prevForm.password, touched: true },
                }));
            }
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
            setForm((prevForm) => ({...prevForm, onSubmitnvalid: true}));
        } else {
          const loginUser = {
            "email" : form.email.value, 
            "password" : form.password.value
        };
        const response = (data) => {
          dispatch(login(data))
          navigate("/home")
      }

      loginUser(loginUser, response)
        }
    };

    return (
<Grid container >
        <Grid item xs={7} sx={{ backgroundColor: 'red'}}>
            <Box sx={{width: "100%", height:"100vh", backgroundColor:'blue'}}></Box>
        </Grid>
        <Grid item xs={5} sx={{ 
            display: "flex",
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Grid container  sx={{ paddingBottom: 3, paddingTop: 3, width: "25vw", backgroundColor: 'red', display: 'flex', justifyContent: "center", borderRadius: 5}}>
                <Grid item sx={{marginBottom: 3}}>
                    <Typography>Start Barking Today!</Typography>
                </Grid>
                <Grid container component="form" onSubmit={formSubmitHandler} spacing="10" sx={{
                    display: 'flex', 
                    flexDirection:'column', 
                    flexWrap: 'nowrap', 
                    justifyContent: "center", 
                    alignItems: 'center',
                    }}>

                    <Grid item sx={{display: 'flex', flexDirection: 'column'}}>
                        <TextField
                        name="email"
                        className="textField"
                        label="Email"
                        variant="outlined"
                        type="text"
                        style={{ backgroundColor: '#333'}}
                        color="secondary"
                        value={form.email.value}
                        onChange={inputChangeHandler}
                        onBlur={fieldBlurHandler}
                        autoComplete="off"
                        InputLabelProps={{
                            style: { color: "#8c8c8c" },
                        }}
                        sx={{borderRadius: 2}}/>

                        {emailSpan}
                    </Grid>

                    <Grid item sx={{display: 'flex', flexDirection: 'column'}}>
                        <TextField
                        name="password"
                        className="textField"
                        label="Password"
                        variant="outlined"
                        type="password"
                        style={{ backgroundColor: '#333'}}
                        color="secondary"
                        value={form.password.value}
                        onChange={inputChangeHandler}
                        onBlur={fieldBlurHandler}
                        InputLabelProps={{
                            style: { color: "#8c8c8c" },
                        }}
                        sx={{borderRadius: 2}}/>

                        {passwordSpan}
                    </Grid>
                    <Grid item sx={{marginBottom: 3}}>
                        <Button variant="contained" type="submit" >Signup</Button>
                    </Grid>
                </Grid>
                <Grid item>
                    <Typography><Link to="/signup">You don't have an account?</Link></Typography>
                    
                </Grid>

            </Grid>
            
        </Grid>
    </Grid>         
    );
};

export default Login;
