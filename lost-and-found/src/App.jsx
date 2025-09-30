import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './Components/Navbar.jsx'
import Hero from './Components/Hero.jsx'
import { Routes , Route } from 'react-router-dom'
import Home from './Pages/Home.jsx'
import AuthForm from './Pages/AuthForm.jsx'
import Dashboard from './Pages/Dashboard.jsx'
import ItemDetail from './Pages/ItemDetail.jsx'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>

    <Routes>
      <Route path = '/' element = {<Home/>}></Route>
      <Route path = '/auth' element = {<AuthForm />}></Route>
      <Route path='/dashboard' element = {<Dashboard />}></Route>
      <Route path="/item/:id" element={<ItemDetail />} />
    </Routes>
     
    </>
  )
}

export default App
