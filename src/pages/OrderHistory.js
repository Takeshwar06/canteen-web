import React, { useEffect, useState } from "react";
import './OrderHistory.css'
import axios from "axios";
import { EmployeeId, getUserOrderHistory } from "../utils/APIRoutes";
import { useNavigate } from "react-router-dom";



const OrderHistory = () => {
  const [orderHistory,setOrderHistory]=useState([]);
  const navigate = useNavigate();
  useEffect(()=>{
    const fetchOrderHistory = async()=>{
      const data = await axios.post(getUserOrderHistory,{
        UserId: localStorage.getItem("UserId"),
        EmployeeId: EmployeeId
      })
      setOrderHistory(data.data);
      console.log(data.data);
    }
   fetchOrderHistory();
  },[])

  function setFoodToLocal(foodid){
    localStorage.setItem("food_id",foodid);
    navigate("/foodreview")
   }

  return (
    <>
      <div className="order_history_container">
        <h1 className="order_heading">Your Order History</h1>
        <div className="orders_container">
          {orderHistory.map((order, index) => {
            return (
              <div key={index} className="order">
                <div className="order_image_div">
                  <img onClick={()=>setFoodToLocal(order.food_id)}
                    className="order_image"
                    src={order.foodimg}
                    alt=""
                  />
                </div>
                <div className="order_info">
                  <h4>{order.foodname}</h4>
                  <h4>
                    Quantity - <span>{order.foodQuantity}</span>
                  </h4>
                  <h4>
                    Price - <span>{order.foodprice} </span>
                  </h4>
                  <h4 className="txn_id" >
                    Txn id - <span>{order.order_id}</span>
                  </h4>
                  <h4>
                    Date - <span>{order.date.toString().substring(0, 10)} {order.rejected?<i style={{color:"red"}} class="fa-solid fa-xmark"></i>:<i style={{color:"green"}} class="fa-solid fa-check"></i>}</span>

                  </h4>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default OrderHistory;
