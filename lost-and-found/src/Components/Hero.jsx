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

   <section id='about'>

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
      </section>


        <section class="reviews" >
        <div class="reviews-container">
            <h2 class="section-title">What Students Say</h2>
            <div class="reviews-grid">
                <div class="review-card">
                    <div class="review-header">
                        <div class="review-avatar">SJ</div>
                        <div class="review-info">
                            <h4>Sarah Johnson</h4>
                            <p>Computer Science, Junior</p>
                        </div>
                    </div>
                    <div class="stars">⭐⭐⭐⭐⭐</div>
                    <p>"I lost my laptop charger in the library and found it within 2 hours using CampusFind! The location feature helped the finder pinpoint exactly where I dropped it. Amazing service!"</p>
                </div>
                <div class="review-card">
                    <div class="review-header">
                        <div class="review-avatar">MD</div>
                        <div class="review-info">
                            <h4>Mike Davis</h4>
                            <p>Business Administration, Senior</p>
                        </div>
                    </div>
                    <div class="stars">⭐⭐⭐⭐⭐</div>
                    <p>"Found someone's wallet and posted it on CampusFind. The owner contacted me in minutes! It feels great to help fellow students. This platform makes our campus community stronger."</p>
                </div>
                <div class="review-card">
                    <div class="review-header">
                        <div class="review-avatar">EL</div>
                        <div class="review-info">
                            <h4>Emma Liu</h4>
                            <p>Engineering, Sophomore</p>
                        </div>
                    </div>
                    <div class="stars">⭐⭐⭐⭐⭐</div>
                    <p>"The smart matching feature is incredible! It suggested my lost textbook based on similar reports. Got my $200 textbook back just before finals. Lifesaver!"</p>
                </div>
                <div class="review-card">
                    <div class="review-header">
                        <div class="review-avatar">JW</div>
                        <div class="review-info">
                            <h4>James Wilson</h4>
                            <p>Psychology, Graduate</p>
                        </div>
                    </div>
                    <div class="stars">⭐⭐⭐⭐⭐</div>
                    <p>"Clean interface, fast notifications, and actually works! I've both lost and found items through this platform. It's become essential for campus life."</p>
                </div>
                <div class="review-card">
                    <div class="review-header">
                        <div class="review-avatar">AM</div>
                        <div class="review-info">
                            <h4>Aisha Martin</h4>
                            <p>Pre-Med, Freshman</p>
                        </div>
                    </div>
                    <div class="stars">⭐⭐⭐⭐⭐</div>
                    <p>"Lost my dorm keys on my second week. Was panicking about locksmith costs! A kind senior found them and returned them through CampusFind. Thank you!"</p>
                </div>
                <div class="review-card">
                    <div class="review-header">
                        <div class="review-avatar">RG</div>
                        <div class="review-info">
                            <h4>Ryan Garcia</h4>
                            <p>Art & Design, Junior</p>
                        </div>
                    </div>
                    <div class="stars">⭐⭐⭐⭐⭐</div>
                    <p>"My sketchbook with a semester's worth of work was found by someone using this app. The secure messaging system made the handoff smooth and safe. Grateful!"</p>
                </div>
            </div>
        </div>
    </section>

    
       
    
    <div className='contact-us'> 
        <h2>Get In Touch</h2>
        <div className='contact'>
         <div className='contact-sec'>
            <h3>Need Help or Have Questions?</h3>
            <p>We're here to help make your campus experience better. Reach out to us for support, partnerships, or just to share your feedback.</p>

            <div className='box1'>
                <img src={phone}></img>
                <div className='box-img'>
                    <h2>Email Support</h2>
                    <p>support@srmrmp.edu</p>
                    <p>Response within 24 hours</p>
                </div>
                
            </div>

             <div className='box2'>
                <img src=''></img>
                <div className='box2-img'>
                    <h2>Lost and Found</h2>
                    <p>Admin Building, Room 101</p>
                    <p> Walk-in hours: Mon-Fri, 10AM-4PM</p>
                </div>
                
            </div>
        </div>

            <div class="contact-form-container">
                    <form class="contact-form">
                        <h3>Send us a Message</h3>
                        <div class="form-group">
                            <input type="text" placeholder="Your Name" required></input>
                        </div>
                        <div class="form-group">
                            <input type="email" placeholder="Your College Email" required></input>
                        </div>
                        <div class="form-group">
                            <select required>
                                <option value="">Select Topic</option>
                                <option value="support">Technical Support</option>
                                <option value="partnership">College Partnership</option>
                                <option value="feedback">Feedback</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <textarea rows="5" placeholder="Your Message" required></textarea>
                        </div>
                        <button type="submit" class="btn-primary">Send Message</button>
                    </form>
                </div>
                
        </div>
        
    </div>


     <footer class="footer">
        <div class="footer-container">
            <div class="footer-content">
     <div class="footer-section">
                    <div class="footer-logo">
                        <span class="logo">CampusFind</span>
                        <p>Making campus life easier, one found item at a time. Connect, recover, and build stronger college communities.</p>
                        <div class="social-links">
                            <a href="#" class="social-link">📘</a>
                            <a href="#" class="social-link">📷</a>
                            <a href="#" class="social-link">🐦</a>
                            <a href="#" class="social-link">💼</a>
                        </div>
                    </div>
                </div>
                
                <div class="footer-section">
                    <h4>Quick Links</h4>
                    <ul class="footer-links">
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">How It Works</a></li>
                        <li><a href="#contact">Contact Us</a></li>
                        <li><a href="#">Mobile App</a></li>
                        <li><a href="#">Campus Partners</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>


     
           
        
      </div>

      
  
  )
}

export default Hero 