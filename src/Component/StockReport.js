import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { getAllStockEntry, getAllStockIssue } from '../utils/APIRoutes'
import IssueTable from './IssueTable'
import styled from 'styled-components'
import EntryTable from './EntryTable'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function StockReport() {
  const [inputDate,setInputDate]=useState({inpStartingDate:"",inpEndingDate:""})
  const [stockType,setStockType]=useState();
  const [entryArray,setEntryArray]=useState([])
  const [issueArray,setIssueArray]=useState([])
  const navigate=useNavigate();
  // const []
   
  useEffect(()=>{
    if(!localStorage.getItem("manager")){
      navigate("/")
    }
  },[])
  // onChange
  const starting=(e)=>{
    setInputDate({...inputDate,inpStartingDate:e.target.value})
  }
  const ending=(e)=>{
    setInputDate({...inputDate,inpEndingDate:e.target.value})

  }

  const handleSubmit=async(e)=>{
    e.preventDefault();
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
   
    // stockType request
    if(stockType==="stockEntry"){
      setIssueArray([])
      console.log(stockType)
      const data=await axios.post(getAllStockEntry,{day,month,year,endDay,endMonth,endYear})
      setEntryArray(data.data);
    }
    else{
      setEntryArray([])
    console.log(stockType)
    const data=await axios.post(getAllStockIssue,{day,month,year,endDay,endMonth,endYear})
    setIssueArray(data.data);
  }
}

  return (
    <>
     <div className="container">

<form className="" onSubmit={handleSubmit}>
<div className="col-auto" style={{display:"flex",}}>
<input style={{margin:"10px"}} onChange={starting} value={inputDate.inpStartingDate} required type="date" className="form-control" id="starting"  placeholder="starting"/>
<label style={{marginTop:"13px",fontSize:"1.3rem"}}>to</label>
<input style={{margin:"10px"}} onChange={ending} value={inputDate.inpEndingDate} required type="date" className="form-control" id="ending"  placeholder="ending"/>
</div>

<label  className='mx-2' htmlFor="entry">EntryReport</label>
<input id='entry' required type="radio" name="Stock" value="stockEntry" onChange={e=>setStockType(e.target.value)} />
<label  className='mx-2' htmlFor="issue">IssueReport</label>
<input id='issue' required type="radio" name="Stock" value="stockIssue" onChange={e=>setStockType(e.target.value)} />

<button   className="btn btn-success mx-2" type='submit'>click</button>
</form>
<Container>
       <div id="stockPage">
        <h3>{stockType&&`Welcome to ${stockType} Report :`}</h3>
        <div id="allStock">

{
  issueArray.length>0&&issueArray.map((issueItem)=>{
    return(
<IssueTable issueItem={issueItem}/>
    )
  })
}

{
  entryArray.length>0&&entryArray.map((entryItem)=>{
    return(
      <EntryTable entryItem={entryItem} />
    )
  })
}
             </div>
       </div>
</Container>
</div>
    </>
  )
}
const Container=styled.div`
* {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Roboto slab';
        }

        #stockPage h3 {
            margin: 1.5rem 0px 1.5rem 0px;
            text-align: center;
        }

        #allStock {
            
            margin-left: 10px;
            margin-right: 10px;
            border: 2px solid black;
        }

        #stock {
            margin: 1.5rem;
        }

        #stock table {
            border : 2px solid red;
            border-collapse: collapse;
            text-align: center;
            margin: auto;
            width: 60%;
        }

        #stock table thead tr th {
            font-size: 1.4rem;
            padding: 20px 5px 20px 5px;
            border : 2px solid grey;

        }

        #stock table tbody tr td {

            font-size: 1.1rem;
            padding: 10px 0px 10px 0px;
            border: 2px solid grey;
        }

        tr {
            overflow-y: scroll;
        }

        tr:nth-child(even) {
            background-color: #f2f2f2;
        }

        input[type="number"] {
            width: 80%;
            padding: 3px;
        }

        input[type="date"] {
            width: 90%;
        }

        #nameItem {
            width: 30%;
        }
        /* for Btn s */
        #Btns{
            display: flex;
            justify-content: right;
            align-items: center;
            margin: 10px 10% 20px auto;
        }
        #Btns #save,#reset {
          margin: 10px;
        }
        #Btns button{
            border-radius: 5px;
            background-color: #f3f3;
                   
            padding: 4px 30px;
        }
        #Btns button a{
            text-decoration: none;
            font-size: 1.5rem;
        }
        #Btns button:hover{
            transform: scale(1.03);   
            background: rgb(33, 238, 159);

        }
        #Btns button:active{
            transform: scale(0.99);   
            background: rgb(33, 238, 159);

        }

        @media (max-width : 1317px) {
            #stock table {
                width: 100%;
            }
        }

        @media (max-width : 751px) {
            

            #stockPage h1 {
                margin: 1.5rem 0px 1.5rem 0px;
                text-align: center;
                font-size: 1.5rem;
            }

            #allStock {

                margin-left: 1px;
                margin-right: 1px;
                border: 2px solid black;
            }

            #stock {
                overflow-x: auto;
                margin: -2px;
            }

            


            .addNew button {
                margin-bottom: 2%;
            }



        }

        @media (max-width : 429px) {

            #stock table thead tr th {
                font-size: 1rem;
                padding: 20px 5px 20px 5px;
                border: 2px solid grey;
            }
            #stock table tbody tr td {
                font-size: 0.9rem;
                padding: 10px 0px 10px 0px;
                border: 2px solid grey;
            }

            
            .addNew button {
                border-radius: 5px;
                background-color: #f3f3;
                padding: 2px 12px;
                font-size: 1.4rem;
                margin-top: 2%;
                margin-right: 21%;
            }
        }

        
        .addNew{
            display: flex;
            justify-content: right;
            align-items: center;
        }
        .addNew button {
            border-radius: 5px;
            background-color: #f3f3;
            padding: 2px 12px;
            font-size: 1.4rem;
            margin-top: 2%;
            margin-right: 21%;
        }
      
        .addNew button:hover {
            transform: scale(1.03);
            background: rgb(33, 238, 159);

        }

        .addNew button:active {
            transform: scale(0.99);
            background: rgb(33, 238, 159);

        }
`