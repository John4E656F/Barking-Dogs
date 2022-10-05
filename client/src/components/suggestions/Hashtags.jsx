import { useState } from "react"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function App() {

    const [tags, setTags] = useState([
        "#Barking Dogs",
        "Programmers",
        "Coding",
        "#Lorem",
        "#Ipsum",
        "#4e 65 6f",
        "Hello World"
    ])

    return (
        <div id='hashtags' className='w-full bg-[#16181C] rounded-2xl pt-3' >
            <span className='font-bold text-xl px-4 pb-2' >Topics you may be interested in</span>
            <div className='h-[12px] ' ></div>

            {
                tags.map((item, index) => {
                    return (
                        <div key={index} className='flex items-start flex-col px-4 py-2 w-full cursor-pointer transition-all hover:bg-[#1D1F23] ' >
                            <div className='flex items-start flex-col w-full' >
                                <div className='flex justify-between items-center w-full' >
                                    <span className='text-sm text-[#54595D]' >Policy - What's on the agenda</span>
                                    <ExpandMoreIcon width="20"/>
                                </div>
                                <span className="font-semibold" > {item} </span>
                            </div>
                            <span className='text-sm text-[#54595D] ' > {Math.floor(Math.random() * (10000 - 1500) + 1500)} Tweet </span>
                        </div>
                    )
                })
            }

            <div className='flex items-start flex-col px-4 py-3 mt-2 w-full cursor-pointer transition-all hover:bg-[#1D1F23] rounded-b-2xl' >
                <span className='text-[#1d9bf0] ' >Show more</span>
            </div>

        </div>
    )
}

export default App