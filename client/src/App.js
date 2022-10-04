import "./App.css";
import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './views/Home'
import Register from './views/Register'
import Login from './views/Login'
import Navbar from './components/Navbar'
import './utils/axios'
import './assets/index.css'
import './assets/tailwind.css'

function App() {
  return(

      <BrowserRouter>
        <div className='flex w-full' >
        <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </BrowserRouter>

  )
}

export default App;