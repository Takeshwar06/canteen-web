import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { allinventoryitem } from '../utils/APIRoutes'
import StockIssueItem from './StockIssueItem'

export default function StockIssue() {
    const [inventoryItem,setInventoryItem]=useState([])
    const [refresh,setRefresh]=useState(false);
    const [showSelected,setShowSelected]=useState(false);
    const [selectItem,setSelectItem]=useState([]);
    const [searchTerm,setSearchTerm]=useState("");
    const [resultInvetoryItem,setResultIventoryItem]=useState([])
    const navigate=useNavigate();
    useEffect(()=>{
       if(!localStorage.getItem("employee")&&!localStorage.getItem("manager")){
        navigate("/")
       }
    },[])
    useEffect(()=>{
      const featchData=async()=>{
        const data=await axios.get(allinventoryitem)
         setInventoryItem(data.data);
      }
      featchData();
    },[refresh])

  useEffect(()=>{
    console.log(inventoryItem.length,"length");
    let data=[];
       if(inventoryItem.length>0){
        inventoryItem.forEach((element)=>{
          data.push({name:element.inventoryName,availableQuantity:element.inventoryQuantity,select:false})
        })
    //     const defaultData=Array(inventoryItem.length).fill({name:"",quantity:"",select:false})
    //     setSelectItem(defaultData);
       }
       setSelectItem(data);
       console.log("useEffect",data);
  },[inventoryItem,refresh])
  
  // handle show and hide the selected item
  useEffect(()=>{
   if(refresh){
    setShowSelected(false);
    setRefresh(false)
   }
  },[refresh])
    const handleChange=(event,index)=>{
       let data=[...selectItem];
        data[index][event.target.name]=event.target.checked;
       setSelectItem(data);
       
    }
    const save=()=>{
        setShowSelected(true);
        console.log(selectItem);
    }

   const handleSearchChange=(e)=>{
    setSearchTerm(e.target.value);
      if(e.target.value!==""){
       const newIventoryItem=inventoryItem.map((element)=>{
         if(element.inventoryName.toLowerCase().includes(e.target.value.toLowerCase())){
            return element;
         }
         else{
            return "";
         }
       })
      setResultIventoryItem(newIventoryItem);
      }
      else{
      setResultIventoryItem(inventoryItem);
      }
   }
  return (
    <>
        {!showSelected&&<Container>
        <div id="stockPage">
        <h1>Welcome to Stock Issue Page : </h1>
        <div id="allStock">
            {/* <div className="addList">
                <div className="addNew">
                    <button id="addBtn">Add-New-Item</button>
                </div>
            </div> */}
            <div id="search" class="searching">
                            <input style={{borderRadius:"10px 10px 10px 10px"}} value={searchTerm}onChange={handleSearchChange} type="text" name="search" id="searchTxt" placeholder="search your favorite dish"/>
                            {/* <input id="searchBtn" type="submit" value="Search"/> */}
                        </div>
            <div id="stock">
                <table>
                    <thead id="headTable">
                        <tr className="hRow">
                            <th className="headRow">S.no</th>
                            <th className="headRow" id="nameItem">Name-Item</th>
                            {/* <th className="headRow">Carry-Quantity</th> */}
                            <th className="headRow">Availabel(kg/l)</th>
                            <th className="headRow">select</th>
                        </tr>
                    </thead>
                    <tbody id="bodyTable">
                   {searchTerm.length<1&&
                    inventoryItem.map((item,index)=>{
                        return(
                        <tr key={index} className="bRow">
                            <td className="bodyRow">{index+1}</td>
                            <td className="bodyRow">{item.inventoryName}</td>
                            {/* <td className="bodyRow "><input name='quantity' value={selectItem.quantity} onChange={event=>handleChange(event,index)} type="number" id="inptQnt-1"/></td> */}
                            <td className="bodyRow">{item.inventoryQuantity}</td>
                            <td className="bodyRow"><input  name="select" value={selectItem.select} onChange={event=>handleChange(event,index)}   type="checkbox"  style={{cursor:"pointer"}} id={index} /></td>
                        </tr>
                        )
                    })
                   }

                   { searchTerm.length>0&&
                    resultInvetoryItem.map((item,index)=>{                   
                        return(
                        <>
                        {item.inventoryName&&<tr key={index} className="bRow">
                            <td className="bodyRow">{index+1}</td>
                            <td className="bodyRow">{item.inventoryName}</td>
                            {/* <td className="bodyRow "><input name='quantity' value={selectItem.quantity} onChange={event=>handleChange(event,index)} type="number" id="inptQnt-1"/></td> */}
                            <td className="bodyRow">{item.inventoryQuantity}</td>
                            <td className="bodyRow"><input  name="select" value={selectItem.select} onChange={event=>handleChange(event,index)}   type="checkbox"  style={{cursor:"pointer"}} id={index} /></td>
                        </tr>}
                        </>
                        )
                    })
                   }
                    </tbody>
                </table>
            </div>
            <div id="Btns">
                <div id="save">
                    <button id="saveBtn" onClick={save}><a >Save</a></button>
                </div>
                <div id="reset">
                    {localStorage.getItem("manager")&&<button id="resetBtn"><Link to="/stockreport">Report</Link></button>}
                </div>
            </div>
        </div>
    </div>

    </Container>}

    {
       showSelected&& <StockIssueItem selectItem={selectItem} setRefresh={setRefresh} setShowSelected={setShowSelected}/>
    }
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

        #stockPage h1 {
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