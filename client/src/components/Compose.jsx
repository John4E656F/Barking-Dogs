import React, { useState } from "react";
import { useSelector } from "react-redux";
import { createPost } from '../api/requests/requests'
import { storage } from "../Firebase/Firebase";
import InputEmoji from "react-input-emoji";
import {
  Container,
  Box,
  Grid,
  Divider,
  TextField,
  Button,
  Avatar,
} from '@mui/material'
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import SentimentSatisfiedAltOutlinedIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import GifOutlinedIcon from '@mui/icons-material/GifOutlined';
import PollOutlinedIcon from '@mui/icons-material/PollOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

const Compose = ({ refresh }) => {

  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(false);

  const user = useSelector(state => state.user)
  // console.log(user)
  // const handleImage = (e) => {
  //   const file = e.target.files[0]
  //   const reader = new FileReader();
  //   if (file) {
  //     reader.readAsDataURL(file);
  //     setImage(file);
  //   }
  //   reader.onload = (eventResult) => {
  //     setImage(eventResult.target.result);
  //   }
  //   // setShow(true);
  // }
  // console.log(content)
  const post = () => {
    if (!content || content.length < 3) return;
    console.log(content)
    // const uploadTask = storage.ref(`/images/${image.name}`).put(image);
    // //initiates the firebase side uploading
    // uploadTask.on(
    //   "state_changed",
    //   (snapShot) => {
    //     const ps = Math.round(
    //       (snapShot.bytesTransferred / snapShot.totalBytes) * 100
    //     );
    //     setProgress(ps);
    //   }, (error) => {
    //     console.log(error);
    //   } //CONTINUE HERE
    // )
    console.log(user.id)
    console.log(user.username)
    const newPost = {
      data: {
        user: user.id,
        date: Date.now(),
        content
      },
      token: user.token
    }

    const response = (data) => {
      // document.getElementById("content").value = ""
      setContent("")
      if (data === 'OK') return refresh()
  }

  createPost(newPost, response)
}

  return (
    <Container sx={{ 
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      color: '#fff',
      margin: '25px 0',
      padding: '0 20px',
      }}>
        <Box sx={{ display: 'flex', alignContent: 'center', gap: '1rem' }}>
          <Avatar 
          src={user.photo}
          alt="alt here"
          sx={{ width: 48, height: 48 }} 
          />
          <InputEmoji
            required
            value={content}
            onChange={setContent}
            id="content"
            placeholder="What's on your mind?"
            onInput={e => setContent(e.target.value)}
            sx={{ 
              width: '100%',
              background: 'none',
              border: 'none',
              color: '#fff',
              outline: 'none',
              fontFamily: 'Montserrat',
              fontWeight: 'bold',
              borderBottom: '1px solid rgb(75, 75, 75)'
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px', paddingLeft: '3.7rem'}}>
          <label htmlFor="media" sx={{display: 'none'}}>
            <input hidden accept="image/*" multiple type="file" />
            <InsertPhotoIcon/>
          </label>
          <div onClick={() => setShow(true)}>
            <SentimentSatisfiedAltOutlinedIcon sx={{ color: '#1da1f2', cursor: 'pointer' }}/>
          </div>
          <GifOutlinedIcon sx={{ color: '#1da1f2', cursor: 'pointer' }}/>
          <PollOutlinedIcon sx={{ color: '#1da1f2', cursor: 'pointer' }}/>
          <PendingActionsOutlinedIcon sx={{ color: '#1da1f2', cursor: 'pointer' }}/>
          <LocationOnOutlinedIcon sx={{ color: '#1da1f2', cursor: 'pointer' }}/>
          <Button onClick={post} sx={{
            marginLeft: 'auto',
            backgroundColor: '#1da1f2',
            padding: '10px 15px',
            borderRadius: '30px',
            fontFamily: 'Montserrat',
            fontWeight: 'bold',
            color: '#fff'
          }}>
            Post
          </Button>
        </Box>
    </Container>
  )
}

export default Compose;