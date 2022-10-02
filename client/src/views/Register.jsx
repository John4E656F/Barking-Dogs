import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../store/user'
import { registerUser } from '../api/requests/requests'
import { validateEmail } from '../utils/emailValidation'

import {
  Grid,
  Typography,
  Box,
  TextField,
  Button,
} from '@mui/material'

const Register = () => {
  const user = useSelector(state => state.user)
  const [form, setForm] = useState({
    email: {
        value: "",
        touched: false,
        valid: false,
    },
    username: {
        value: "",
        touched: false,
        valid: false,
    },
    password: {
        value: "",
        touched: false,
        valid: false,
    },
    repeatPassword: {
        value: "",
        touched: false,
        valid: false,
    },

    onSubmitInvalid: false,
});

const navigate = useNavigate();
const dispatch = useDispatch();

useEffect(() => {
  if (user.token) return navigate("/home");
}, [user])

const inputChangeHandler = (event) => {
    const { name, value } = event.target;
    switch (name) {
        case "username":
            setForm((prevForm) => ({
                ...prevForm,
                username: {
                    ...prevForm.username,
                    value: value,
                    touched: true,
                    valid: value.length >= 4 && value.length <= 60,
                },
            }));
            break;
        case "email":
            setForm((prevForm) => ({
                ...prevForm,
                email: {
                    ...prevForm.email,
                    value: value,
                    touched: true,
                    valid: value.length > 0 && validateEmail(value),
                },
            }));
            break;

        case "password":
            setForm((prevForm) => ({
                ...prevForm,
                password: {
                    ...prevForm.password,
                    value: value,
                    touched: true,
                    valid: value.length >= 4 && value.length <= 60,
                },
            }));
            break;

        case "repeatPassword":
            setForm((prevForm) => ({
                ...prevForm,
                 repeatPassword: {
                    ...prevForm.repeatPassword,
                    value: value,
                    touched: true,
                    valid: value === form.password.value,
                 },
            }));
            break;
        default:
            break;
    }
};

const fieldBlurHandler = (event) => {
    if (event.target.name === "email") {
        if (form.email.value === "") {
            setForm((prevForm) => ({
                ...prevForm,
                email: { ...prevForm.email, touched: true },
            }));
        }
    }

    if(event.target.name === "password") {
        if (form.password.value === "") {
            setForm((prevForm) => ({
                ...prevForm,
                password: { ...prevForm.password, touched: true },
            }));
        }
    }

    if (event.target.name === "repeatPassword") {
        if (form.repeatPassword.value === "") {
            setForm((prevForm) => ({
                ...prevForm,
                repeatPassword: { ...prevForm.repeatPassword, touched: true },
            }));
        }
    }
};

let [usernameSpan, emailSpan, passwordSpan, repeatPasswordSpan] = [null, null, null, null, null];

if ((!form.username.valid && form.username.touched) || (form.onSubmitInvalid && !form.username.valid)) {
    usernameSpan = <span> Please enter a valid username</span>
}

if ((!form.email.valid && form.email.touched) || (form.onSubmitInvalid && !form.email.valid)) {
    emailSpan = <span>Please enter a valid email.</span>
}

if ((!form.password.valid && form.password.touched) || (form.onSubmitInvalid && !form.password.valid)) {
passwordSpan = <span>Your password must contain between 4 and 60 characters.</span>;
}

if (
    (!form.repeatPassword.valid && form.repeatPassword.touched) ||
    (form.onSubmitInvalid && !form.repeatPassword.valid)
) {
    repeatPasswordSpan = <span>The repeated password must match the password.</span>
}

 // This function will handle the submission.
async function formSubmitHandler(event)  {

    event.preventDefault();
    
     // When a post request is sent to the create url, we'll add a new record to the database.
    
    if (!form.email.valid || !form.password.valid) {
        setForm((prevForm) => ({ ...prevForm, onSubmitInvalid: true }));
    } else {
        // TODO: handle the data submission
        const newUser = {
            "email" : form.email.value, 
            "username" : form.username.value, 
            "password" : form.password.value
        };
        const response = (data) => {
          dispatch(login(data))
          navigate("/home")
      }

      registerUser(newUser, response)
    };
  }


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

                  <Grid item sx={{display: 'flex', flexDirection: 'column', }}>
                      <TextField
            name="username"
            className="textField"
            label="Username"
            variant="outlined"
            type="text"
            style={{ backgroundColor: "#333" }}
            color="secondary"
            value={form.username.value}
            onChange={inputChangeHandler}
            onBlur={fieldBlurHandler}
            autoComplete="off"
            InputLabelProps={{
              style: { color: "#8c8c8c" },
            }}
                      sx={{borderRadius: 2}}/> 

            {usernameSpan} 
                  </Grid>

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

                  <Grid item sx={{display: 'flex', flexDirection: 'column'}}>
                      <TextField
                      name="repeatPassword"
                      className="textField"
                      label="Repeat Your Password"
                      variant="outlined"
                      type="password"
                      style={{ backgroundColor: '#333'}}
                      color="secondary"
                      value={form.repeatPassword.value}
                      onChange={inputChangeHandler}
                      onBlur={fieldBlurHandler}
                      InputLabelProps={{
                          style: { color: "#8c8c8c" },
                      }}
                      sx={{borderRadius: 2}}/>

                      {repeatPasswordSpan}
                  </Grid>
                  <Grid item sx={{marginBottom: 3}}>
                      <Button variant="contained" type="submit" >Signup</Button>
                  </Grid>
              </Grid>
              <Grid item>
                  <Typography><Link to="/login">Already have an account?</Link></Typography>
                    
              </Grid>

          </Grid>
                    
      </Grid>
    </Grid>         
  )
};

export default Register;