import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import { addAllStockEntry, addinventory, getinventory, updateinventory } from '../utils/APIRoutes';

export default function StockEntry() {
    const [inputField,setInputField]=useState([{
        name:"",quantity:"",expDate:"",price:""
    }])
    const [errorItem,setErrorItem]=useState([]);
    const [showError,setShowError]=useState(false);
    const navigate=useNavigate();
    useEffect(()=>{
       if(!localStorage.getItem("manager")){
          navigate("/")
       }
    },[])
    const handleChange =(index,event)=>{
        let data=[...inputField];
        data[index][event.target.name]=event.target.value
        setInputField(data);
    }

    const addFields=()=>{
        let newfield={name:"",quantity:"",expDate:"",price:""}
        setInputField([...inputField,newfield])
    }
 
    const removefields=(index)=>{
        let data=[...inputField];
        data.splice(index,1);
        setInputField(data);
    }

    const handleSave =async()=>{
        setShowError(true);
        let tempInputField=inputField;
        let errData=[];
        setInputField([])
        const featchData=async()=>{
        tempInputField.forEach(async(element)=>{
            if(element.name.length>2&&element.price.length>0&&element.quantity.length>0){
            let name=element.name.toLowerCase();
            let quantity=element.quantity;
            let price=element.price;
            let expDate=element.expDate;
            const inventoryArray=await axios.post(getinventory,{name});
            if(inventoryArray.data.length>0){
             // updateinventory
             let upDatedPrice=Number(inventoryArray.data[0].inventoryPrice)+Number(price);
             let upDatedQuantity=Number(inventoryArray.data[0].inventoryQuantity)+Number(quantity);
             const data=await axios.post(updateinventory,{
                name,upDatedPrice,upDatedQuantity
             })
             console.log(data);
            }
            
            else if(inventoryArray.data.length===0){
            //  createinventory
            const data=await axios.post(addinventory,{
                    name,quantity,price,expDate
                });
                console.log(data);
            }
        }
        else{
           errData.push(element);  // you can store index in array and splice for addAllstockEntry
            // setInputField([...inputField,element])
        }
        setErrorItem(errData);
         })
        }

        featchData();
      await axios.post(addAllStockEntry,{stockEntry:tempInputField}) // use splice  
    }

    const handleReset=()=>{
        console.log(inputField);
      setInputField([])
      setShowError(false);
    }
  return (
    <Container>
      <div id="stockPage">
        <h3>Stock Entry</h3>
        <div id="allStock">
           {!showError&& <div className="stock-toolbar">
                <span className="stock-toolbar-hint">Add items received into inventory</span>
                <button id="addBtn" onClick={addFields} ><i className="fa-solid fa-plus"></i> Add Item</button>
            </div>}
            {showError&&errorItem.length>0&&<h3 className='mx-3 my-2' style={{color:'red'}}>Some resson can not add this item</h3>}
            <div id="stock">
                <table>
                    <thead id="headTable">
                        <tr class="hRow">
                            <th class="headRow">S.no</th>
                            <th class="headRow" id="nameItem">Name-Item</th>
                            <th class="headRow">Quantity(kg/litre)</th>
                            <th class="headRow">Price</th>
                            {!showError&&<th class="headRow">Expiry-date</th>}
                            {!showError&&<th class="headRow">Remove</th>}
                        </tr>
                    </thead>
                    <tbody id="bodyTable">
                        {!showError&& inputField.map((inventory,index)=>{
                                return(<tr key={index} class="bRow" id="bRow-1">
                            <td class="bodyRow" id="">{index+1}</td>
                            <td class="bodyRow"><input name='name' onChange={event=>handleChange(index,event)} placeholder='name' value={inventory.name} type="text" id="inptQty-1"/></td>
                            <td class="bodyRow"><input name='quantity' onChange={event=>handleChange(index,event)} placeholder='Quantity' value={inventory.quantity} type="number" id="inptQty-1"/></td> 
                            <td class="bodyRow"><input name='price' onChange={event=>handleChange(index,event)} placeholder='price' value={inventory.price}type="number" id="inptPrice-1"/></td>       
                            <td class="bodyRow"><input name='expDate' onChange={event=>handleChange(index,event)} placeholder='expDate' value={inventory.expDate} type="date" id="expDate-1"/> </td>
                            <td class="bodyRow"><button onClick={()=>removefields(index)} className="btn btn-outline-secondary">remove</button></td>
                     </tr>  )
                            })
                        }
                       
                        {showError&&errorItem.map((inventory,index)=>{
                                return(<tr key={index} class="bRow" id="bRow-1">
                            <td class="bodyRow" id="">{index+1}</td>
                            <td class="bodyRow">{inventory.name}</td>
                            <td class="bodyRow">{inventory.quantity}</td> 
                            <td class="bodyRow">{inventory.price}</td>       
                     </tr>  )
                            })
                        }
                       

                    </tbody>
                </table>
            </div>
            <div id="Btns">
                <div id="save">
                    <button id="saveBtn" onClick={handleSave}><a >Save</a></button>
                </div>
                <div id="reset">
                    <button id="resetBtn" onClick={handleReset} ><a >Reset</a></button>
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

  #stockPage h3 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.6rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    margin: 0 0 1.25rem;
  }
  #stockPage h3::before {
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

  .stock-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--border);
  }
  .stock-toolbar-hint {
    font-size: 0.9rem;
    color: var(--text-muted);
  }
  #addBtn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    border: none;
    border-radius: var(--radius-pill);
    color: #fff;
    background: var(--primary);
    font-weight: 600;
    font-size: 0.95rem;
    padding: 0.5rem 1.1rem;
    transition: all 0.15s ease;
  }
  #addBtn:hover { background: var(--primary-dark); }

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

  #nameItem { width: 30%; }

  #stock input[type="text"],
  #stock input[type="number"],
  #stock input[type="date"] {
    width: 90%;
    max-width: 200px;
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
  #Btns #resetBtn {
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text);
  }
  #Btns #resetBtn:hover { background: var(--bg); }
  #Btns button a {
    text-decoration: none;
    font-size: 1rem;
    color: inherit;
  }

  @media (max-width: 600px) {
    padding: 1rem 0.75rem 2rem;
    #stockPage h3 { font-size: 1.35rem; }
    #stock { padding: 0.75rem; }
    #stock thead th { font-size: 0.72rem; padding: 0.6rem 0.35rem; }
    #stock tbody td { font-size: 0.82rem; padding: 0.5rem 0.35rem; }
    #Btns button { padding: 0.5rem 1.2rem; }
  }
`