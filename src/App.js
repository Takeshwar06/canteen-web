import React, { useEffect } from "react";
import {BrowserRouter as Router,Routes,Route,
} from "react-router-dom";
import Addfood from "./Component/Addfood";
import Home from "./Component/Home";
import Message from "./Component/Message";
import Updatefood from "./Component/Updatefood";
import Navbar from "./Component/Navbar"; 
import FoodState from "./Component/context/foods/FoodState";
import Usermsg from "./Component/Usermsg";
// import Paymentsucess from "./Component/Paymentsucess"
import Report from "./Component/Report";
import StockEntry from "./Component/StockEntry";
import StockIssue from "./Component/StockIssue";
import { useState } from "react";
import axios from "axios";
import { createCoin, getCoin } from "./utils/APIRoutes";
import StockReport from "./Component/StockReport";
import Scanner from "./Component/Scanner";
import AddToCard from "./Component/AddToCard";
import Timmer from "./Timmer";
import FoodReview from "./Component/FoodReview";
import OrderHistory from "./Component/OrderHistory";
import { useAuth0 } from "@auth0/auth0-react";
// https://canteenfrontend-nwpn.onrender.com
function App() {
  const { loginWithRedirect,logout,user,isAuthenticated } = useAuth0();
    const [webSlider,setWebSlider]=useState(false);
    const [popup,setpopup]=useState(false);
    const [userId,setUserId]=useState(undefined)
    const [showDownload,setShowDownload]=useState(true);

    useEffect(()=>{
     setWebSlider(true);
    },[])

   useEffect(()=>{
    const userAuthentication = async()=>{
      const response= await axios.post(createCoin,{
          userName:user.name,
          userEmail:user.email,
          userImage:user.picture
      })
      if(response.data.userId){
        localStorage.setItem("UserId",response.data.userId)
      }
    }
  if(isAuthenticated){
    userAuthentication();
  }
   },[user,isAuthenticated])

    const featchCoin=async()=>{
       const data=await axios.post(getCoin,{userId:localStorage.getItem("UserId")})
       if(data.data.length>0){
        setUserId(data.data[0].coin);
       }
    }
   const handlClosePop=()=>{
    setpopup(false);
   }

   const handleSend=async()=>{
    loginWithRedirect();
   }

  return (
<FoodState >
 <Router>
 <div id="container" className={`blur ${popup&&"active"}`}>
 {/* <div id="contents" style={{height: '100vh'}}> */}
     <div id="openingWeb">
                <div style={{right:`${webSlider&&"52vw"}`,visibility:`${webSlider&&"hidden"}`}} id="openLeft"> </div>
                <div style={{left:`${webSlider&&"52vw"}`,visibility:`${webSlider&&"hidden"}`}}  id="openRight"> </div>
     </div>
     <Navbar/>



     {/* <div className="container"> */}
        <Routes>
          <Route exact path="/" element={<Home showDownload={showDownload} setShowDownload={setShowDownload} />}></Route>
          <Route exact path="/addfood" element={<Addfood/>} ></Route>
          <Route exact path="/updatefood" element={<Updatefood  />} ></Route>
          {/* <Route exact path="/message" element={<Message socket={socket} />} ></Route> */}
          <Route exact path="/scanner" element={<Scanner featchCoin={featchCoin} setpopup={setpopup} />} ></Route>
          <Route exact path="/message" element={<Usermsg featchCoin={featchCoin} setpopup={setpopup} />} ></Route>
          <Route exact path="/foodreport" element={<Report  />} ></Route>
          <Route exact path="/card" element={<AddToCard  />} ></Route>
          <Route exact path="/foodreview" element={<FoodReview  />} ></Route>
          <Route exact path="/orderhistory" element={<OrderHistory  />} ></Route>
          {/* <Route exact path="/paymentsuccess" element={<Paymentsucess />} ></Route> */}
          <Route exact path="/stockentry" element={<StockEntry/>}></Route>
          <Route exact path="/stockissue" element={<StockIssue/>}></Route>
          <Route exact path="/stockreport" element={<StockReport/>}></Route>
          <Route exact path="/timmer" element={<Timmer/>}></Route>
        </Routes>
        </div>
        
        {/* </div> */}
      </Router>     
      

     <div className="coin-popup">
     <div  id="allBox" className={`allBox ${popup&&"open-popup"}`} >
        <img className="images my-3" src={isAuthenticated?user.picture:"https://res.cloudinary.com/do3fiil0d/image/upload/v1702630521/canteen-user_mcfnzg.jpg"} alt="" srcset=""/>
        <h3 className="text-center">Wallet ₹{!userId?0:userId} </h3>
        <hr/>
        <h2>Name : {isAuthenticated?user.name:"canteen-user"} </h2>
        <div style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center",marginTop:
      "20px"}} id="userId">
        {!isAuthenticated?<button style={{backgroundColor:`${"rgb(142 223 193)"}`,borderRadius:"5px",border:"2px soild black",padding:"2px 8px"}} onClick={handleSend}>login</button>
        :<button style={{backgroundColor:`${"rgb(142 223 193)"}`,borderRadius:"5px",border:"2px soild black",padding:"2px 8px"}} onClick={()=>{localStorage.removeItem("UserId");logout({ logoutParams: { returnTo: `${window.location.origin}/message` } })}}>logout</button>}<br />
        
        </div>
         <div style={{paddingRight:"10px",paddingLeft:"10px"}}>
         <p style={{textAlign:"center",color:"grey",}}>if you have coin then remeber your email id to login</p>
         </div>
        <div style={{display:"flex",alignItems:"right",justifyContent:"right"}}>
        <button style={{marginRight:"20px",position:"relative",top:'-40px',padding:"2px 8px",backgroundColor:`${"rgb(142 223 193)"}`,borderRadius:"5px",border:"2px soild black"}} className="my-5 " onClick={handlClosePop}>close</button>
        </div>
    </div>
     </div>
  </FoodState>
  );
}

export default App;
