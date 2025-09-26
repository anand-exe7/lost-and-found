import React from 'react'
import './Navbar.css'

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
            <a className='login'>Login</a>
            <a className='signup'>Sign Up</a>
         
          
        </div>
      </div>
    </div>
  )
}

export default Navbar