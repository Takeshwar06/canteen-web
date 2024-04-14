import axios from 'axios'
import React from 'react'
import styled from 'styled-components'
import { useEffect } from 'react'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateAvailableRoute } from '../utils/APIRoutes'
import foodContext from '../context/foods/foodContext'
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
    const tempFoods=[...foods];
    foods.forEach((food,index)=>{
      if(food._id==id){
        tempFoods[index].foodAvailable=available;
        setfoods(tempFoods);
      }
    })
    let response = await axios.post(`${updateAvailableRoute}/${id}`, {
      foodAvailable: available
    })
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

  function setFoodToLocal(foodid){
    localStorage.setItem("food_id",foodid);
    navigate("/foodreview")
   }
  return (
    <Container>
      <div id="Contents">
        <div className="mainHead">
          <h2>Update Food</h2>
          <div id="search" className="searching">
                            <input value={searchTerm} onChange={handleSearchChange} style={{ borderRadius: "10px" }} type="text" name="search" id="searchTxt" placeholder="search your favorite dish" />
                          
                        </div>
          <div id="Allmessages">
            <div className="messageBox">
            {searchTerm.length<1 && foods.map((food) => {
                return (<>

                  <div className="showing my-2" key={food._id}>

     
                    <div className="row">
                      <div className="dishDetails">
                        <div className="dishImg">
                          <img onClick={()=>setFoodToLocal(food._id)} src={food.foodimg} alt="" srcSet="" />
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
                         {food.foodAvailable&&<button  style={{color:"#fff",backgroundColor:"var(--danger)",borderRadius:"var(--radius-pill)",border:"none"}} className='disableBtn' onClick={() => { foodAvailable(food._id, false) }}>notAvailable</button>}
                        </div>
                        <div className="btn">
                          {!food.foodAvailable&&<button style={{color:"#fff",backgroundColor:"var(--success)",borderRadius:"var(--radius-pill)",border:"none"}} className='disableBtn' onClick={() => { foodAvailable(food._id, true) }}>available</button>}
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
                          <img src={food.foodimg} alt="" srcSet="" />
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
                         {food.foodAvailable&&<button  style={{color:"#fff",backgroundColor:"var(--danger)",borderRadius:"var(--radius-pill)",border:"none"}} className='disableBtn' onClick={() => { foodAvailable(food._id, false) }}>notAvailable</button>}
                        </div>
                        <div className="btn">
                          {!food.foodAvailable&&<button style={{color:"#fff",backgroundColor:"var(--success)",borderRadius:"var(--radius-pill)",border:"none"}} className='disableBtn' onClick={() => { foodAvailable(food._id, true) }}>available</button>}
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
    font-family: var(--font);
}

#contents {
    margin: auto;
    width: 100%;
    border: 1px solid var(--border);
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
    font-weight: 600;
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
    border: 1px solid var(--border);
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
    padding: 0.7rem 1rem;
    width: 100%;
    margin: 0 0 1.5rem;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    font-family: var(--font);
    font-size: 1rem;
    background: var(--surface);
}

input[type="text"]:focus,
input[type="number"]:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(255, 90, 31, 0.12);
}

input[type="text"]::placeholder {
    font-size: 1rem;
    font-family: var(--font);
    color: var(--text-light);
}

input[type="number"]::placeholder {
    font-size: 1rem;
    font-family: var(--font);
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
    border: 1px solid var(--border);
    border-radius: 5px;
    background-color: rgb(231, 196, 196);
    font-family: var(--font);
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
    width: 100%;
    max-width: 1140px;
    padding: 1.5rem 1.25rem 3rem;
}
.mainHead h2 {
    font-size: 1.6rem;
    font-weight: 700;
    margin-bottom: 1.25rem;
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
    border: 1px solid var(--border);
    border-radius: 5px;
    padding: 2px;
    width: 100%;
    text-align: center;
}

.row {
    border: 1px solid var(--border);
    background-color: var(--surface);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem;
}

.dishImg {
    margin: 0;
}

.dishImg img {
    width: 120px;
    height: 100px;
    object-fit: cover;
    border: none;
    border-radius: var(--radius);
    margin: 0;
}

.dishDetails {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
}

.dishInfo {
    margin-left: 0;
    word-spacing: 1px;
    font-size: 1rem;
    line-height: 1.7;
}

.operationBtn {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: static;
    left: 0;
    gap: 0.5rem;
    flex-shrink: 0;
}

.btn button {
    margin: 0;
    padding: 0.5rem 1.1rem;
    border: none;
    color: #fff;
    border-radius: var(--radius-pill);
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn button:hover {
    filter: brightness(0.92);
}

.btn button:active {
    transform: scale(0.7);
}

.btn button a {
    font-family: var(--font);
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
        border: 1px solid var(--border);
        margin-top: 17px;
        background-color: var(--surface);
        border-radius: 5px;
        height: auto;
    }

    #Contents {
        margin: auto;
        width: 95%;
    }
}

@media only screen and (max-width : 788px) {

    .row {
        flex-direction: column;
        align-items: stretch;
        text-align: center;
        height: auto;
    }

    .dishDetails {
        flex-direction: column;
        text-align: center;
    }

    .operationBtn {
        position: static;
        left: 0;
        top: 0;
        justify-content: center;
    }
}
@media only screen and (max-width : 399px) {
  .row{
    margin-left: 0;
    width: 100%;
  }
  .dishInfo {
    margin-left: 0;
    word-spacing: 1px;
    font-size: 1rem;
}
.Name{
  font-size: 1rem;
}
#Contents h1 {
    font-size: 1.5rem;
}
.dishInfo label{
  font-size: 1rem;
}
}
`