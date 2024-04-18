import React, { useEffect } from "react";
import {BrowserRouter as Router,Routes,Route,
} from "react-router-dom";
import Addfood from "./pages/Addfood";
import Home from "./pages/Home";
import Message from "./pages/Message";
import Updatefood from "./pages/Updatefood";
import Navbar from "./components/Navbar";
import FoodState from "./context/foods/FoodState";
import Usermsg from "./pages/Usermsg";
// import Paymentsucess from "./pages/Paymentsucess"
import Report from "./pages/Report";
import StockEntry from "./pages/StockEntry";
import StockIssue from "./pages/StockIssue";
import { useState } from "react";
import axios from "axios";
import { createCoin, getCoin } from "./utils/APIRoutes";
import StockReport from "./pages/StockReport";
import Scanner from "./pages/Scanner";
import AddToCard from "./pages/AddToCard";
import Timmer from "./pages/Timmer";
import FoodReview from "./pages/FoodReview";
import OrderHistory from "./pages/OrderHistory";
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
        featchCoin();
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
     {/* opening curtain animation - disabled for now
     <div id="openingWeb">
                <div style={{right:`${webSlider&&"52vw"}`,visibility:`${webSlider&&"hidden"}`}} id="openLeft"> </div>
                <div style={{left:`${webSlider&&"52vw"}`,visibility:`${webSlider&&"hidden"}`}}  id="openRight"> </div>
     </div>
     */}
     <Navbar coin={userId}/>



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
         <div style={{paddingRight:"10px",paddingLeft:"10px",marginTop:"16px"}}>
         {!isAuthenticated && <p style={{textAlign:"center",color:"var(--text-muted)",fontSize:"0.9rem"}}>Login from the top to use your wallet</p>}
         {isAuthenticated && <p style={{textAlign:"center",color:"var(--text-muted)",fontSize:"0.9rem"}}>Remember your email id to keep your coins</p>}
         </div>
        <div style={{display:"flex",alignItems:"right",justifyContent:"right"}}>
        <button style={{marginRight:"20px",position:"relative",top:'-40px',padding:"2px 8px",backgroundColor:"var(--primary)",color:"#fff",borderRadius:"var(--radius-pill)",border:"none"}} className="my-5 " onClick={handlClosePop}>close</button>
        </div>
    </div>
     </div>
  </FoodState>
  );
}

export default App;
