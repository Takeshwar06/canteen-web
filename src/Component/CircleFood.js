import React from 'react'
import { useContext } from 'react';
import foodContext from './context/foods/foodContext';
import { EmployeeId } from '../utils/APIRoutes';

export default function CircleFood({ food }) {
    const { paymentProcess } = useContext(foodContext);
    const addToCard = async (food) => {
        let foodCount = prompt(`do you want to add to card ${food.foodname}`);

        if (!isNaN(foodCount)) {
            // fetch api to add order   {to do something in food obj}
            if (Number(foodCount) !== 0) {
                if (!localStorage.getItem("cardFoods")) {
                    const cardFoods = Array({
                        uniqueOrderId: Math.ceil(Math.random() * 100000000000000 + (999999999999999 - 100000000000000)).toString(),
                        UserId: localStorage.getItem("UserId"),
                        EmployeeId: EmployeeId,
                        foodQuantity: Number(foodCount),
                        foodimg: food.foodimg,
                        foodname: food.foodname,
                        foodprice: food.foodprice,
                        _id: food._id
                    })
                    localStorage.setItem("cardFoods", JSON.stringify(cardFoods));
                } else {
                    const cardFoods = JSON.parse(localStorage.getItem("cardFoods"));
                    const indexOfFood = cardFoods.findIndex(obj => obj._id == food._id);
                    console.log(indexOfFood);
                    if (indexOfFood !== -1) {
                        cardFoods[indexOfFood].foodQuantity = cardFoods[indexOfFood].foodQuantity + Number(foodCount);
                    } else {
                        const singleFood = {
                            uniqueOrderId: Math.ceil(Math.random() * 100000000000000 + (999999999999999 - 100000000000000)).toString(),
                            UserId: localStorage.getItem("UserId"),
                            EmployeeId: EmployeeId,
                            foodQuantity: Number(foodCount),
                            foodimg: food.foodimg,
                            foodname: food.foodname,
                            foodprice: food.foodprice,
                            _id: food._id
                        }
                        cardFoods.push(singleFood);
                    }
                    localStorage.setItem("cardFoods", JSON.stringify(cardFoods));
                }
            }
        }
        else {
            alert("Quantity should be number form");
        }
    }
    return (

        <div id={`food-1 ${food._id}`} className="food" onClick={() => { addToCard(food) }}>
            <img src={food.foodimg} alt="" srcSet="" />
            <div className="label">
                <label style={{ textAlign: "center" }}>{food.foodname}</label>
            </div>
        </div>

    )
}
