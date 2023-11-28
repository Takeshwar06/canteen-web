import React,{ useEffect } from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmployeeId, getCoin, updateCoin } from '../utils/APIRoutes';
// import { useState } from 'react';
// import { useRef } from 'react';
// import { useContext } from 'react';
// import foodContext from './context/foods/foodContext';
import foodContext from './context/foods/foodContext';
import axios from 'axios';

export default function () {
  const navigate=useNavigate();
    const [foods,setFoods]=useState([]);
    const [total,setTotal]=useState(0);
  const {paymentProcess}=useContext(foodContext);

    useEffect(()=>{
      if(localStorage.getItem("cardFoods")){
        const cardFoods=JSON.parse(localStorage.getItem("cardFoods"));
        setFoods(cardFoods);
      }
    },[])
    useEffect(()=>{
        let totalPrice=0;
     foods.forEach((food)=>{
        totalPrice=totalPrice+(food.foodQuantity*food.foodprice)
     })
     setTotal(totalPrice);
    },[foods])

    const conformation=async()=>{
      const useCoin=window.confirm("use coin to confirm cancel for other payment")
      if(useCoin){
         const isConfirm=window.confirm(`${total}Rs buy to coin`)    
         if(isConfirm){
           const data=await axios.post(getCoin,{userId:localStorage.getItem("UserId")})
           if(data.data.length>0&&data.data[0].coin>=total){
                const coinUpdated=await axios.post(updateCoin,{
                 userId:localStorage.getItem("UserId"),
                 updatedCoin:(data.data[0].coin)-(total)
                })
                if(coinUpdated.data.acknowledged===true){
                navigate(`/message?reference=coin%${Math.ceil(Math.random()*100000+(999999-100000))}`)
                }else{window.alert("order failed try again")}
           } else{
             window.alert("you have not coin to buy this food")
           }
         }
      }

      else{
        // razorpay coming soon
       let isConfirm=window.confirm(`please comfirm to use another payment method`);
 
   if(isConfirm){
     // fetch api to add order 
     paymentProcess(total);
   }
      }
  }
  return (
    <div style={{width:"100%",marginTop:"20px"}}>
        <div style={{width:"100%",display:"flex",flexWrap:"wrap",alignItems:"center"}}>
        
        {/* items */}
       {
        foods.map((food)=>{
            return(
                <div key={food._id} style={{width:"250px",minHeight:"200px",border:"2px solid black",padding:"10px"}}>
                <p>name:{food.foodname}</p>
                <p>price:{food.foodprice}</p>
                <p>Quantity:{food.foodQuantity}</p>
                <p>Image:"{food.foodimg}</p>
             </div>
            )
        })
       }
        </div>
        {/* footer */}
        <div style={{width:"100%",alignItems:'center',position:'fixed',bottom:0,right:0,paddingLeft:"20px"}}>
           <p>total:{total}</p>
           <button className='btn btn-success' onClick={conformation} >pay</button>
        </div>
    </div>
  )
}
