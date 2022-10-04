// import logo from '../assets/logo.png'
import HomeIcon from '@mui/icons-material/Home';
import TagIcon from '@mui/icons-material/Tag';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ListIcon from '@mui/icons-material/List';
import Default from '../assets/default.jpg'
import { NavLink, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Navbar() {

    const user = useSelector(state => state.user)
    let location = useLocation();
    const blockRenderPaths = [
        "/login",
        "/register"
    ]
    if (!user.token) return;
    if (blockRenderPaths.includes(location.pathname)) return null;

    return (
        <header className='flex items-end justify-end h-screen grow w-[15%] !min-w-[15%] md:w-[46%] z-50' >
            <div className="flex flex-col items-start justify-start gap-1 fixed h-screen md:pr-8" >
                {/* <img src={logo} width='30' className='mt-3 ml-4 mb-4' alt="" /> */}
                <NavLink to="/home" className="nav-link" >
                    <HomeIcon width="30"/>
                    <span>Home</span>
                </NavLink>
                <NavLink to="#" className="nav-link" >
                    <TagIcon width="30"/>
                    <span>hashtag</span>
                </NavLink>
                <NavLink to="#" className="nav-link" >
                    <NotificationsIcon width="30"/>
                    <span>Notification</span>
                </NavLink>
                <NavLink to="#" className="nav-link" >
                    <ChatIcon width="30"/>
                    <span>DM</span>
                </NavLink>
                <NavLink to="#" className="nav-link" >
                    <BookmarkIcon width="30"/>
                    <span>Bookmark</span>
                </NavLink>
                <NavLink to="#" className="nav-link" >
                    <ListIcon width="30"/>
                    <span>List</span>
                </NavLink>
                <NavLink to={user?.username ? user.username : ''} className="nav-link" >
                    <PersonIcon width="30"/>
                    <span>Profile</span>
                </NavLink>
                <NavLink to="#" className="nav-link" >
                    <ExpandMoreIcon width="30"/>
                    <span>More</span>
                </NavLink>
                <a href='#' className='bg-[#1d9bf0] hover:bg-[#1A8CD8] transition-all w-60 h-12 hidden md:flex items-center justify-center rounded-3xl mt-3' >
                    <span className='font-bold text-lg' >Bark</span>
                </a>
                <div className='flex items-center justify-start mt-auto mb-1 relative bottom-3 px-4 py-2 cursor-pointer gap-3 hover:bg-[#181818] transition-all rounded-[30px] w-full' >
                    <img src={user?.photo ? user?.photo : Default} width="40" className='rounded-full' alt="" />
                    <div className='hidden md:flex flex-col items-start justify-start' >
                        <span className='font-bold' > {user?.name} </span>
                        <span className='text-sm text-gray-500' > @{user?.username} </span>
                    </div>
                    <ExpandMoreIcon width="30"/>
                </div>

            </div>
        </header>
    )
}

export default Navbar