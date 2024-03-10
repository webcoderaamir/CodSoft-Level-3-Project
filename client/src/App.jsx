import React from 'react'
import { Route, Routes } from 'react-router-dom'
import User from './pages/User'
import Home from './pages/Home'
import Project from './pages/Project'
import { ToastContainer } from 'react-toastify'
import'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {

  return (

    <div>
      <Routes>
            <Route path='/' element={<User />} />
            <Route path='/user/:userId' element={<Home />} />
            <Route path='/:userId/:projectId' element={<Project />} />
      </Routes>
      
      <ToastContainer autoClose={1500} />
    </div>
    
  )
}

export default App