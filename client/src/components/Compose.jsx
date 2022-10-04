import React, { useState } from "react";
import { useSelector } from "react-redux";
import { createPost } from '../api/requests/requests'
import GifIcon from '@mui/icons-material/Gif';
import PollIcon from '@mui/icons-material/Poll';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import ImageIcon from '@mui/icons-material/Image';
import Default from '../assets/default.jpg'

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

let _ = content.length > 0

const buttonStyle = {
  backgroundColor: _ ? '#1d9bf0' : '#0E4D77',
  color: _ ? '#fff' : '#7F7F7F',
  cursor: _ ? 'pointer' : 'default'
}

  return (
    <div className='w-full flex py-1 justify-between px-4 border-b border-b-gray-500 pb-2 border-opacity-50' >
      <img src={user?.photo ? user?.photo : Default} className='rounded-full !w-[48px] !h-[48px] pt-1 mr-3 ' alt="" />
      <div className='pt-1 flex flex-col items-center w-full' >
          <input id='content' onInput={e => setContent(e.target.value)} type="text" className='w-full outline-none h-[52px] bg-transparent placeholder-gray-600 text-xl' placeholder="What's on your mind?" />
          <div className='flex items-center justify-between w-full' >
              <div className='flex mt-3 gap-2' >
                  <ImageIcon width='25'/>
                  <GifIcon width='25'/>
                  <PollIcon width='25'/>
                  <AddReactionIcon width='25'/>
              </div>
              <div onClick={post}
                  style={buttonStyle}
                  className='w-20 h-[34px] rounded-3xl flex select-none items-center justify-center mt-3' >
                  <span className='' >Bark</span>
              </div>
          </div>
      </div>
    </div>
  )
}

export default Compose;