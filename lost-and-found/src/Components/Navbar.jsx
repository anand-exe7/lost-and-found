import React from 'react'
import './Navbar.css'

import { Link } from 'react-scroll'
import Hero from './Hero.jsx'

const Navbar = () => {
  return (
    <div>
      <div className='navbar1 '>
        <div className='nav-left1'>
            <h2>Lost and Found</h2>
            <img src=''></img>
        </div>

        <div className='nav-right1'>
      
            <a className='gap'>Home</a>
            <Link className = 'gap' to="about" smooth={true} duration={500}>About Us</Link>
            <Link className = 'gap' to="contact-uss" smooth={true} duration={500}>Contact Us</Link>
            <div className='login'>
               <Link to="/auth">Login</Link>
            </div>
           
         
          
        </div>
      </div>
    </div>
  )
}

export default Navbar