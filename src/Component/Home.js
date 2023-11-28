import React from 'react'
import { useEffect } from 'react';
import { useContext } from 'react'
import foodContext from './context/foods/foodContext'
import Fooditem from './Fooditem';
import CircleFood from './CircleFood';
import { host } from '../utils/APIRoutes';
import Spin from './Spin'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
export default function Home() {
  let foodCount = 0;
  const navigate = useNavigate();
  const searchQuery=useSearchParams()[0];
  const referenceNum=searchQuery.get("reference");
  const [currentUser,setCurrentUser]=useState(undefined);
  const { foods, showAllFoods,loading } = useContext(foodContext);
   useEffect(()=>{
      if(referenceNum){
         navigate(`/message?reference=${referenceNum}`)
      }
   },[referenceNum])
  useEffect(() => {
       // generate UserId in localStorage with condition 
       if(!localStorage.getItem("UserId")){
         localStorage.setItem("UserId",Math.ceil(Math.random()*1000000000+(9999999999-1000000000)))
       }
       
       showAllFoods();     
  },[]) 

  return (
    <>
      <div id="showFood">
        <h2 className="center">Eat! What makes you Happy 😊</h2>
        {loading&&<Spin/>}
       {!loading&& <div id="allFoods">
             {foods.map((food)=>{
             food.foodAvailable&&foodCount++;
             return <>
                 {foodCount<15&&food.foodAvailable&&<CircleFood key={food._id} food={food}/>}
              </>
             })}
        </div>}
      </div>
       <hr></hr>

       {!loading&& <div id="specialFood">
 
                    <h1 id="Special-Heading">* Today's Special Food *</h1>
                    <div id="slider">
                        <figure>
                            <img class="img" src="/image2/slider-1.png"/>
                            <img class="img" src="/image2/slider-2.jfif"/>
                            <img class="img" src="/image2/slider-3.jpg"/>
                            <img class="img" src="/image2/slider-4.jpg"/>
                            <img class="img" src="/image2/slider-5.jpg"/>
                        </figure>
                    </div>
                </div>}
       <hr></hr>
      {!loading&&<div id="allDish" className='mx-3'>
        {foods.map((food) => {
          return (
            <>
              {food.foodAvailable && <Fooditem key={food._id} food={food} />}
            </>
          )
        })}
      </div>}
    </>

  )
}
