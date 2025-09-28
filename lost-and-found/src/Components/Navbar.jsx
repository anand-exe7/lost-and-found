import React from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div>
      <div className='navbar'>
        <div className='nav-left'>
            <h2>Lost and Found</h2>
            <img src=''></img>
        </div>

        <div className='nav-right'>
      
            <a className='gap'>Home</a>
            <a className='gap'> About Us</a>
            <a className='gap'> Contact Us</a>
            <div className='login'>
               <Link to="/auth">Login</Link>
            </div>
           
         
          
        </div>
      </div>
    </div>
  )
}

export default Navbar