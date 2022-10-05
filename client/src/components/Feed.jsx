import { useEffect, useState } from 'react'
import axios from '../utils/axios'
import { useNavigate, Link } from 'react-router-dom'
// import FollowButton from './FollowButton'
import { useSelector } from 'react-redux'
import { getUser } from '../api/requests/requests'
import Moment from "react-moment";
import Default from '../assets/default.jpg'
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import ReplyIcon from '@mui/icons-material/Reply';
import RepeatIcon from '@mui/icons-material/Repeat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';

import {
  Container,
  Box,
  Button,
  Grid,
  Avatar,
  Typography,
} from '@mui/material'

function Feed({ id, username, content, timestamp, likes, image }) {

    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [followers, followersCallback] = useState([])
    const [following, followingCallback] = useState([])
    const currentUser = useSelector(state => state.user)

    const randomNumber = () => {
        return Math.floor(Math.random() * (10000 - 1500) + 1500);
    }

    const userManager = async () => {
        const data = await getUser({ id, username })
        if (data) {
            setUser(data)
            followersCallback(data.followers)
            followingCallback(data.following)
        }
    }

    useEffect(() => {
        if (user) return
        userManager()
    }, [])

    const goPage = () => {
        navigate(`/${user.username}`)
    }
    if (!user) return;

    return (
      <Container sx={{ 
        borderTop: '1px solid rgb(60, 60, 60)',
        padding: '15px',
        display: 'flex', 
        flexDirection: 'column',
        gap: '20px'
        }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px'}}>
          <Avatar 
            alt={user?.photo ? user?.photo : Default}
            onClick={goPage}
            sx={{ width: '48px', height: '48px', cursor: 'pointer' }} 
            />
            <div style={{display: 'flex', alignItems: 'center', gap: '5px', fontSize: '15px', fontWeight: '400px'}}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '15px', fontWeight: '400px'}}>
                <Typography sx={{fontSize: '15px', textTransform: 'lowercase'}}>@{user.username}</Typography> -{" "}
                <Moment fromNow>{timestamp?.toDate()}</Moment>
              </span>
              <Typography sx={{ fontSize: '14xp', marginTop: '5px', fontWeight: '400px'}}> title </Typography>
            </div>
            <Button sx={{ marginLeft: 'auto' }}>
              <MoreHorizOutlinedIcon />
            </Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', width: 'fit', height: '100%', margin: '0 auto'}}>
          <Typography>{content}</Typography>
          <img src={image} alt='title' style={{ borderRadius: '10px', border: '1px solid #252525', objectFit: 'cover', width: '100%', height: '100%'}}/>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-Around' }}>
          <ReplyIcon sx={{ cursor: 'pointer', fontSize: '25px', color: '#afafaf' }}/>
          <RepeatIcon sx={{ cursor: 'pointer', fontSize: '25px', color: '#afafaf' }}/>
          {likes ? (
            <span>
              {" "}
              <FavoriteIcon/>
            </span>
          ) : (
            <span>
              <FavoriteBorderIcon />
            </span>
          )} 
          <ShareIcon />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          {likes && <span style={{marginLeft: '10rem'}}>{likes.length}</span>}
        </Box>
      </Container>
    )
}

export default Feed