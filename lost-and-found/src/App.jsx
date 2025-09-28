import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './Components/Navbar'
import Hero from './Components/Hero'
import { Routes , Route } from 'react-router-dom'
import Home from './Pages/Home'
import AuthForm from './Pages/AuthForm'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>

    <Routes>
      <Route path = '/' element = {<Home/>}></Route>
      <Route path = '/auth' element = {<AuthForm />}></Route>
    </Routes>
     
    </>
  )
}

export default App
