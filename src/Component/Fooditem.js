
import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmployeeId } from '../utils/APIRoutes';
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

   const {food} =props;


   const addToCard=(food,foodCount)=>{
    console.log(food)
    const useCoin=window.confirm(`do you want to add to card`)
    if(useCoin){
     if(!localStorage.getItem("cardFoods")){
      const cardFoods=Array({
      uniqueOrderId:Math.ceil(Math.random()*100000000000000+(999999999999999-100000000000000)).toString(),
      UserId:localStorage.getItem("UserId"),
      EmployeeId:EmployeeId,
      foodQuantity:Number(foodCount),
      foodimg:food.foodimg,
      foodname:food.foodname,
      foodprice:food.foodprice,
      food_id:food._id
      })
      localStorage.setItem("cardFoods",JSON.stringify(cardFoods));
     }else{
      const cardFoods=JSON.parse(localStorage.getItem("cardFoods"));
      const indexOfFood = cardFoods.findIndex(obj => obj.food_id == food._id);
      console.log(indexOfFood);
      if (indexOfFood !== -1) {
        cardFoods[indexOfFood].foodQuantity = cardFoods[indexOfFood].foodQuantity + Number(foodCount);
      }else{
        const singleFood={
          uniqueOrderId:Math.ceil(Math.random()*100000000000000+(999999999999999-100000000000000)).toString(),
          UserId:localStorage.getItem("UserId"),
          EmployeeId:EmployeeId,
          foodQuantity:Number(foodCount),
          foodimg:food.foodimg,
          foodname:food.foodname,
          foodprice:food.foodprice,
          food_id:food._id
          }
          cardFoods.push(singleFood);
      }
      localStorage.setItem("cardFoods",JSON.stringify(cardFoods));
     }
    }
   }

   const setFoodIdToLocal = (foodid)=>{
    localStorage.setItem("food_id",foodid);
    navigate("/foodreview")
   }
  return (
    <>    

<div id="dishes"  className="my-3 ">
                        <div id="logo">
                            <img onClick={()=>setFoodIdToLocal(food._id)} src={food.foodimg} alt="" srcSet=""/>
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
