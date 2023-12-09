import React from 'react'
import { useState } from 'react'
import { addfoodRoute } from '../utils/APIRoutes'
import axios from 'axios'
import { useContext } from 'react'
import foodContext from './context/foods/foodContext'
import { useEffect } from 'react'
import { useNavigate ,Link} from 'react-router-dom'
export default function Addfood() {
  
  const navigate=useNavigate();
  // const {socket}=useContext(foodContext);
  const [food,setFood]=useState({foodname:"",foodprice:"",foodimg:""})
  const [imgUploaded,setImgUploaded]=useState(true);

  useEffect(()=>{
    if(localStorage.getItem("employee")){
         navigate("/addfood");
    }else{navigate("/")}

  },[])
  
const name=(e)=>{
  setFood({...food,foodname:e.target.value})
}
const price=(e)=>{
  setFood({...food,foodprice:e.target.value})
}
const imgUploadToCloud=(e)=>{
  // setFood({...food,foodimg:e.target.files[0]})
  setImgUploaded(false);
  const formDate=new FormData();
  formDate.append("file",e.target.files[0]);
  formDate.append("upload_preset","foodimage");
  formDate.append("cloud_name","do3fiil0d")
  fetch("https://api.cloudinary.com/v1_1/do3fiil0d/image/upload",{
    method:"post",
    body:formDate
  }).then((res)=>res.json())
  .then((data)=>{
    setFood({...food,foodimg:`https${data.url.substring(4)}`})
    setImgUploaded(true);

  }) // set image 
  .catch((error)=>console.log(error))

}
const handleSubmit=(e)=>{
  e.preventDefault();
   if(food.foodimg.length<1){
    alert("please Reselect image")
    return;
   }
  else{
    const url=addfoodRoute;
       
      let response= axios.post(url,{
        foodimg:food.foodimg,
        foodprice:food.foodprice,
        foodname:food.foodname.toLocaleLowerCase(),
      }).then((res)=>{
          if(!res.data.status){
            alert(res.data.msg);
          }else{
            setFood({foodname:"",foodprice:"",foodimg:""})
          document.getElementById('fileInput').value = '';
          }

         }).catch((err)=>{
          console.log(err);
          alert("Internal server error")
        })
        // showAllFoods();
      //  socket.current.emit("send-order",response);
  }
    }

  return (
    <div className="container">
        <h2 className='my-3'>Add New Food</h2>
    <form className='my-3' onSubmit={handleSubmit}>
  <div className="mb-3">
    <label htmlFor="exampleInputEmail1" className="form-label">Dish Name</label>
    <input min={3} value={food.foodname} required onChange={name}type="text" className="form-control" id="dishname" aria-describedby="emailHelp"/>
    <div id="emailHelp" className="form-text"></div>
  </div>
  <div className="mb-3">
    <label htmlFor="exampleInputPassword1" className="form-label">Prize</label>
    <input required onChange={price} value={food.foodprice} type="number" className="form-control" id="exampleInputPassword1"/>
  </div>
  <div className="mb-3">
    <label htmlFor="exampleInputPassword1" className="form-label">food image</label>
    <input min={1} required onChange={imgUploadToCloud}type="file" className="form-control" id="fileInput"/>
  </div>
  <div className="mb-3 form-check">
    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
    <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
  </div>
  <button type="submit" className={`btn btn-primary ${!imgUploaded&&"disabled"}`}>{imgUploaded===false?<i class="fa-solid fa-spinner fa-spin"></i>:"Submit"}</button>
</form>
 <button style={{position:"relative",left:"90px",top:'-50px',backgroundColor:"blue",border:"1px solid black",borderRadius:"5px",padding:"2px 8px"}}><Link style={{textDecoration:"none",fontSize:"20px",color:"white"}} to="/stockissue">stockissue</Link></button>
    </div>
  )
}
