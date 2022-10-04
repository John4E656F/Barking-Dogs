import React, { useState } from "react";
import { useSelector } from "react-redux";
import { createPost } from '../api/requests/requests'
import {
  Grid,
  Divider,
  TextField,
  Button,
  Avatar,
} from '@mui/material'

const Compose = ({ refresh }) => {

  const [content, setContent] = useState("");
  const user = useSelector(state => state.user)

  const post = () => {
    if (!content || content.length < 3) return;

    const newPost = {
      data: {
        user: user.id,
        date: Date.now(),
        content
      },
      token: user.token
    }

    const response = (data) => {
      document.getElementById("content").value = ""
      setContent("")
      if (data == 'OK') return refresh()
  }

  createPost(newPost, response)
}

  return (
    <Grid container sx={{ 
      borderRadius: 3, 
      paddingTop: 2,
      backgroundColor: '#929292',
      display: 'flex', 
      paddingX: 2,
      }}>
      <Grid container sx={{ display: 'flex', alignItems: 'center', height: '60%', }}>
          <Grid item sx={{ paddingLeft: 2 }}>
              <Avatar 
              alt="alt here" 

              sx={{ width: 50, height: 50 }} 
              />
          </Grid>
          <Grid item xs={11} sx={{ paddingLeft: 2, marginBottom: 1 }}>
              <TextField
                  required
                  name="compose"
                  id="content"
                  placeholder="What's on your mind?"
                  multiline= {true}
                  fullWidth
                  size= "small"
                  rows={3}
                  type="text"
                  onInput={e => setContent(e.target.value)}
              />
          </Grid>
      </Grid>
      <Divider variant="middle" flexItem />
      <Grid item sx={{ paddingBottom: 2, marginLeft: "auto"}}>
          <Button  size='medium' onClick={post} variant="contained" sx={{ marginRight: 1.1}}>Post</Button>
      </Grid>
    </Grid>
  )
}

export default Compose;