import React, { useEffect, useState } from 'react';
import {QrReader} from 'react-qr-reader';
import axios from 'axios'
import { expireQr, getOrderThroughQr } from '../utils/APIRoutes';
import { useNavigate } from 'react-router-dom';

const Test = () => {
  const [result, setResult] = useState(undefined);
  const [isCameraOn,setIsCameraOn]=useState(true);
  const navigate=useNavigate();

  useEffect(()=>{
     if(!localStorage.getItem("employee")){
      navigate("/")
     }
  },[])
  
  const handleScan = async(data) => {
    console.log("tiger")
    if (data&&isCameraOn) {
      console.log(data.text)
      const order = await axios.post(getOrderThroughQr,{qrId:data.text})
      console.log(order.data[0]);
      if(order.data.length>0){
        setResult(order.data[0]);
      }else{
        alert("invalid QR code");
      }
    }
  };

  const handleError = (error) => {
    console.error('Error while scanning QR code:', error);
  };

  return (
    <div style={{width:"100vw",height:"100vh",backgroundColor:"black",position:'fixed',top:0,zIndex:100,display:'flex',alignItems:"center",justifyContent:"center"}}>
      {/* after data fetched through qr code */}
     { result&&<div style={{display:'flex',justifyContent:'center', width:"100vw",height:"100vh",backgroundColor:"white",position:"fixed",top:0,zIndex:999}}>
      <div style={{width:"250px",display:'flex',flexDirection:"column",marginTop:"30px"}}>
       <div style={{padding:"5px",border:"1px solid gray"}}>
       <img style={{width:"100%"}} alt='...' src={result.foodimg}/>
        <div style={{padding:"10px"}}>
          <h4>Name : {result.foodname}</h4>
          <h4>Quantity : {result.foodQuantity}</h4>
          <h4>Price : {result.foodprice}</h4>
        </div>
        <div style={{display:"flex",justifyContent:"space-between"}}>
          <button className='btn btn-success' onClick={()=>setResult(undefined)}>CLOSE</button>

          <button className='btn btn-success' onClick={async()=>{
          const data=  await axios.post(`${expireQr}/${result.uniqueOrderId}`);
          setResult(undefined);
          }}>CONFIRM</button>
        </div>
       </div>
      </div>
      </div>}
      <div style={{width:"100vw"}}>
        <div onClick={()=>{setIsCameraOn(false);navigate("/")}} style={{display:"flex",cursor:"pointer",justifyContent:'center',alignItems:"center" ,width:"50px",height:"50px",borderRadius:"50%",backgroundColor:'#3d3939',position:"absolute",top:"10px",left:'10px',zIndex:4}}>
        <i style={{fontSize:"23px",fontWeight:"bold",color:"white"}} class="fa-solid fa-arrow-left"></i>
        </div>
       <QrReader
        delay={3000}
        onError={handleError}
        onScan={handleScan}
        onResult={(result) => handleScan(result)} // Add this line
        style={{ height: '100%',width:"100%" }}
      />
    </div>
  </div>
  );
};

export default Test;
