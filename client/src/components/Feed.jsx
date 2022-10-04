import { useEffect, useState } from 'react'
import axios from '../utils/axios'
import { useNavigate, Link } from 'react-router-dom'
import FollowButton from './FollowButton'
import { useSelector } from 'react-redux'
import { getUser } from '../api/requests/requests'
import RepeatIcon from '@mui/icons-material/Repeat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddCommentIcon from '@mui/icons-material/AddComment';
import FileUploadIcon from '@mui/icons-material/FileUpload';

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
  const randomNumber = () => {
      return Math.floor(Math.random() * (10000 - 1500) + 1500);
  }
  const userManager = async () => {
      const data = await getUser({ id })
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
    <div className='md:!w-[590px] w-full flex items-start justify-center relative px-4 border-b border-b-gray-500 border-opacity-50 pt-5 gap-3 cursor-pointer transition-all hover:bg-[#080808] ' >
      <div className='group w-max relative transition-all' >
        <div className='w-[268px] invisible userBoxX transition-all opacity-0 group-hover:opacity-100 z-50 group-hover:delay-500 group-hover:visible flex absolute p-4 top-12 bg-black rounded-3xl flex-col items-start' >
            <div className='flex items-center justify-between w-full' >
                <img src={user?.photo ? user?.photo : Default} onClick={goPage} width="54" className="rounded-full cursor-pointer" alt="" />
                <FollowButton user={user} active={currentUser.id !== user.id} followersCallback={followersCallback} followingCallback={followingCallback} />
            </div>
            <div className='flex flex-col items-start justify-start w-full' >
                <a onClick={goPage} className='font-semibold cursor-pointer hover:underline text-lg mt-1' > {user?.name} </a>
                <span className='text-[#54595D]' > @{user.username} </span>
            </div>
            <span > {user.description} </span>
            <div className='flex items-start gap-2 w-full justify-start' >
                <Link to={`/${user.username}/following`} className='text-sm hover:underline cursor-pointer ' ><strong> {following?.length} </strong> <span className='text-[#71767B]' >Takip edilen</span></Link>
                <Link to={`/${user.username}/followers`} className='text-sm hover:underline cursor-pointer ' ><strong> {followers?.length} </strong> <span className='text-[#71767B]' >Takipçi</span></Link>
            </div>
        </div>
        <img src={user?.photo ?? Default} onClick={goPage} width="54" className="rounded-full cursor-pointer" alt="" />
      </div>
      <div className='w-full flex flex-col items-start justify-center pb-3' >
        <div className='flex items-center justify-center gap-1' >
            <a onClick={goPage} className='font-semibold cursor-pointer hover:underline' > {user?.name} </a>
            <span className='text-[#54595D]' > @{user?.username} </span>
            <span className='text-[#54595D]' >4s</span>
        </div>
        <span> {content} </span>
        <div className='flex w-full gap-16 mt-4' >
            <div className='flex items-start justify-center gap-3 group cursor-pointer' >
                <AddCommentIcon width="20"/>
                <span className='text-[#54595D] text-sm !w-9 !max-w-[2.25rem] overflow-hidden transition-all group-hover:text-[#1D9BF0] ' > {randomNumber()} </span>
            </div>
            <div className='flex items-start justify-center gap-3 group cursor-pointer' >
                <RepeatIcon width="20"/>
                <span className='text-[#54595D] text-sm !w-9 !max-w-[2.25rem] overflow-hidden transition-all group-hover:text-[#00BA7C] ' > {randomNumber()} </span>
            </div>
            <div className='flex items-center justify-center gap-3 group cursor-pointer' >
                <FavoriteIcon width="20"/>
                <span className='text-[#54595D] text-sm !w-9 !max-w-[2.25rem] overflow-hidden transition-all group-hover:text-[#DE1673] ' > {randomNumber()} </span>
            </div>
            <div className='hidden md:flex items-start justify-center gap-3 group' >
                <FileUploadIcon width="20"/>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Feed