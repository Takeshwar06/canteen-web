import React from 'react'
import { useState } from 'react'
import foodContext from './foodContext'
import axios from 'axios';
import { addorder,
 EmployeeId, 
 getAllFoodsRoute,
 getkey,
 host,
 oneCoinToDev,
 ordergenerate,
 paymentVarification,
 } from '../../../utils/APIRoutes';
 import { useAuth0 } from "@auth0/auth0-react";

// import { useNavigate } from 'react-router-dom';
export default function FoodState(props) {
  // const navigate=useNavigate();
const { loginWithRedirect,logout,user,isAuthenticated } = useAuth0();
 const [loading,setLoading]=useState(false);
  const [message,setMessage]=useState(true);
  const [refreshAfterAddFood,setRefreshAfterAddFood]=useState(null);
  const [foods,setfoods]=useState([]);
  const [available,setAvailable]=useState([]);
  // fetch all fooditems to database

  const showAllFoods=async()=>{
    setLoading(true);
    const response= await fetch(getAllFoodsRoute,{
        method:'GET',
        headers:{
          "Content-Type":"application/json",
        },
      })
      const json=await response.json();
      setfoods(json);
      setLoading(false);
  }
  
  // payment process code
  const paymentProcess=async(total)=>{

    try{
      const {data:{key}} =await axios.get(getkey);
      const {data:{order}}= await axios.post(ordergenerate,{
      amount:total
     }) //first generate order 


    // varification
    const options = {
      key: key, // Enter the Key ID generated from the Dashboard
      amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "Smart-Canteen",
      description: "Test Transaction",
      image: 'https://res.cloudinary.com/do3fiil0d/image/upload/v1701536784/smartCanteenLogo_tbtynk.jpg',
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      callback_url: paymentVarification,
      prefill: {
          name: user.name,
          email: user.email,
          contact: "9691382464"
      },
      notes: {
          "address": "Razorpay Corporate Office"
      },
      theme: {
          "color": "black"
      }
  };
  
  const razor = new window.Razorpay(options);
    razor.open().then((data) => {
      // handle success
      alert(`Success: ${data.razorpay_payment_id}`);
      console.log(data);
    }).catch((error) => {
      // handle failure
      alert(`Error: ${error.code} | ${error.description}`);
    });;
    }
    catch(err){
        console.log(err);
    }
  }

  const addOrder=async(cardFoods,order_id)=>{
        const userId=localStorage.getItem("UserId");
        cardFoods.forEach(async(food) => {
          const response= await axios.post(addorder,{
            uniqueOrderId:food.uniqueOrderId,
            foodname:food.foodname,
            UserId:userId,
            EmployeeId:food.EmployeeId,
            foodQuantity:food.foodQuantity,
            foodprice:food.foodprice,
            foodimg:food.foodimg,
            food_id:food.food_id,
            placed:false,
            order_id:order_id
           })
           if(response){
             setRefreshAfterAddFood(order_id);
           }
        });
       
        await axios.get(oneCoinToDev);
     
  }

  return (
       <foodContext.Provider value={{
       addOrder,
       setfoods,
       loading,
       refreshAfterAddFood,
       message,setMessage,
       showAllFoods,
       foods,    
       available,
       paymentProcess,
       setAvailable}}>
           {props.children}
       </foodContext.Provider>
  )
}
