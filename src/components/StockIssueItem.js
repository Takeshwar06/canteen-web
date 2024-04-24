import axios from 'axios';
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import styled from 'styled-components'
import { addAllStockIssue, updateinventory } from '../utils/APIRoutes';
export default function StockIssueItem({selectItem,setRefresh}) {
     const [checkTrue,setCheckTrue]=useState([]);
     const [errorItem,setErrorItem]=useState([]);
     const [showError,setShowError]=useState(false);

    useEffect(()=>{
        let data=[];
      selectItem.forEach(element => {
        element.select&&data.push({name:element.name,availableQuantity:element.availableQuantity,quantity:"",select:element.select});
      });
      setCheckTrue(data);
    },[])
    
    // handleChange 
    const handleChange =(event,index)=>{
      let data=[...checkTrue];
      data[index][event.target.name]=event.target.value;
      setCheckTrue(data);
      console.log(data);
    }
   
    // removeSelectedItem
  const removeSelectedItem=(index)=>{
    let data=[...checkTrue];
    data.splice(index,1);
    setCheckTrue(data);
    console.log(data);
  }
  
  // get item issue
  const getItemIssue =async()=>{
    setShowError(true);
    const errData=[];
      const tempCheckTrue=checkTrue;
      setCheckTrue([])
      tempCheckTrue.forEach(async(element)=>{
        if(Number(element.quantity)>0&&element.availableQuantity>element.quantity){
            let name=element.name;
            let upDatedQuantity=element.availableQuantity-Number(element.quantity);
            const data=await axios.post(updateinventory,{
                name,upDatedQuantity
            })
            console.log(data);
        }
        else{
           errData.push(element);
        }
      })
      setErrorItem(errData);
      await axios.post(addAllStockIssue,{stockIssue:tempCheckTrue,employeeId:localStorage.getItem("uniqueEmployeeId")})
  }
  // back to the select
   const back=()=>{
    setRefresh(true);
    setCheckTrue([])
    setShowError(false)
   }

  return (
    <Container>
        <div id="stockPage">
        <h1>Issue Items</h1>
        <div id="allStock">
       
            {showError&&errorItem.length>0&&<h4 className='mx-3 my-2 text-center' style={{color:'red'}}>Some resson can not issue this item</h4>}
            <div id="stock">
                <table>
                    <thead id="headTable">
                        <tr className="hRow">
                            <th className="headRow">S.no</th>
                            <th className="headRow" id="nameItem">Name-Item</th>
                            <th className="headRow">Carry-Quantity</th>
                            <th className="headRow">Availabel(kg/l)</th>
                            {!showError&&<th className="headRow">Remove</th>}
                        </tr>
                    </thead>
                    <tbody id="bodyTable">
                   {
                    !showError&&checkTrue.map((item,index)=>{
                        return(<tr key={index} className="bRow">
                            <td className="bodyRow">{index+1}</td>
                            <td className="bodyRow">{item.name}</td>
                            <td className="bodyRow "><input name='quantity' value={item.quantity} onChange={event=>handleChange(event,index)} type="number" id="inptQnt-1"/></td>
                            <td className="bodyRow">{item.availableQuantity}</td>
                            <td className="bodyRow"> <button className="btn btn-secondary" onClick={()=>removeSelectedItem(index)}>remove</button> </td>
                        </tr>
                        
                        )
                    })
                   }

                   {
                    showError&&errorItem.map((item,index)=>{
                        return(<tr key={index} className="bRow">
                            <td className="bodyRow">{index+1}</td>
                            <td className="bodyRow">{item.name}</td>
                            <td style={{backgroundColor:"#f05b44"}} className="bodyRow ">{item.quantity}</td>
                            <td className="bodyRow">{item.availableQuantity}</td> 
                            {/* <td className="bodyRow">--</td>  */}
                        </tr>
                        
                        )
                    })
                   }

                    </tbody>
                </table>
            </div>
            <div id="Btns">
                <div id="save">
                    <button id="saveBtn" onClick={getItemIssue}><a >Issue</a></button>
                </div>
                <div id="reset">
                    <button id="resetBtn" onClick={back}><a>Back</a></button>
                </div>
            </div>
        </div>
    </div>
    </Container>
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

  #stock input[type="number"] {
    width: 90%;
    max-width: 140px;
    padding: 0.4rem 0.6rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    font-size: 0.9rem;
    outline: none;
    background: var(--surface);
    transition: all 0.15s ease;
  }
  #stock input:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--primary-light);
  }

  #stock .btn {
    border-radius: var(--radius-pill);
    font-size: 0.82rem;
    font-weight: 600;
    padding: 0.3rem 0.9rem;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--danger);
    transition: all 0.15s ease;
  }
  #stock .btn:hover {
    background: var(--danger);
    color: #fff;
    border-color: var(--danger);
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
    #stock { padding: 0.75rem; }
    #stock thead th { font-size: 0.72rem; padding: 0.6rem 0.35rem; }
    #stock tbody td { font-size: 0.82rem; padding: 0.5rem 0.35rem; }
    #Btns button { padding: 0.5rem 1.2rem; }
  }
`