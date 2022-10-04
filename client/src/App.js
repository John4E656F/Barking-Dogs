import "./App.css";
import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './views/Home'
import Register from './views/Register'
import Login from './views/Login'



function App() {
  return(

      <BrowserRouter>
        <div className='flex w-full' >
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