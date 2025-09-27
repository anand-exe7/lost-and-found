import React from 'react'
import './Hero.css'
import book from "../assets/book.png"
import phone from "../assets/phone.png"
import headphones from "../assets/headphones.png"
import school_bag from "../assets/school-bag.png"


const Hero = () => {
  return (
    <div>
      <div className="hero-content">
      <h1 className='hero'>Never Lose, Always Find</h1>
      <p>The smartest way to recover lost items on campus. Connect with your college community and get your belongings back faster than ever.</p>
      <button className='btn1'>Report Lost Item</button>
      <button className='btn2'>Found Item</button>

      <div className='main-img'>
        <div className='img-1'>
          <img src={phone} className='img1'></img>
          <p>Phone</p>
        </div>

        <div className='img-2'>
          <img src={book} className='img2'></img>
          <p>Book</p>
        </div>

        <div className='img-3'>
          <img src={headphones} className='img3'></img>
          <p>HeadSet</p>
        </div>

        <div className='img-4'>
          <img src={school_bag} className='img4'></img>
          <p>Bag</p>
        </div>

      </div>

  

    </div>
    </div>
  )
}

export default Hero 