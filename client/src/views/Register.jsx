import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../store/user'
import { registerUser } from '../api/requests/requests'
import { validateEmail } from '../utils/emailValidation'
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';


import {
  Container,
  Grid,
  Typography,
  Box,
  TextField,
  Button,

} from '@mui/material'

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import storage from "../Firebase/Firebase";

const imageMimeType = /image\/(png|jpg|jpeg|gif)/i;

const Register = () => {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [uploadURL, setUploadURL] = useState(null);
  
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


    onSubmitInvalid: false,
});

const navigate = useNavigate();
const dispatch = useDispatch();

useEffect(() => {
  if (user.token) return navigate("/home");
}, [user])

useEffect(() => {
  let fileReader, isCancel = false;
  if (imageUpload) {
    fileReader = new FileReader();
    fileReader.onload = (e) => {
      const { result } = e.target;
      if (result && !isCancel) {
        setUploadURL(result)
        
      }
    }
    fileReader.readAsDataURL(imageUpload);
  }
  return () => {
    isCancel = true;
    if (fileReader && fileReader.readyState === 1) {
      fileReader.abort();
    }
  }
}, [imageUpload])


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
            
        default:
            break;
    }
};

let [usernameSpan, emailSpan, passwordSpan, ] = [null, null, null, null, null];

if ((!form.username.valid && form.username.touched) || (form.onSubmitInvalid && !form.username.valid)) {
    usernameSpan = <span> Please enter a valid username</span>
}

if ((!form.email.valid && form.email.touched) || (form.onSubmitInvalid && !form.email.valid)) {
    emailSpan = <span>Please enter a valid email.</span>
}

if ((!form.password.valid && form.password.touched) || (form.onSubmitInvalid && !form.password.valid)) {
passwordSpan = <span>Your password must contain between 4 and 60 characters.</span>;
}


 // This function will handle the submission.
async function formSubmitHandler(event)  {

  event.preventDefault();
  
   // When a post request is sent to the create url, we'll add a new record to the database.

  if (!form.email.valid || !form.password.valid) {
      setForm((prevForm) => ({ ...prevForm, onSubmitInvalid: true }));
  } else {
      // TODO: handle the data submission
      if (imageUpload == null) return;
      const imageRef = ref(storage, `images/profile/${form.username.value}`);
      uploadBytes(imageRef, imageUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setImageURL(url)
          console.log('Image URL: ' + url)
        });
      })
      
      const newUser = {
          "email" : form.email.value, 
          "username" : form.username.value, 
          "password" : form.password.value,
          "photo": imageURL
      };
      const response = (data) => {
        dispatch(login(data))
        navigate("/home")
    }
    registerUser(newUser, response)
  };
}



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
            Register
        </Typography>
        <Box component="form" onSubmit={formSubmitHandler} noValidate sx={{ mt: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={form.username.value}
              onChange={inputChangeHandler}
            />
            {usernameSpan} 
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
            <Button component="label" sx={{  mt: 3, mb: 2, backgroundColor :'#00CEFB' }}>
              <input hidden accept="image/*" type="file" 
              onChange={(event) => { 
                setImageUpload(null)
                const file = event.target.files[0]
                if (!file.type.match(imageMimeType)) {
                alert("Image is not valid");
                return;
                }
                setImageUpload(file)
                
              }}/>
                <InsertPhotoIcon/>
                Upload Profile Picture
            </Button>
              {uploadURL? 
              <img src={uploadURL} alt='profile' style={{ borderRadius: '100%', border: '1px solid #252525', objectFit: 'cover', width: '250px', height: '250px' }} />
              : null
              }
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container gap= {2}>
              <Grid item xs>
                <Link to="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/login" variant="body2">
                  {"Already have an account? Sign in"}
                </Link>
              </Grid>
            </Grid>
        </Box>
    </Box>
</Container>
  )
};

export default Register;