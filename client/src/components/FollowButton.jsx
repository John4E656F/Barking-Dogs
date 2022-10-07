import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../store/user";
import axios from "../utils/axios";
import { followUser } from '../api/requests/requests'
import {
    Box,
    Button,
} from '@mui/material'

function App({ active, user, followersCallback, followingCallback }) {

    const [fLoading, setfLoading] = useState(false)
    const [text, setText] = useState("Takip ediliyor")
    const [followers, setFollowers] = useState([])
    const [following, setFollowing] = useState([])
    const currentUser = useSelector(state => state.user)
    const dispatch = useDispatch()

    useState(() => {
        if (user) {
            setFollowers(user.followers)
            setFollowing(user.following)
        }
    }, [user])

    const follow = () => {
        if (fLoading) return;
        let sendToData = {
            data: { followToId: user.id, id: currentUser.id },
            token: currentUser.token
        }
        const response = (data) => {
            const fToFollowing = data.followToUser.following
            const fToFollowers = data.followToUser.followers

            const userFollowers = data.user.followers
            const userFollowing = data.user.following

            if (followersCallback) followersCallback(fToFollowers)
            if (followingCallback) followingCallback(fToFollowing)

            setFollowing(fToFollowing)
            setFollowers(fToFollowers)
            dispatch(updateUser({
                followers: userFollowers,
                following: userFollowing
            }))
        }
        followUser(sendToData, response, setfLoading)

    }


    if (active) return (
        <Box sx={{ width: '42px', height: '8px', justifyItems: 'center', alignItems: 'center'}}>
            <Box sx={{marginLeft: 'auto'}}>            
                {followers.includes(`${currentUser.id}`) ?
                    <Button onMouseEnter={() => setText("Stop following")} onMouseLeave={() => setText("being followed")} onClick={follow} 
                        sx={{ width: '120px', height: '30px', borderRadius: 5, borderColor: 'gray', display:'flex'}}>
                            {fLoading ?
                            <div className='w-4 h-4 border-2 border-gray-600 border-t-[#1d9bf0] animate-spin rounded-full ' ></div> :
                            <span className='text-white text-sm font-semibold ' > {text} </span>
                        }
                    </Button> :
                    <Button onClick={follow} >
                        {fLoading ?
                            <div className='w-4 h-4 border-2 border-gray-600 border-t-[#1d9bf0] animate-spin rounded-full ' ></div> :
                            <span className='text-[#0F1419] text-sm font-semibold ' > Follow </span>
                        }
                    </Button>
                }
            </Box>
        </Box>



    )

}

export default App