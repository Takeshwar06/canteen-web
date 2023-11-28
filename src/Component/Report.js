import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getAllFoodsRoute, getAllOrderForEmployee,Head } from '../utils/APIRoutes';
import FoodTable from './FoodTable';
// implement startingdate to ending date (start-00:00:00.000Z to end-23:59:59:999Z)
export default function Report() {
  const [foodMap,setFoodMap]=useState(undefined);
  const [realFood,setRealFood]=useState(undefined);
  const [wise,setWise]=useState("day");
  const [inputDate,setInputDate]=useState({inpStartingDate:"",inpEndingDate:""})
  const [dateIncreament,setDateIncreament]=useState({increamentDay:0,increamentMonth:0,increamentYear:0})
  const [orderArray,setOrderArray]=useState([])
    const searchQuery=useSearchParams()[0]
    const navigate=useNavigate()
     useEffect(()=>{
        if(!localStorage.getItem("manager")){
           navigate("/")
        }
     },[])
   const handleFoodMap=async(e)=>{
    e.preventDefault();
    setRealFood(undefined)
    // setOrderArray();
      // create Map for foodname and price quaintity
      console.log("befor")
        const mymap=new Map();
        const {data}=await axios.get(getAllFoodsRoute);
        for(let i=0;i<data.length;i++){
          mymap.set(`${data[i].foodname}`,{price:data[i].foodprice,quantity:0})
        }
        setFoodMap(mymap)
        console.log("after")

   }


   const featchMoreData=async()=>{
    let Order=[...orderArray]
    console.log(dateIncreament);
       if(wise==='day'){
          setDateIncreament({...dateIncreament,increamentDay:dateIncreament.increamentDay+1})
          if(dateIncreament.increamentDay>30){
            setDateIncreament({...dateIncreament,increamentDay:1,increamentMonth:dateIncreament.increamentMonth+1})
          }
          if(dateIncreament.increamentMonth>12){
            setDateIncreament({...dateIncreament,increamentMonth:1,increamentYear:dateIncreament.increamentYear+1})
          }
          let day=dateIncreament.increamentDay;
          if(day<10){
            day=`0${day}`
          }
          console.log("day",day)
          let month=dateIncreament.increamentMonth;
          // if(month>12){
          //   month=1;
          // }
          if(month<10){
            month=`0${month}`
          }
          
          console.log("month",month)
          let year=dateIncreament.increamentYear;
          console.log("year",year)
        if(month<=12) { const {data}=await axios.post(getAllOrderForEmployee,{
            Head,day,month,year,wise
          }) 

          setOrderArray(data);}
       }
       else if(wise==="month"){
          setDateIncreament({...dateIncreament,increamentMonth:dateIncreament.increamentMonth+1})
          if(dateIncreament.increamentMonth>12){
            setDateIncreament({...dateIncreament,increamentMonth:1,increamentYear:dateIncreament.increamentYear+1})
          }
          let month=dateIncreament.increamentMonth;
          if(month<10){
            month=`0${month}`
          }
          let year=dateIncreament.increamentYear;
        if(month<=12)  {const {data}=await axios.post(getAllOrderForEmployee,{
            Head,month,year,wise
          }) 
          setOrderArray(data);}
       }
       else if(wise==="year"){
          setDateIncreament({...dateIncreament,increamentYear:dateIncreament.increamentYear+1})
  
          let year=dateIncreament.increamentYear;
          const {data}=await axios.post(getAllOrderForEmployee,{
            Head,year,wise
          }) 
          setOrderArray(data);
       }
   }

   useEffect(()=>{
    if(foodMap){
     // take start date and create new Date object
     const inpStartingDate=new Date(inputDate.inpStartingDate);
      let day =inpStartingDate.getDate()
        if(day<10){
          day=`0${day}`
        }
      let month =inpStartingDate.getMonth()+1;
         if(month<10){
          month=`0${month}`
         }
      let year =inpStartingDate.getFullYear()
      if(year<1000){
        year=`0${year}`
      }

      // for startDate to endDate featching Data
      if(inputDate.inpEndingDate.length>0){
        const inpEndingDate=new Date(inputDate.inpEndingDate)
        let endDay =inpEndingDate.getDate()
        if(endDay<10){
          endDay=`0${endDay}`
        }
      let endMonth =inpEndingDate.getMonth()+1;
         if(endMonth<10){
          endMonth=`0${endMonth}`
         }
      let endYear =inpEndingDate.getFullYear()
      if(endYear<1000){
        endYear=`0${endYear}`
      }
      
      // featchData to backend
     const featchData=async()=>{
       const {data}=await axios.post(getAllOrderForEmployee,{
        Head,day,month,year,endDay,endMonth,endYear
       })
       setOrderArray(data);
     }
     
     featchData();
      }
      // for featching Data to single Date
      else{   
      const featchData=async()=>{
      if(wise==="day"){
        const {data}=await axios.post(getAllOrderForEmployee,{
          Head,day,month,year,wise
        }) 
        setOrderArray(data);
        setDateIncreament({
          increamentDay:day+1,
          increamentMonth:month,
          increamentYear:year
        })
        console.log("1")
      }else if(wise==="month"){
        const {data}=await axios.post(getAllOrderForEmployee,{
          Head,month,year,wise
        }) 
        setOrderArray(data);
        setDateIncreament({
          increamentMonth:month+1,
          increamentYear:year
        })
        console.log("2")
      }else if(wise==="year"){
        const {data}=await axios.post(getAllOrderForEmployee,{
          Head,year,wise
        }) 
        setOrderArray(data);
        setDateIncreament({
          increamentYear:year+1
        })
        console.log("3")
      }
    }
    featchData();
      }
  }
   },[foodMap])


   useEffect(()=>{
     if(orderArray.length>0){
      // console.log(orderArray);
        // for(let odr=0;odr<orderArray.length;odr++){
           orderArray.forEach(element => {
            console.log(foodMap.get(element.foodname).quantity+=element.foodQuantity)
          });
          console.log(foodMap);
          setRealFood(foodMap);
          // Array.from(foodMap).map((element)=>{
          //   console.log(element);
          // })
          // handleFoodMap();
        //    console.log("last");
        // }
     }
   },[orderArray])


  // onChange
  const starting=(e)=>{
    setInputDate({...inputDate,inpStartingDate:e.target.value})
  }
  const ending=(e)=>{
    setInputDate({...inputDate,inpEndingDate:e.target.value})
    console.log(inputDate.inpEndingDate.length);
  }
  
  return (
    <>
    <div className="container">
    <form className="" onSubmit={handleFoodMap}>
   <div className="col-auto" style={{display:"flex",}}>
    <input style={{margin:"10px"}} onChange={starting} value={inputDate.inpStartingDate} required type="date" className="form-control" id="starting"              placeholder="starting"/>
    <label style={{marginTop:"13px",fontSize:"1.3rem"}}>to</label>
    <input style={{margin:"10px"}} onChange={ending} value={inputDate.inpEndingDate}  type="date" className="form-control" id="ending"  placeholder="ending"/>
   </div>

<label  className='mx-2' htmlFor="">day</label>
<input  required type="radio" name="wise" value="day" onChange={e=>setWise(e.target.value)} />
<label  className='mx-2' htmlFor="">month</label>
<input  required type="radio" name="wise" value="month" onChange={e=>setWise(e.target.value)} />
<label  className='mx-2' htmlFor="">year</label>
<input  required type="radio" name="wise" value="year" onChange={e=>setWise(e.target.value)} />
   <button className="btn btn-success mx-2" type='submit'>get</button>
</form>

  {realFood&&<FoodTable orderArray={orderArray} realFood={realFood}/>}

  {/* <button onClick={featchMoreData} className="btn btn-success">butoon</button> */}
  </div>
    </>
  )
}

