import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux";
import { 
  Box,
  Avatar,
  Typography,
} from '@mui/material'
import Navbar from '../components/Navbar'
import { getUserbyUsername, getPosts } from '../api/requests/requests';
import { useNavigate, useParams } from 'react-router-dom'
import Compose from '../components/Compose'
import Feed from '../components/Feed'
import Loading from '../components/Loading'
import FollowButton from '../components/FollowButton'

const ProfilePage = () => {
  const currentUser = useSelector(state => state.user)
  const [user, setUser] = useState(null)
  const params = useParams()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selfMode, setSelfMode] = useState(false)
  const [followers, followersCallback] = useState([])
  const [following, followingCallback] = useState([])

  function UserBanner({ banner }) {
    if (banner) {
      return <img src={banner} style={{objectFit: 'cover', height: "100%", width: "100%" }} alt="" />
    } else {
      return null;
    }
  }

  const userManager = async () => {
    const data = await getUserbyUsername({ username: params.username}, setUser)
    if (data) {
      followersCallback(data.followers)
      followingCallback(data.following)
      setUser(data)
      getPosts({ user: data.id }, setPosts, setLoading)
    } else {
        navigate("/home")
    }
  }

  useEffect(() => {
    if (params.username === currentUser.username) {
      setSelfMode(true)
      followersCallback(currentUser.followers)
      followingCallback(currentUser.following)
      setUser(currentUser)
      getPosts({ user: currentUser.id}, setPosts, setLoading)
      return;
    }
    if (user) return;
    userManager()
  }, [params, currentUser])

  return  (
    <>
    <Navbar />


      { user ?
        <Box sx={{ display: 'flex', flexDirection: 'column', alignContent: 'center', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <Box sx={{ width: "100%",  height: "40vh", backgroundColor: 'red'}}>
            <UserBanner banner={user.banner} />
          </Box>
          <Avatar
            src={user.photo}
            alt="alt here"
            sx={{ width: 100, height: 100 }} />
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center'}}>
            <Typography component="h1" variant="h3">{user.username}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
              <Typography component="p" variant="p">Followers: <span style={{color: '#3474b5'}}>{followers.length}</span></Typography>
              <Typography component="p" variant="p">Followings: <span style={{color: '#3474b5'}}>{following.length}</span></Typography>
            </Box>
          </Box>
        <Typography component="p" variant="p">{user.description}</Typography>
        </Box>
        : <Box sx={{ display: 'flex', justifyContent: 'center', }}>
        <Typography component="p" variant="p">User Description here</Typography>
        </Box>
      }

       <Box item sx={{ display: 'flex', flexDirection: 'column', alignContent: 'center', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
      { selfMode ?
        <Compose refresh={userManager}/>
      : <Box sx={{marginY: 2}}> 
          <Box sx={{marginY: 2}}> 
            <FollowButton active={!selfMode} user={user} followersCallback={followersCallback} followingCallback={followingCallback} />
          </Box>
        </Box>
      }  
      
      { loading ?
        <Loading /> :
        posts.map((post, index) => {
          return (
            <Feed key={index} id={post.user} content={post.content} date={post.date} />
          )
        })
        }
        </Box> 
      
    </>
  )
}

export default ProfilePage