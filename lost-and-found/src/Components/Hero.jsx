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

    <div className='works'>
       <p className='workp'>How It Works</p>
      <div className='cards'>
        <div className='card1'>
          <h2>1️⃣</h2>
          <h3>  Create An Account</h3>
           <p>Sign up with your college email address for instant verification. Your student ID ensures you're connected only with verified campus community members.</p>
        </div>
        <div className='card2'>
          <h2>2️⃣</h2>
          <h3>Report Lost or Found</h3>
        <p>Upload photos, add descriptions, and mark the exact location on our interactive campus map. Include details like time, date, and any distinguishing features.</p>
        </div>
        
        <div className='card3'>
          <h2>3️⃣</h2>
          <h3>Browse Items</h3>
           <p>All reported items appear in a card-based layout. Students can scroll through and quickly check if their item has been reported.</p>
        </div>

         <div className='card4'>
          <h2>4️⃣</h2>
          <h3>Search & Filter</h3>
           <p>The platform includes a search option where users can enter item names or keywords to quickly locate posts. Filters such as category or date can also be applied, helping students narrow down results.</p>
        </div>

         <div className='card5'>
          <h2>5️⃣</h2>
          <h3>Connect with Reporter</h3>
           <p>When someone finds an item that matches a report, they can easily reach out to the original poster. Ensuring that the right owner and finder can connect directly.</p>
        </div>

         <div className='card6'>
          <h2>6️⃣</h2>
          <h3>Resolve & Close Case</h3>
           <p>Once an item is successfully returned, the post can be marked as resolved. This helps avoid duplicate claims and keeps the platform organized.</p>
        </div>
        
      </div>

      </div>
  </div>
  )
}

export default Hero 