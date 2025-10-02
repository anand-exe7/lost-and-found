import React from 'react';
import './Navbar.css';

import { Link as RouterLink } from "react-router-dom"; // React Router for login
import { Link as ScrollLink } from "react-scroll";      // React Scroll for About, Contact

const Navbar = () => {
  return (
    <div>
      <div className='navbar1'>
        <div className='nav-left1'>
          <h2>Lost and Found</h2>
          {/* Optional: Add your logo image here */}
          {/* <img src='your-logo.png' alt='Logo' /> */}
        </div>

        <div className='nav-right1'>
          <a className='gap'>Home</a>

          {/* Scroll to 'about' section */}
          <ScrollLink
            className='gap'
            to="about"
            smooth={true}
            duration={500}
            offset={-70} // Optional: adjust for navbar height
          >
            About Us
          </ScrollLink>

          {/* Scroll to 'contact-uss' section */}
          <ScrollLink
            className='gap'
            to="contact-uss"
            smooth={true}
            duration={500}
            offset={-70}
          >
            Contact Us
          </ScrollLink>

          {/* React Router Link to Login Page */}
          <div className='login'>
            <RouterLink to="/auth">Login</RouterLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
