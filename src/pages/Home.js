import React from 'react'
import { useEffect } from 'react';
import { useContext } from 'react'
import foodContext from '../context/foods/foodContext'
import Fooditem from '../components/Fooditem';
import CircleFood from '../components/CircleFood';
import { host } from '../utils/APIRoutes';
import Spin from '../components/Spin'
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import './Home.css';

const specials = [
  { name: "Cheese Pizza", price: 120, img: "/images/Pizza.jpg", rating: 5 },
  { name: "Masala Dosa", price: 60, img: "/images/dosaMasala.jpg", rating: 4 },
  { name: "Dahi Samosa", price: 40, img: "/images/dahi_samosa.jpg", rating: 5 },
  { name: "Aloo Gunda", price: 50, img: "/images/aaloogunda1.jpeg", rating: 4 },
  { name: "Fresh Juice", price: 45, img: "/images/juice.jpeg", rating: 5 },
];

export default function Home({ setShowDownload, showDownload }) {
  let foodCount = 0;
  const navigate = useNavigate();
  const searchQuery = useSearchParams()[0];
  const referenceNum = searchQuery.get("reference");
  const [currentUser, setCurrentUser] = useState(undefined);
  const { foods, showAllFoods, loading } = useContext(foodContext);
  useEffect(() => {
    if (referenceNum) {
      navigate(`/message?reference=${referenceNum}`)
    }
  }, [referenceNum])
  useEffect(() => {
    showAllFoods();
  }, [])

  return (
    <>
      {/* hero banner */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge"><i className="fa-solid fa-utensils"></i> Smart Canteen</span>
          <h1 className="hero-title">Eat what makes you <span>happy</span>.</h1>
          <p className="hero-sub">Fresh meals from your college canteen — order online, pay from your wallet, and skip the queue with quick QR pickup.</p>
          <div className="hero-actions">
            <a href="#menu" className="hero-btn primary">Order Now <i className="fa-solid fa-arrow-right"></i></a>
            <Link to="/orderhistory" className="hero-btn ghost">My Orders</Link>
          </div>
        </div>
      </section>

      <div className="home-wrap">
        {/* categories */}
        <section className="home-section">
          <div className="section-head">
            <h2 className="section-title">Browse Categories</h2>
            <p className="section-sub">Pick what you're craving today</p>
          </div>
          <div id="showFood">
            {loading && <Spin />}
            {!loading && <div id="allFoods">
              {foods.map((food) => {
                food.foodAvailable && foodCount++;
                return <>
                  {foodCount < 15 && food.foodAvailable && <CircleFood key={food._id} food={food} />}
                </>
              })}
            </div>}
          </div>
        </section>

        {/* today's special */}
        {!loading && <section className="home-section">
          <div className="section-head">
            <h2 className="section-title">Today's Special <span className="flame"><i className="fa-solid fa-fire"></i></span></h2>
            <p className="section-sub">Hand-picked favourites from the kitchen</p>
          </div>
          <div className="special-grid">
            {specials.map((item, i) => (
              <div className="special-card" key={i}>
                <div className="special-img-wrap">
                  <img className="special-img" src={item.img} alt={item.name} />
                  <span className="special-price">₹{item.price}</span>
                </div>
                <div className="special-info">
                  <h3 className="special-name">{item.name}</h3>
                  <span className="special-rating"><i className="fa-solid fa-star"></i> {item.rating}.0</span>
                </div>
              </div>
            ))}
          </div>
        </section>}

        {/* all dishes */}
        {!loading && <section className="home-section" id="menu">
          <div className="section-head">
            <h2 className="section-title">All Dishes</h2>
            <p className="section-sub">Everything available right now</p>
          </div>
          <div id="allDish">
            {foods.map((food) => {
              return (
                <>
                  {food.foodAvailable && <Fooditem key={food._id} food={food} />}
                </>
              )
            })}
          </div>
        </section>}
      </div>

      {/* Download mobile application */}
      <div style={{ display: `${!showDownload && "none"}` }} className="application-download-box">
        <span onClick={() => setShowDownload(false)} className='application-download-bax-close'>
          <i class="fa-solid fa-circle-xmark"></i>
        </span>
        <div className="app-dl-icon"><img src="/canteen-App/apk-icon.png" alt="app" /></div>
        <div className="app-dl-text">
          <h4>Get the Canteen App</h4>
          <p>Order on the go from your phone</p>
        </div>
        <Link to={"/canteen-App/base.apk"} target='_blank' download={"canteen_app.apk"} className="app-dl-btn">
          <i className="fa-solid fa-download"></i> Download
        </Link>
      </div>
    </>
  )
}
