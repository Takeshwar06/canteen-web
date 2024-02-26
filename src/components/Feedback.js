import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Feedback.css";
import { upDateRated, upDateRating } from "../utils/APIRoutes";
import { useAuth0 } from "@auth0/auth0-react";
import {useRef, useCallback } from 'react';



const Feedback = ({setOpenRatingModal,userOrder,setUserOrder,currentOrderId,currnetFood}) => {
  const [testRate, setTestRate] = useState(0)
  const [hygienicRate, setHygienicRate] = useState(0)
  const [qualityRate, setQualityRate] = useState(0);
  const [commentText, setCommentText] = useState("")
  const [commentImage, setCommentImage] = useState([])
  const [isLoading,setIsLoading]=useState(false);
  const { loginWithRedirect,logout,user,isAuthenticated } = useAuth0();


 // submiting Rating
 const submitRating = async () => {
  setIsLoading(true);
  console.log("rating called")
  if (testRate > 0 && hygienicRate > 0 && qualityRate > 0) {
    // submiting to server
    const data = [...userOrder];
    const indexOfFood = data.findIndex(obj => obj.uniqueOrderId == currentOrderId);
    data[indexOfFood].rated = true;
    setUserOrder(data);
    await axios.post(`${upDateRated}/${currentOrderId}`);

    //rating submiting
    const response = await axios.post(`${upDateRating}/${currnetFood}`, {
      testRate,
      qualityRate,
      hygienicRate,
      commentText,
      commentImage,
      userName: user.name,
      userImage: user.picture
    })
    if (response.data.success === true) {
      console.log("submit rating")
      setIsLoading(false);
      setOpenRatingModal(false);
    } else {
      setIsLoading(false);
    }
  } else {
    alert("please submit proper rating")
    setIsLoading(false);
  }
}
const imgUploadToCloud=(e)=>{
  // setFood({...food,foodimg:e.target.files[0]})
  setIsLoading(true);
  const formDate=new FormData();
  formDate.append("file",e.target.files[0]);
  formDate.append("upload_preset","foodimage");
  formDate.append("cloud_name","do3fiil0d")
  fetch("https://api.cloudinary.com/v1_1/do3fiil0d/image/upload",{
    method:"post",
    body:formDate
  }).then((res)=>res.json())
  .then((data)=>{
    setIsLoading(false);
    console.log(data);
    const images=[...commentImage];
    images.push(`https${data.url.substring(4)}`);
    setCommentImage(images);

  }) // set image 
  .catch((error)=>{console.log(error);setIsLoading(false)})

}
  return (
    <>

      <div className="feedback_container">
        <div className="feedback_circle">
          <i onClick={ ()=>setOpenRatingModal(false)} className="fa-solid fa-close close_button " ></i>
          <div className="feedback_form">
            <h3 className="feedback_heading">Please rate this food</h3>
            <div className="star_container">
              <div className="stars_box">
                <span>Test -</span>
                <div className="stars">
                  <i onClick={()=>setTestRate(1)} class={`${testRate>0?"fa-solid fa-star":"fa-regular fa-star"}`}></i>
                  <i onClick={()=>setTestRate(2)} class={`${testRate>1?"fa-solid fa-star":"fa-regular fa-star"}`}></i>
                  <i onClick={()=>setTestRate(3)} class={`${testRate>2?"fa-solid fa-star":"fa-regular fa-star"}`}></i>
                  <i onClick={()=>setTestRate(4)} class={`${testRate>3?"fa-solid fa-star":"fa-regular fa-star"}`}></i>
                  <i onClick={()=>setTestRate(5)} class={`${testRate>4?"fa-solid fa-star":"fa-regular fa-star"}`}></i>
                </div>
              </div>
              <div className="stars_box">
                <span>Hygiene -</span>
                <div className="stars">
                  <i onClick={()=>setHygienicRate(1)} class={`${hygienicRate>0?"fa-solid fa-star":"fa-regular fa-star"}`}></i>
                  <i onClick={()=>setHygienicRate(2)} class={`${hygienicRate>1?"fa-solid fa-star":"fa-regular fa-star"}`}></i>
                  <i onClick={()=>setHygienicRate(3)} class={`${hygienicRate>2?"fa-solid fa-star":"fa-regular fa-star"}`}></i>
                  <i onClick={()=>setHygienicRate(4)} class={`${hygienicRate>3?"fa-solid fa-star":"fa-regular fa-star"}`}></i>
                  <i onClick={()=>setHygienicRate(5)} class={`${hygienicRate>4?"fa-solid fa-star":"fa-regular fa-star"}`}></i>
                </div>
              </div>
              <div className="stars_box">
                <span>Quality -</span>
                <div className="stars">
                  <i onClick={()=>setQualityRate(1)} class={`${qualityRate>0?"fa-solid fa-star":"fa-regular fa-star"}`}></i>
                  <i onClick={()=>setQualityRate(2)} class={`${qualityRate>1?"fa-solid fa-star":"fa-regular fa-star"}`}></i>
                  <i onClick={()=>setQualityRate(3)} class={`${qualityRate>2?"fa-solid fa-star":"fa-regular fa-star"}`}></i>
                  <i onClick={()=>setQualityRate(4)} class={`${qualityRate>3?"fa-solid fa-star":"fa-regular fa-star"}`}></i>
                  <i onClick={()=>setQualityRate(5)} class={`${qualityRate>4?"fa-solid fa-star":"fa-regular fa-star"}`}></i>
                </div>
              </div>
            </div>
            <div className="feedback_comment">
              <h3 className="low_heading" >Comment(optional)</h3>
              <textarea
              value={commentText}
              onChange={e=>setCommentText(e.target.value)}
                name=""
                id="comment_textarea"
                placeholder="Write Comment here"
              ></textarea>
            </div>
            <div className="feedback_image">
              <h3 className="low_heading" >Image upload(optional)</h3>
              <label htmlFor="feedback_image_upload" id="upload_image_label">
                <i class="fa-solid fa-camera"></i> 
                {isLoading?"loading...":<>Take Image</>}
              </label>
              <input
                onChange={imgUploadToCloud}
                type="file"
                name=""
                id="feedback_image_upload"
                style={{ display: "none" }}
              />
            </div>
           {commentImage.length>0&&<div style={{marginTop:"7px",display:"flex",flexDirection:"row",overflow:"scroll"}}>
              {
                commentImage.map((imageUrl)=>{
                  return(
                    <img style={{height:"60px",width:"60px",marginLeft:"5px",borderRadius:"5px",border:"1px solid grey"}} src={imageUrl} alt="img"/>
                  )
                })
              }
            </div>}
            <div style={{marginTop:"-13px"}} className="feedback_button">
              <button onClick={submitRating} className="feedback_submit">{isLoading?"Loading...":"Submit Rating"}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Feedback;
