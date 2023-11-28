
import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmployeeId, getCoin, updateCoin } from '../utils/APIRoutes';
// import { useState } from 'react';
// import { useRef } from 'react';
// import { useContext } from 'react';
// import foodContext from './context/foods/foodContext';
import foodContext from './context/foods/foodContext';

export default function Fooditem(props) {

  const {paymentProcess}=useContext(foodContext);
  const [foodCount,setFoodCount]=useState(1);
  const navigate=useNavigate();
  // add foodcount
  const addBtn=()=>{
    setFoodCount(foodCount+1);
  }
  // minus foodcount
  const minusBtn =()=>{
    foodCount>1&&setFoodCount(foodCount-1);
  }
  // const changeOn=useRef(null);
  // const changeOff=useRef(null);

  //  const [orderDetail,setOrderDetail]=useState({})
   const {food} =props;
  //  const {available}=useContext(foodContext);

// order by user and conformation quantity 

   const conformation=async(food,foodcount)=>{
       const useCoin=window.confirm("use coin to confirm cancel for other payment")
       if(useCoin){
          const isConfirm=window.confirm(`${food.foodname} - ${foodcount} buy to coin`)    
          if(isConfirm){
            console.log("conrif")
            const data=await axios.post(getCoin,{userId:localStorage.getItem("UserId")})
            console.log(data);
            if(data.data.length>0&&data.data[0].coin>=food.foodprice*foodcount){
              console.log("same")
                 const coinUpdated=await axios.post(updateCoin,{
                  userId:localStorage.getItem("UserId"),
                  updatedCoin:(data.data[0].coin)-(food.foodprice*foodcount)
                 })
                 console.log(coinUpdated);
                 if(coinUpdated.data.acknowledged===true){
                  console.log("acknowl")
                 localStorage.setItem("setOneFoodForOrder",JSON.stringify({food,foodcount}));
                 navigate(`/message?reference=coin%${Math.ceil(Math.random()*100000+(999999-100000))}`)
                 }else{window.alert("order failed try again")}
            } else{
              window.alert("you have not coin to buy this food")
            }
          }
       }

       else{
         // razorpay coming soon
    let isConfirm=window.confirm(`${food.foodname} - ${foodcount} please comfirm`);
  
    if(isConfirm){
      // fetch api to add order 
      paymentProcess(food,foodcount);
      localStorage.setItem("setOneFoodForOrder",JSON.stringify({food,foodcount}));
    }
       }
   }

   const addToCard=(food,foodCount)=>{
    console.log(food)
    const useCoin=window.confirm(`do you want to add to card`)
    if(useCoin){
     if(!localStorage.getItem("cardFoods")){
      const cardFoods=Array({
      uniqueOrderId:Math.ceil(Math.random()*100000000000000+(999999999999999-100000000000000)).toString(),
      UserId:localStorage.getItem("UserId"),
      EmployeeId:EmployeeId,
      foodQuantity:foodCount,
      foodimg:food.foodimg,
      foodname:food.foodname,
      foodprice:food.foodprice,
      _id:food._id
      })
      localStorage.setItem("cardFoods",JSON.stringify(cardFoods));
     }else{
      const cardFoods=JSON.parse(localStorage.getItem("cardFoods"));
      const singleFood={
      uniqueOrderId:Math.ceil(Math.random()*100000000000000+(999999999999999-100000000000000)).toString(),
      UserId:localStorage.getItem("UserId"),
      EmployeeId:EmployeeId,
      foodQuantity:foodCount,
      foodimg:food.foodimg,
      foodname:food.foodname,
      foodprice:food.foodprice,
      _id:food._id
      }
      cardFoods.push(singleFood);
      localStorage.setItem("cardFoods",JSON.stringify(cardFoods));
     }
    }
   }
  return (
    <>    
    {/* <div className='my-3'>
          <div className="card ">
            <img src={`/upload/${food.foodimg}`} className="card-img-top" alt="..."/>
            <div className="card-body">
            <h5 className="card-title">{food.foodname} - {food.foodprice}Rs</h5>
            <button className="btn btn-outline-danger" onClick={()=>{conformation(food)}} >add</button>
         </div>
    </div> 
</div> */}


<div id="dishes"  className="my-3 ">
                        <div id="logo">
                            <img src={`/upload/${food.foodimg}`} alt="" srcSet=""/>
                        </div>
                        <div id="dishName" className="dname">
                            <label htmlFor="" id="name">{food.foodname}:&nbsp;</label>
                            <label htmlFor=" : " id="price">: ₹{food.foodprice}</label>
                        </div>
                        <div id="addingCart">
                            <div id="minus"><button className="Btn" id="minusBtn" onClick={minusBtn}>-</button></div>
                            <div id="number">{foodCount}</div>
                            <div id="add"><button className="Btn" id="addBtn" onClick={addBtn}>+</button></div>
                            <div id="addCart">
                                <button className="Btn addCartBtn" onClick={()=>{addToCard(food,foodCount)}} id="addCartBtn-12">AddCart</button>
                            </div>
                        </div>
                    </div>
</>
  )
}
