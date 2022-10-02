import { useEffect, useState } from 'react'
import axios from '../utils/axios'
import { useNavigate, Link } from 'react-router-dom'
// import FollowButton from './FollowButton'
import { useSelector } from 'react-redux'
import { getUser } from '../api/requests/requests'

import Default from '../assets/default.jpg'

import {
  Grid,
  Avatar,
  Typography,
} from '@mui/material'
import { display } from '@mui/system'

function Feed({ id, content, date }) {

    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [followers, followersCallback] = useState([])
    const [following, followingCallback] = useState([])
    const currentUser = useSelector(state => state.user)

    // const randomNumber = () => {
    //     return Math.floor(Math.random() * (10000 - 1500) + 1500);
    // }

    // const userManager = async () => {
    //     const data = await getUser({ id })
    //     if (data) {
    //         setUser(data)
    //         followersCallback(data.followers)
    //         followingCallback(data.following)
    //     }
    // }

    // useEffect(() => {
    //     if (user) return
    //     userManager()
    // }, [])

    // const goPage = () => {
    //     navigate(`/${user.username}`)
    // }
    // if (!user) return;

    return (
      <Grid container sx={{ 
        borderRadius: 3, 
        marginTop: 2,
        paddingY: 2,
        paddingX: 2,
        backgroundColor: '#929292',
        display: 'flex', 
        flexDirection: 'row'
        }}>
        <Grid item>
          <Avatar 
            alt="alt here" 
            sx={{ width: 50, height: 50 }} 
            />
        </Grid>
        <Grid container xs={11} sx={{ paddingLeft: 2, alignContent: 'center', display:'block',}}>
          <Grid item sx={{ paddingBottom:1, display: 'flex', flexDirection: 'row', gap:1, }}>
            <Typography>Elon Busk</Typography>
            <Typography>@elonbusk</Typography>
          </Grid>
          <Grid item>
            <Typography>text hefe</Typography>
          </Grid>

        </Grid>
      </Grid>
    )
}

export default Feed