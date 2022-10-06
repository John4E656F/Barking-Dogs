import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import Default from '../assets/default.png'
import axios from "../utils/axios"
import FollowButton from './FollowButton'
import { getUser } from '../api/requests/requests'
import {
  Box,
  Typography,
} from '@mui/material'

function FollowUser({ id }) {

    const currentUser = useSelector(state => state.user)
    const [user, setUser] = useState(null)
    const navigate = useNavigate()


    useEffect(() => {
        getUser({ id }, setUser)
    }, [])

    if (!user) return;

    return (
      <Box sx={{ Display: 'flex', justifyContent: 'flex-start', alignItems: 'center', cursor: 'pointer', gap: 2, paddingX: 4, paddingY: 3, marginTop:2, width: 'full', transition: 'all', }}>
        <img src={user.photo ?? Default} onClick={() => navigate(`/${user.username}`)} style={{height: '48px', width: '48px', borderRadius: '100%', alignSelf: 'start'}} alt="" />
        <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left'}}>
               <span onClick={() => navigate(`/${user.username}`)} className='text-sm font-bold hover:underline' > { user.name } </span>
               <span className='text-sm text-[#54595D] ' >@{user.username}</span>
               <span className='text-sm min-h-[20px] ' > {user.description} </span>
         </Box>
           {currentUser.id == user.id ?
               <div></div> :
               <FollowButton user={user} active={user} />
           }
      </Box>
    )
}

export default FollowUser