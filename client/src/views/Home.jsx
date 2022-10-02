import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { getHome } from '../api/requests/requests'

import {
  Grid,
} from '@mui/material'

import Navbar from '../components/Navbar'
import Usercard from '../components/Usercard'
import Compose from '../components/Compose'
import Feed from '../components/Feed'

function Home() {


  const user = useSelector(state => state.user)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const refresh = () => {
    getHome(setPosts, setLoading)
  }

  // useEffect(() => {
  //   if (!user.token) return navigate("/login")
  //   refresh()
  // }, [user])

  // if (!user.token) return;


  return (
    <>
      <Navbar />
      <Grid container> 
        <Grid item xs={3} sx={{marginTop: 5, display: 'flex', justifyContent: 'center' }}>
            <Usercard />
        </Grid>
        <Grid item xs={6} sx={{marginTop: 5, background: 'green', }}>
            <Compose refresh={refresh}/>
            <Feed />
        </Grid>
        <Grid item xs={3} sx={{ background: 'blue' }}>

        </Grid>
      </Grid>
    </>
  )
}

export default Home
