import React, { useEffect } from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmployeeId, coinMinus, createCoin, getCoin,  } from '../utils/APIRoutes';
// import { useState } from 'react';
// import { useRef } from 'react';
// import { useContext } from 'react';
// import foodContext from './context/foods/foodContext';
import foodContext from './context/foods/foodContext';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
import './AddToCard.css';

export default function () {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [total, setTotal] = useState(0);
  const { paymentProcess } = useContext(foodContext);

  useEffect(() => {
    if (localStorage.getItem("cardFoods")) {
      const cardFoods = JSON.parse(localStorage.getItem("cardFoods"));
      setFoods(cardFoods);
    }
  }, [])
  useEffect(() => {
    let totalPrice = 0;
    foods.forEach((food) => {
      totalPrice = totalPrice + (food.foodQuantity * food.foodprice)
    })
    setTotal(totalPrice);
  }, [foods])

  const conformation = async () => {
    if (!isAuthenticated) {
      loginWithRedirect();
    } else {

      const response = await axios.post(createCoin, {
        userName: user.name,
        userEmail: user.email,
        userImage: user.picture
      })
      if (response.data.userId) {
        localStorage.setItem("UserId", response.data.userId)
      }

      const useCoin = window.confirm("use coin to confirm cancel for other payment")
      if (useCoin) {
        const isConfirm = window.confirm(`${total}Rs buy to coin`)
        if (isConfirm) {
          const data = await axios.post(getCoin, { userId: localStorage.getItem("UserId") })
          if (data.data.length > 0 && data.data[0].coin >= total) {
            const coinUpdated = await axios.post(coinMinus, {
              userId: localStorage.getItem("UserId"),
              updatedCoin: total
            })
            if (coinUpdated.data.acknowledged === true) {
              navigate(`/message?reference=coin%${Math.ceil(Math.random() * 100000 + (999999 - 100000))}`)
            } else { window.alert("order failed try again") }
          } else {
            window.alert("you have not coin to buy this food")
          }
        }
      }
      else {
        // razorpay coming soon
        let isConfirm = window.confirm(`please comfirm to use another payment method`);

        if (isConfirm) {
          // fetch api to add order 
          paymentProcess(total);
        }
      }
    }
  }

  // food quantity ++
  const foodQuantityPlus = async (index) => {
    const cardFoods = JSON.parse(localStorage.getItem("cardFoods"));
    cardFoods[index].foodQuantity++;
    setFoods(cardFoods);
    localStorage.setItem("cardFoods", JSON.stringify(cardFoods))
  }
  // food quantity --
  const foodQuantityMinus = async (index) => {
    const cardFoods = JSON.parse(localStorage.getItem("cardFoods"));
    if (cardFoods[index].foodQuantity > 1) {
      cardFoods[index].foodQuantity--;
      setFoods(cardFoods);
      localStorage.setItem("cardFoods", JSON.stringify(cardFoods))
    }
  }
  // food delete from cardFoods
  const foodDelete = async (index) => {
    const cardFoods = JSON.parse(localStorage.getItem("cardFoods"));
    cardFoods.splice(index, 1)
    setFoods(cardFoods);
    localStorage.setItem("cardFoods", JSON.stringify(cardFoods))
  }
 function setFoodToLocal(foodid){
  localStorage.setItem("food_id",foodid);
  navigate("/foodreview")
 }
  return (
    <div className='addtocart-container' style={{ width: "100%", marginTop: "20px" }}>
      <div className="all-cart-container" style={{ width: "100%", display: "flex", flexWrap: "wrap", alignItems: "center", marginBottom: "85px" }}>
        {/* items */}
        {
          foods.map((food, index) => {
            return (
              <div className='cart-container' key={food._id}>
                <div className='image-container'>
                  <img onClick={()=>setFoodToLocal(food.food_id)} class="cart-image" src={food.foodimg} />
                </div>
                <div className='image-description' >
                  <p className="product-name" >
                    name : <span class="cart-values" >{food.foodname.slice(0, 10)}..</span>
                  </p>
                  <p className="product-price" >
                    price : <span class="cart-values" >{food.foodprice}</span>
                  </p>
                  <div class="add-quantity">
                    <i class="cart-icons fa-solid fa-circle-minus" onClick={() => foodQuantityMinus(index)}></i>
                    {/* <i class="fa-solid fa-plus"></i> */}
                    <span className='quantity' >{food.foodQuantity}</span>
                    {/* <i class="fa-solid fa-minus"></i> */}
                    <i class="cart-icons fa-solid fa-circle-plus" onClick={() => foodQuantityPlus(index)}></i>
                    <i class="cart-icons fa-solid fa-trash" onClick={() => foodDelete(index)}></i>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
      {/* footer */}
      <div className='payment-calculation' style={{ position: "fixed", bottom: 0, right: 0, left: 0, width: "100%", backgroundColor: "white", paddingBottom: "5px" }} >
        <span className='pay-total' >Total : <span class="cart-values" >{total}</span> </span>
        <button className='pay-button ' style={{ backgroundColor: `${total < 1 && "rgb(158 205 158)"}` }} onClick={() => total > 0 && conformation()} >pay <i class="fa-brands fa-amazon-pay"></i> </button>
      </div>
    </div>
  )
}
