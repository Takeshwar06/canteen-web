import axios from 'axios';
import { io } from 'socket.io-client'
import React, { Fragment } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import styled from 'styled-components';
import foodContext from './context/foods/foodContext';
import { addCoin, expireQr, getAllOrderForEmployee, getCoin, host, updateCoin, updateOrder, updateReject, updateTake } from '../utils/APIRoutes';
//import "../../src/css/message.css"
import { useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { EmployeeId, getAllOrderForUser, updateDeleted } from '../utils/APIRoutes';
import { useRef } from 'react';

export default function Usermsg({ setpopup, featchCoin }) {

  const socket = useRef();
  const [orders, setOrders] = useState([]);
  const { addOrder, refreshAfterAddFood } = useContext(foodContext);
  const searchQuery = useSearchParams()[0];
  const referenceNum = searchQuery.get("reference");
  const [userOrder, setUserOrder] = useState([]);
  const [qrUrl, setQrUrl] = useState(null);

  useEffect(() => {
    socket.current = io(host)
    socket.current.emit("add-user", localStorage.getItem("UserId"))
    if (localStorage.getItem('employee')) {
      socket.current.emit("add-employee", localStorage.getItem("uniqueEmployeeId"));
    }
  }, [])

  useEffect(() => {
    if (referenceNum) {
      const cardFoods = JSON.parse(localStorage.getItem("cardFoods"));
      if (cardFoods) {
        // for(let i=0;i<5;i++){
        socket.current.emit("send-order", {
          cardFoods, referenceNum
        })
        addOrder(cardFoods, referenceNum);
        // }
      }
      localStorage.removeItem("cardFoods")
      fetchdata();
    }
  }, [referenceNum])

  async function fetchdata() {
    let response = await axios.post(getAllOrderForUser, {
      UserId: localStorage.getItem("UserId"),
      EmployeeId: EmployeeId
    })
    setUserOrder(response.data);
  }
  useEffect(() => {
    fetchdata();
  }, [refreshAfterAddFood])

  const orderDeleted = async (Order, index) => {
    const data = [...userOrder]
    data.splice(index, 1);
    setUserOrder(data);
    let response = await axios.post(`${updateDeleted}/${Order.uniqueOrderId}`, { deleted: true })
    //  fetchdata();
  }


  // for employee
  const navigate = useNavigate();
  async function empfetchdata() {
    const response = await axios.post(getAllOrderForEmployee)
    console.log("emp fetching start")
    setOrders(response.data);
  }

  useEffect(() => {
    if (localStorage.getItem("employee")) {
      empfetchdata();
    }
  }, [])

  useEffect(() => {
    if (socket.current) {
      console.log("recieve-order called")
      socket.current.on("recieve-order", (data) => {
        let temp2 = [] // data=[...orders]
        data.cardFoods.forEach((food) => {
          let tempOrder = {
            take: { notTaken: true, takenByMe: null },
            rejected: false,
            deleted: false,
            auth: [food.UserId, food.EmployeeId],
            foodQuantity: food.foodQuantity,
            foodimg: food.foodimg,
            foodname: food.foodname,
            foodprice: food.foodprice,
            order_id: data.referenceNum,
            uniqueOrderId: food.uniqueOrderId
          }
          if (orders.length === 1) {  // using orders.length>0 concept
            //   // setOrders([...orders,tempOrder])    
            empfetchdata();
          }
          temp2.push(tempOrder);
        })
        let temp1 = [...orders]
        let mergedArray = temp1.concat(temp2)
        setOrders(mergedArray)
        // setOrders((prevOrderss) => [...prevOrderss, ...temp2]);
        // }
      })
    }

  }, [orders])

  const upDateOrder = async (order, index) => {
    console.log(order);
    const data = [...orders];
    data.splice(index, 1);
    socket.current.emit("complete-order", order);
    setOrders(data);
    const response = await axios.post(`${updateOrder}/${order.uniqueOrderId}`, { placed: true })
    // empfetchdata();
  }

  const rejectOrder = async (order, index) => {
    console.log(order);
    const data = [...orders];
    data.splice(index, 1);
    setOrders(data);
    socket.current.emit("reject-order", order);
    const result = await axios.post(`${updateReject}/${order.uniqueOrderId}`, { rejected: true })
    console.log("result", result)
    await axios.post(`${expireQr}/${order.uniqueOrderId}`)

    const presentUser = await axios.post(getCoin, { userId: order.auth[0] })
    if (presentUser.data.length > 0) {
      // updateCoin
      const response = await axios.post(updateCoin, {
        userId: presentUser.data[0].userId,
        updatedCoin: presentUser.data[0].coin + (order.foodprice * order.foodQuantity)
      })
    }
    else {
      //  addCoin
      const response = await axios.post(addCoin, { userId: order.auth[0], coin: order.foodprice * order.foodQuantity })
    }
  }

  useEffect(() => {
    if (socket.current) {
      socket.current.on("rejected-order", (data) => {
        console.log("rejected-orderr before check user id")
        if (localStorage.getItem("UserId") == data.auth[0]) {
          console.log("rejected-orderr after check user id")
          const tempUserOrder = [...userOrder]
          userOrder.forEach((element, index) => {
            if (element.uniqueOrderId == data.uniqueOrderId) {
              tempUserOrder[index].rejected = true;
              tempUserOrder[index].QRvalid = false;
              setUserOrder(tempUserOrder);
            }
          })
        }
      })
    }
  }, [userOrder, orders, rejectOrder])

  const takeOrder = async (order, employeeId, index) => {
    console.log("empid", order); //

    if (employeeId) {
      socket.current.emit("take-order", { order, employeeId, index });
      const data = [...orders];
      data[index].take.notTaken = false;
      data[index].take.takenByMe = employeeId;
      setOrders(data);
      const response = await axios.post(`${updateTake}/${order.uniqueOrderId}`, {
        take: {
          notTaken: false,
          takenByMe: employeeId
        }
      })

    }
  }

  useEffect(() => {
    if (socket.current) {
      socket.current.on("took-order", ({ order, employeeId, index }) => {
        console.log("took-order called", employeeId)
        if (localStorage.getItem("employee")) {
          let data = [...orders];
          console.log(data);
          const indexOfFood = data.findIndex(obj => obj.uniqueOrderId == order.uniqueOrderId);
          console.log(indexOfFood);
          if (indexOfFood !== -1) {
            order.take.notTaken = false;
            order.take.takenByMe = employeeId;
            data[indexOfFood] = order
            console.log("data[index]", data[indexOfFood])
            setOrders(data);
          }
        }
      })
    }
  }, [orders])

  useEffect(() => {
    if (socket.current) {
      socket.current.on("completed-order", (data) => {
        console.log("completed-order before check user id");
        if (localStorage.getItem("UserId") == data.auth[0]) {
          console.log("completed-order after check user id");
          const tempUserOrder = [...userOrder]
          userOrder.forEach((element, index) => {
            if (element.uniqueOrderId == data.uniqueOrderId) {
              tempUserOrder[index].placed = true;
              setUserOrder(tempUserOrder);
            }
          })
        }
      })
    }
  }, [userOrder, orders, upDateOrder])

  const handlePopUp = () => {
    setpopup(true);
    featchCoin();
  }
  return (<>
    {!localStorage.getItem("employee") && <Fragment>
      {/* when qr url not null */}
      {qrUrl && <div className='QrBox' style={{ justifyContent: "center", alignItems: "center", display: "flex", backgroundColor: "white", width: "100vw", height: "100vh", position: 'fixed', top: 0, right: 0, zIndex: 99 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "300px", height: "400px" }}>
          <p style={{ textAlign: 'center' }}>After 2 hour QR will be expire,When food prepared</p>
          <img style={{ width: "300px", height: "300px" }} src={qrUrl} alt='...' />
          <button className='btn btn-success' onClick={() => setQrUrl(null)}>CLOSE</button>
        </div>
      </div>}
      <div className="container"><h3>Order details
        <span style={{ float: "right", color: "#6a5103", }}>Coin:<b id='coin' style={{ fontSize: "35px", cursor: "pointer", }} onClick={handlePopUp}>⚜</b></span></h3></div>
      {
        userOrder.map((Order, index) => {
          return (
            <div key={Order._id} className='container'>
              {<div className="card mb-3 my-3" style={{ maxWidth: "540px", backgroundColor: "#bee7ef" }}>
                {!Order.rejected && <span className={`badge text-bg-${Order.placed ? "success" : "danger"}`}> <b>{Order.placed ? "prepared" : "preparing"}</b> </span>}
                {Order.rejected && <span className={`badge text-bg-warning`}> <b>Rejected</b> </span>}
                <div style={{ display: "flex", marginBottom: "5px" }}>
                  <div>
                    <img style={{ height: "125px", width: "125px" }} src={Order.foodimg} className="img-fluid rounded-start" alt="..." />
                  </div>
                  <div style={{ marginLeft: "30px" }}>
                    <h4 className="card-title">{Order.foodname}</h4>
                    <h5 className="card-text">Quantity - {Order.foodQuantity}</h5>
                    <h5 className="card-text">Price - {Order.foodQuantity * Order.foodprice}</h5>
                    <small style={{ color: "red" }} className="card-title">{Order.order_id}{Order.rejected && " Reject-Order"}</small>
                  </div>
                </div>
                <p className="card-text">
                  {Order.rejected && <button onClick={() => { orderDeleted(Order, index) }} className="btn btn-dark" style={{ float: "right", marginRight: "10px" }}>delete</button>}
                  {Order.placed && !Order.QRvalid && <button onClick={() => { orderDeleted(Order, index) }} className="btn btn-dark" style={{ float: "right", marginRight: "10px" }}>delete</button>}
                  {Order.QRvalid && <button onClick={() => setQrUrl(Order.QRurl)} className="btn btn-dark" style={{ float: "right", marginLeft: "10px", marginRight: "10px" }}>QR</button>}
                </p>
                <small className="mx-3" style={{ color: "red" }}>
                  {Order.date.toString().substring(0, 10)}
                </small>
              </div>}
            </div>
          )
        })}</Fragment>}


    {/* employeee message */}

    {localStorage.getItem("employee") && <Container>
      <div id="Contents">
        <div className="mainHead">
          <h1>Older Messages : </h1>
          <div id="Allmessages">
            <div className="messageBox">
              {orders.map((order, index) => {
                return (<>

                  {(localStorage.getItem("uniqueEmployeeId") === order.take.takenByMe ||
                    order.take.notTaken) && <div className="showing my-2" key={order._id}>

                      <div className="row">
                        <div className="dishDetails">
                          <div className="dishImg">
                            <img style={{ marginLeft: "5px" }} src={order.foodimg} alt="" srcSet="" />
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
                              <label htmlFor="">{order.foodprice * order.foodQuantity}</label>
                            </div>
                            <p style={{ fontSize: "15px" }}>id {order.uniqueOrderId}</p>
                          </div>
                        </div>
                        <div className="operationBtn">
                          {order.take.notTaken && <div className="btn">
                            <button className="disableBtn" style={{ backgroundColor: "rgb(82 219 80)" }} onClick={() => takeOrder(order, localStorage.getItem('uniqueEmployeeId'), index)} >take</button>
                          </div>}
                          {!order.take.notTaken && <div className="btn">
                            <button className='disableBtn' style={{ backgroundColor: "rgb(82 219 80)" }} onClick={() => { upDateOrder(order, index) }}>Complete</button>
                          </div>}
                          {!order.take.notTaken && <button style={{ backgroundColor: "rgb(219 80 80)", border: "1px solid black", borderRadius: "5px", padding: "2px 8px" }} onClick={() => rejectOrder(order, index)}>Reject</button>}
                        </div>
                      </div>
                    </div>}
                </>
                )
              }
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>}
  </>



  )
}

const Container = styled.div`
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

        #navbar {
            position: sticky;
            top: 0px;
            margin: auto;
            width: 100%;
            overflow: hidden;
            border: 3px solid rgb(120, 120, 236);
            background-color: rgb(225, 204, 240);
            z-index: 1;
        }

        #nav {
            padding: 9px;
            /* border: 3px solid rgb(120, 120, 236);
            background-color: rgb(225, 204, 240); */
            height: 110px;
            margin: auto;
            width: 50%;
            display: flex;
            align-items: center;
            border-radius: 2px;
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
        nav ul {
            display: flex;
            position: absolute;
            list-style: none;
            right: 16rem;
        }

        nav ul li {
            margin: 0 11px;
            margin-top: -5px;
        }

        nav ul li a {
            font-size: 20px;
            font-weight: 500;
            /* color: #fff; */
            color: red;
            text-decoration: none;
            letter-spacing: 1px;
            border-radius: 5px;
            padding: 8px 10px;
            transition: all 0.4s ease;
        }

        nav ul li a:hover {
            color: #1b1b1b;
            background-color: white;
        }

        nav ul li #active {
            color: #1b1b1b;
            background-color: white;
        }

        nav ul li #active:active,
        nav ul li a:active {
            background-color: rgb(233, 127, 127);
        }

        nav .menu-btn {
            color: #f2f2f2;
            font-size: 25px;
            cursor: pointer;
            display: none;
        }

        #click {
            display: none;
        }

        .menu-btn i {
            position: fixed;
            right: 2.5rem;
            top: 3.5rem;
            /*  right: 53rem;
            top: 12px;*/
            color: black;
        }
      

        @media (max-width: 1282px) {
            nav .menu-btn {
                display: block;
            }

            #click:checked~.menu-btn i::before {
                content: "\f00d";
                font-size: 20px;
            }

            nav ul {
                position: fixed;
                top: 0px;
                left: 50%;
                right: 50%;

                transform: translate(-50%, -50%) scale(0.4);
                text-align: center;
                visibility: hidden;
                /* left: -100%; */

                background: #1b1b1b;
                margin: auto;
                height: 200px;
                /* margin : auto; */
                width: 100%;
                display: block;
                text-align: center;
                transition: all 0.4s ease;
            }
          
            #click:checked~ul {
                left: 0%;
                visibility: visible;
                height: 164px;
                top: 12.4rem;
                transform: translate(-0%, -50%) scale(1);
            }

            nav ul li {
                margin: 40px 0;
            }

            nav ul li a {
                font-size: 20px;
                font-weight: 500;
                /* color: #fff; */
                color: red;
                text-decoration: none;
                letter-spacing: 1px;
                border-radius: 5px;
                padding: 8px 10px;
                transition: all 0.4s ease;
            }

            /* nav ul li a:hover,
            nav ul li #active{
                color : cyan;
                background: none;
            }
            */
        }

        #allBtn {
            margin: 0.5% auto;
            position: absolute;
            right: 6%;
        }

        #allBtn #buttons {
            margin-top: 4%;
            display: flex;
        }


        .menuBtn a:hover {
            background-color: #f2f2f2;
        }

        .menuBtn a:active {
            transform: scale(0.999999);
        }




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

        @media only screen and (max-width: 1280px){
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

        @media only screen and (max-width: 409px) {
            #Contents h1 {
                margin-top: 1rem;
                margin-left: 15px;
                font-size: 1.6rem;
            }

            .heads h2 {
                font-size: 1.3rem;
                word-spacing: 1px;
            }
            .dishImg img {
                width: 171px;
                margin-top: 0px;
                margin-left: -11px;
                height: 132px;
                border: none;
                border-radius: 5px;
            
            }
            .dishInfo {
                margin-left: 1px;
                word-spacing: 1px;
                font-size: 1.5rem;
            }
        }
`
