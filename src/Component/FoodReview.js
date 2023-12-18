import React, { useEffect, useState } from "react";

import "./FoodReview.css";
import { useNavigate } from "react-router-dom";
import { EmployeeId, getFoodById } from "../utils/APIRoutes";
import axios from "axios";
import Spin from './Spin'

const FoodReview = () => {
  const navigate = useNavigate();
  const [foodDetails, setFoodDetails] = useState(undefined);

  useEffect(() => {
    const foodId = localStorage.getItem("food_id");
    if (!foodId) {
      navigate("/")
    } else {
      fetchData(foodId);
    }
  }, [])

  const fetchData = async (foodId) => {
    const response = await axios.get(`${getFoodById}/${foodId}`)
    if (response.data.length > 0) {
      console.log(response.data[0]);
      setFoodDetails(response.data[0]);
    }
  }

  //  add to cart
  const addToCard=(food)=>{
    console.log(food)
    const useCoin=window.confirm(`do you want to add to card`)
    if(useCoin){
     if(!localStorage.getItem("cardFoods")){
      const cardFoods=Array({
      uniqueOrderId:Math.ceil(Math.random()*100000000000000+(999999999999999-100000000000000)).toString(),
      UserId:localStorage.getItem("UserId"),
      EmployeeId:EmployeeId,
      foodQuantity:1,
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
        cardFoods[indexOfFood].foodQuantity = cardFoods[indexOfFood].foodQuantity + 1;
      }else{
        const singleFood={
          uniqueOrderId:Math.ceil(Math.random()*100000000000000+(999999999999999-100000000000000)).toString(),
          UserId:localStorage.getItem("UserId"),
          EmployeeId:EmployeeId,
          foodQuantity:1,
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

  return (
    <>
      {foodDetails?<div className="review_page_container">
        {/* left part of laptop */}
        <div className="product_container">
          <div className="product_image">
            {/* insert main - image of cart */}
            <img src={foodDetails.foodimg} alt="" />
          </div>
          <div className="cart_add">
            {/* button add to cart */}
            <button onClick={()=>addToCard(foodDetails)} className="add_cart_button">
              <i class="fa-solid fa-cart-plus"></i>
              Add to Cart
            </button>
          </div>
        </div>

        <div className="product_summary">
          <div className="product_info_container">
            <div className="product_info">
              <h4 className="food_detail_heading">Food Details</h4>
              <div className="info_details">
                {/* add some details of products name, price, availabel, ave rating */}
                <div className="detail">
                  <b>Name : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>
                  <span> {foodDetails.foodname} </span>
                </div>
              </div>
              <div className="info_details">
                <div className="detail">
                  <b>
                    Price :
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </b>
                  <span> {foodDetails.foodprice}</span>
                </div>
              </div>
              <div className="info_details">
                <div className="detail">
                  <b>Available : &nbsp;</b>
                  <span>{foodDetails.foodAvailable ? "Yes" : "No"}</span>
                </div>
              </div>
              <div className="info_details">
                <div className="detail">
                  <b>Rating : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </b>
                  <div className="rating">
                    <i className={((foodDetails.testRate + foodDetails.hygienicRate + foodDetails.qualityRate) / foodDetails.totalRate) * 5 > 0 ? "fa-solid fa-star avarage_star" : "fa-regular fa-star avarage_star"}></i>
                    <i className={((foodDetails.testRate + foodDetails.hygienicRate + foodDetails.qualityRate) / foodDetails.totalRate) * 5 > 1 ? "fa-solid fa-star avarage_star" : "fa-regular fa-star avarage_star"}></i>
                    <i className={((foodDetails.testRate + foodDetails.hygienicRate + foodDetails.qualityRate) / foodDetails.totalRate) * 5 > 2 ? "fa-solid fa-star avarage_star" : "fa-regular fa-star avarage_star"}></i>
                    <i className={((foodDetails.testRate + foodDetails.hygienicRate + foodDetails.qualityRate) / foodDetails.totalRate) * 5 > 3 ? "fa-solid fa-star avarage_star" : "fa-regular fa-star avarage_star"}></i>
                    <i className={((foodDetails.testRate + foodDetails.hygienicRate + foodDetails.qualityRate) / foodDetails.totalRate) * 5 > 4 ? "fa-solid fa-star avarage_star" : "fa-regular fa-star avarage_star"}></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="product_rating">
              <h4 className="food_detail_heading">Food Rating</h4>
              <div className="rating_container">
                {/* add rating on particular 5,4,3,2,1 star */}
                <div className="rating_details">
                  <span className="star_name">
                    Test<i className="fa-solid fa-star small-rating-star"></i>
                  </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <input
                    min={1}
                    value={(foodDetails.testRate / (foodDetails.totalRate / 3)) * 100}
                    max={100}
                    className="range_input"
                    type="range"
                  />
                  <span>{Math.floor((foodDetails.testRate / (foodDetails.totalRate / 3)) * 100)}%</span>
                </div>
                <div className="rating_details">
                  <span className="star_name">
                    Hygienic<i className="fa-solid fa-star small-rating-star"></i>
                  </span>
                  <input
                    min={1}
                    value={(foodDetails.hygienicRate / (foodDetails.totalRate / 3)) * 100}
                    max={100}
                    className="range_input"
                    type="range"
                  />
                  <span>{Math.floor((foodDetails.hygienicRate / (foodDetails.totalRate / 3)) * 100)}%</span>
                </div>
                <div className="rating_details">
                  <span className="star_name">
                    Quality<i className="fa-solid fa-star small-rating-star"></i>
                  </span>&nbsp;&nbsp;
                  <input
                    min={1}
                    value={(foodDetails.qualityRate / (foodDetails.totalRate / 3)) * 100}
                    max={100}
                    className="range_input"
                    type="range"
                  />
                  <span>{Math.floor((foodDetails.qualityRate / (foodDetails.totalRate / 3)) * 100)}%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="product_review_container">
            <h4 className="food_detail_heading">Food Reviews</h4>
            <div className="user_comments_container">

              {/* indivisual comments */}
              {
                foodDetails.comment.map((item) => {
                  return (
                    <div className="user_comment">
                      <div className="user_details">
                        {/* fill user image */}
                        <img
                          className="user_image"
                          src={item.userImage}
                          alt=""
                          srcset=""
                        />
                        {/* name of user */}
                        <h4 className="user_name">{item.userName}</h4>
                      </div>
                      {/* user comments */}
                      <p className="comments_show">
                        {item.commentText}
                      </p>
                      {/* uploaded images */}
                      <div className="upload_images">
                        {
                          item.commentImage.map((imageUrl) => {
                            return (
                              <img
                                style={{ width: "100px", height: "100px", borderRadius: "10px" }}
                                className="upload_image"
                                src={imageUrl}
                                alt=""
                                srcset=""
                              />
                            )
                          })
                        }
                      </div>
                    </div>
                  )
                })
              }
              {/* ---------------------------------------------------------------------------------------- */}
            </div>
          </div>
        </div>
      </div>:<Spin/>}
      
    </>
  );
};

export default FoodReview;
