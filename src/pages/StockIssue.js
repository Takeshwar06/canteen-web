import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { allinventoryitem } from '../utils/APIRoutes'
import StockIssueItem from '../components/StockIssueItem'

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
        <h1>Stock Issue</h1>
        <div id="allStock">
            <div id="search" className="searching">
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <input value={searchTerm}onChange={handleSearchChange} type="text" name="search" id="searchTxt" placeholder="search inventory item"/>
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

const Container = styled.div`
  max-width: 1040px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 3rem;

  * { box-sizing: border-box; }

  #stockPage h1 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.6rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    margin: 0 0 1.25rem;
  }
  #stockPage h1::before {
    content: "";
    width: 4px;
    height: 1.05em;
    background: var(--primary);
    border-radius: 2px;
  }

  #allStock {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }

  #search {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.65rem 1rem;
    margin: 1.25rem 1.25rem 0;
    border: 1px solid var(--border);
    border-radius: var(--radius-pill);
    background: var(--bg);
    max-width: 380px;
    transition: all 0.15s ease;
  }
  #search:focus-within {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--primary-light);
    background: var(--surface);
  }
  #search i { color: var(--text-muted); font-size: 0.9rem; }
  #searchTxt {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 0.95rem;
    color: var(--text);
  }

  #stock {
    padding: 1.25rem;
    overflow-x: auto;
  }
  #stock table {
    width: 100%;
    border-collapse: collapse;
    text-align: center;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
  }
  #stock thead th {
    font-size: 0.82rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: var(--primary-dark);
    background: var(--primary-light);
    padding: 0.85rem 0.6rem;
    border-bottom: 1px solid var(--border);
  }
  #stock tbody td {
    font-size: 0.92rem;
    color: var(--text);
    padding: 0.65rem 0.6rem;
    border-bottom: 1px solid var(--border);
  }
  #stock tbody tr:nth-child(even) { background: var(--bg); }
  #stock tbody tr:hover { background: var(--primary-light); }
  #stock input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--primary);
    cursor: pointer;
  }

  #nameItem { width: 30%; }

  #Btns {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.75rem;
    padding: 0 1.25rem 1.25rem;
  }
  #Btns #save, #Btns #reset { margin: 0; }
  #Btns button {
    border-radius: var(--radius-pill);
    border: none;
    padding: 0.55rem 1.7rem;
    font-weight: 600;
    transition: all 0.15s ease;
  }
  #Btns #saveBtn { background: var(--primary); color: #fff; }
  #Btns #saveBtn:hover { background: var(--primary-dark); }
  #Btns #saveBtn a { color: #fff; }
  #Btns #resetBtn {
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text);
  }
  #Btns #resetBtn:hover { background: var(--bg); }
  #Btns #resetBtn a { color: var(--text); }
  #Btns button a {
    text-decoration: none;
    font-size: 1rem;
  }

  @media (max-width: 600px) {
    padding: 1rem 0.75rem 2rem;
    #stockPage h1 { font-size: 1.35rem; }
    #search { margin: 1rem 0.75rem 0; }
    #stock { padding: 0.75rem; }
    #stock thead th { font-size: 0.72rem; padding: 0.6rem 0.35rem; }
    #stock tbody td { font-size: 0.82rem; padding: 0.5rem 0.35rem; }
    #Btns button { padding: 0.5rem 1.2rem; }
  }
`