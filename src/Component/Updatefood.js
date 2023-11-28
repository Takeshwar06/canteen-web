import axios from 'axios'
import React from 'react'
import styled from 'styled-components'
import { useEffect } from 'react'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateAvailableRoute } from '../utils/APIRoutes'
import foodContext from './context/foods/foodContext'
import { useState } from 'react'

export default function Updatefood() {
  const [searchTerm,setSearchTerm]=useState("");
  const [searchFood,setSearchFood]=useState([])
  const navigate = useNavigate();
  const { foods,setfoods, showAllFoods } = useContext(foodContext)
  // to use showAllFoods();
  useEffect(() => {
    if (localStorage.getItem("employee")) {
      navigate("/updatefood");
    } else { navigate("/") }
    showAllFoods();
  }, [])

  const foodAvailable = async (id, available) => {
    // console.log("foodavbl",id,available);
    let response = await axios.post(`${updateAvailableRoute}/${id}`, {
      foodAvailable: available
    })
    if(response.data.acknowledged){
      showAllFoods();
    }
    // navigate("/updatefood")
  }

  const handleSearchChange=(e)=>{
    setSearchTerm(e.target.value);
    if(e.target.value!==""){
      const newFoodItem=foods.filter((element)=>{
        return element.foodname.toLowerCase().includes(e.target.value.toLowerCase());
      })
      setSearchFood(newFoodItem);
    }
    else{
    setSearchFood(foods);
    }
  }
  return (
    <Container>
      <div id="Contents">
        <div className="mainHead">
          <h2>Older Messages : </h2>
          <div id="search" className="searching">
                            <input  value={searchTerm}onChange={handleSearchChange} className='mx-3' style={{borderRadius:"10px 10px 10px 10px"}} type="text" name="search" id="searchTxt" placeholder="search your favorite dish"/>
                          
                        </div>
          <div id="Allmessages">
            <div className="messageBox">
            {searchTerm.length<1 && foods.map((food) => {
                return (<>

                  <div className="showing my-2" key={food._id}>

     
                    <div className="row">
                      <div className="dishDetails">
                        <div className="dishImg">
                          <img src={`/upload/${food.foodimg}`} alt="" srcSet="" />
                        </div>
                        <div className="dishInfo">
                          <div className="Name">Name :
                            <label htmlFor="">{food.foodname}</label>
                          </div>
                         
                          <div className="price">
                            <label htmlFor="">Price : </label>
                            <label htmlFor="">{food.foodprice}</label>
                          </div>
                        </div>
                      </div>
                      <div className="operationBtn">
                        <div className="btn">
                         {food.foodAvailable&&<button  style={{color:"red",backgroundColor:`${"rgb(142 223 193)"}`,borderRadius:"5px",border:"2px soild black"}} className='disableBtn' onClick={() => { foodAvailable(food._id, false) }}>notAvailable</button>}
                        </div>
                        <div className="btn">
                          {!food.foodAvailable&&<button style={{backgroundColor:"rgb(142 223 193)"}} className='disableBtn' onClick={() => { foodAvailable(food._id, true) }}>available</button>}
                        </div>
                      </div>
                    </div>
                  </div>
                </>)
              })
              }

{/* search food array */}
{searchTerm.length>0 && searchFood.map((food) => {
                return (<>

                  <div className="showing my-2" key={food._id}>

                    <div className="row">
                      <div className="dishDetails">
                        <div className="dishImg">
                          <img src={`/upload/${food.foodimg}`} alt="" srcSet="" />
                        </div>
                        <div className="dishInfo">
                          <div className="Name">Name :
                            <label htmlFor="">{food.foodname}</label>
                          </div>
                          {/* <div className="Quantity">
                            <label htmlFor="">Qty : </label>
                            <label htmlFor="">{food.foodQuantity}</label>
                          </div> */}
                          <div className="price">
                            <label htmlFor="">Price : </label>
                            <label htmlFor="">{food.foodprice}</label>
                          </div>
                        </div>
                      </div>
                      <div className="operationBtn">
                        <div className="btn">
                         {food.foodAvailable&&<button  style={{color:"red",backgroundColor:`${"rgb(142 223 193)"}`,borderRadius:"5px",border:"2px soild black"}} className='disableBtn' onClick={() => { foodAvailable(food._id, false) }}>notAvailable</button>}
                        </div>
                        <div className="btn">
                          {!food.foodAvailable&&<button style={{backgroundColor:"rgb(142 223 193)"}} className='disableBtn' onClick={() => { foodAvailable(food._id, true) }}>available</button>}
                        </div>
                      </div>
                    </div>
                  </div>
                </>)
              })
              }
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

const Container=styled.div`


* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

html,
body {
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
    overflow-x: hidden;
}

body {
    /* font-family: Verdana, Geneva, Tahoma, sans-serif; */
    font-family: "Bree serif", Verdana, Geneva, Tahoma, sans-serif;
}

#contents {
    margin: auto;
    width: 100%;
    border: 2px solid black;
}



#header {
    display: flex;
    align-items: center;
    justify-content: center;
}

#header #mainHead h1 {
    padding-top: 10px;
    margin-left: 25px;
    /* width: 300%; */
    font-weight: bold;
    font-size: 2.3rem;
    /* margin: 12px 0px 12px 14px; */
}

#header #logo img {
    height: 90px;
}


/* all menu btn properties is here */



#content {
    margin: auto;
    width: 50%;
    margin-top: 20px;
    border: 2px solid black;
    background: rgb(238, 234, 233);

}

#heading h1 {
    margin: 30px;
    margin-left: 100px;
}

.form label {
    font-size: 1.7rem;
    margin: 18px;
}

input[type="text"],
input[type="number"] {
    padding: 10px;
    width: 95%;
    margin: 23px;
    margin-bottom: 1.5rem;
    border: 2px solid black;
    border-radius: 5px;
    font-family: 'bree serif';
    font-size: 1.5rem;
}

input[type="text"]::placeholder {
    font-size: 1.5rem;
    font-family: 'bree serif';
}

input[type="number"]::placeholder {
    font-size: 1.5rem;
    font-family: 'bree serif';
}

input[type="number"],
input[type="file" i] {
    margin: 18px;
    font-size: 22px;
    cursor: pointer;
}

#checking {
    margin: 20px;
}

#checking input[type="checkbox"],
#checking label {
    cursor: pointer;
}

input[type="submit"] {
    cursor: pointer;
    width: 100%;
    padding: 5px;
    border: 2px solid black;
    border-radius: 5px;
    background-color: rgb(231, 196, 196);
    font-family: 'bree serif';
    font-size: 1.7rem;
    color: rebeccapurple;

}

#submitBtn {
    margin: 70px;
}


#submitBtn input[type="submit"]:hover {
    background-color: rgb(231, 169, 169);

}

#submitBtn input[type="submit"]:active {
    background-color: rgb(231, 196, 196);
    transform: scale(0.99);

}



#Contents {
    margin: auto;
    width: 60%;
}

#Contents h1 {
    margin-top: 1rem;
}


/* Main contents */
.heads {
    margin-top: 30px;
}

.heads h2 {
    background-color: #e54141;
    color: white;
    word-spacing: 5px;
    letter-spacing: 1px;
    border: 2px solid red;
    border-radius: 5px;
    padding: 2px;
    width: 100%;
    text-align: center;
}

.row {
    border: 2px solid black;
    background-color: #f5ebeb;
    border-radius: 5px;
}

.dishImg {
    margin: 5px;
}

.row {
    display: flex;
    align-items: center;
}

.dishImg img {
    width: 180px;
    margin-top: 2px;
    margin-left: 4px;
    height: 140px;
    border: none;
    border-radius: 5px;
}

.dishDetails {
    display: flex;
    align-items: center;
}

.dishInfo {
    margin-left: 30px;
    word-spacing: 1px;
    font-size: 1.7rem;
}

.operationBtn {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    left: 6rem;

}

.btn button {
    margin: 15px;
    padding: 2px 16px;
    border: 1px solid black;
    background: none;
    /*background-color: rgb(211 193 186); */
    background-color: rgb(33, 219, 42);
    border-radius: 5px;
    transition: all 0.8s ease;
}

.btn button:hover {
    background-color: rgba(85, 236, 15, 0.678);
    border-radius: 10px;
}

.btn button:active {
    transform: scale(0.7);
}

.btn button a {
    font-family: 'bree serif';
    text-decoration: none;
    color: red;
    font-size: 1.6rem;

}

@media only screen and (max-width: 1280px) and (min-width: 400px) {
/*
    .operationBtn {
        position: absolute;

        right: 5rem;
    } */

    .row {
        border: 2px solid black;
        margin-top: 17px;
        background-color: #f5ebeb;
        border-radius: 5px;
        height: 220px;
    }

    #Contents {
        margin: auto;
        width: 99%;
    }

    #header {
        margin-left: -20vw;
    }
}

@media only screen and (max-width : 788px) {

    #header #mainHead h1 {
        font-size: 2rem;
    }

    .row {
        flex-direction: column;
        height: 224px;
    }

    .operationBtn {
        position: relative;
        left: 1rem;
        top: -8px;
    }
}
@media only screen and (max-width : 399px) {
  .row{
    margin-left: -75px;
    width: 205%;
  }
  .dishInfo {
    margin-left: 1px;
    word-spacing: 1px;
    font-size: 1.7rem;
}
.Name{
  font-size: 1.5rem;
}
#Contents h1 {
    font-size: 1.9rem;
}
.dishInfo label{
  font-size: 1.5rem;
}
}
`