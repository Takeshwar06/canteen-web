import axios from 'axios';
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { getAllOrderForEmployee, updateOrder } from '../utils/APIRoutes';
import { useContext } from 'react';
import foodContext from './context/foods/foodContext';
// import "../../src/css/message.css"
export default function Message({socket}) {
  const {message}=useContext(foodContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  async function fetchdata() {
    const response = await axios.post(getAllOrderForEmployee)
    setOrders(response.data);
  }
  useEffect(() => {
    if (localStorage.getItem("employee")) {
    } else { navigate("/") }
    fetchdata();
  }, [])
  useEffect(()=>{
    if(socket.current){
      socket.current.on("recieve-order",(realTimeOrder)=>{
        console.log(realTimeOrder);
      })
    }
  },[])
  const upDateOrder = async (order) => {

    let response = await axios.post(`${updateOrder}/${order._id}`, { placed: true })
    if (response.data.acknowledged === true) {
      fetchdata();
    }
  }
  return (
    <Container>
      <div id="Contents">
        <div className="mainHead">
          <h1>Older Messages : </h1>
          <div id="Allmessages">
            <div className="messageBox">
              {orders.map((order) => {
                return (<>

                  <div className="showing my-2" key={order._id}>

                    {/* <div className="heads">
    <h2>Pendings Order Details</h2>
</div> */}
                    <div className="row">
                      <div className="dishDetails">
                        <div className="dishImg">
                          <img src="/images/dosa.jpg" alt="" srcSet="" />
                        </div>
                        <div className="dishInfo">
                          <div className="Name">Name :
                            <label htmlFor="">{order.foodname}</label>
                          </div>
                          <div className="Quantity">
                            <label htmlFor="">Qty : </label>
                            <label htmlFor="">{order.foodQuantity}</label>
                          </div>
                          <div className="price">
                            <label htmlFor="">Price : </label>
                            <label htmlFor="">{order.foodprice*order.foodQuantity}</label>
                          </div>
                        </div>
                      </div>
                      <div className="operationBtn">
                        <div className="btn">
                          <button><a href="#">Take</a></button>
                        </div>
                        <div className="btn">
                          <button onClick={() => { upDateOrder(order) }}><a>Complete</a></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
                )
              }
              )}
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
    border: none;
    background: none;
    /*background-color: rgb(211 193 186); */
    background-color: rgb(33, 219, 42);
    border-radius: 10px;
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
`