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
        <h3>Welcome to Stock Entry Page : </h3>
        <div id="allStock">
           {!showError&& <div class="addList">
                <div class="addNew">
                    <button id="addBtn" onClick={addFields} >Add-New-Item</button>
                </div>
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
                            <td class="bodyRow"><input name='name' style={{width:"15vw",margin:"5px"}} onChange={event=>handleChange(index,event)} placeholder='name' value={inventory.name} type="text" id="inptQty-1"/></td>
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

const Container=styled.div`
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Roboto slab';
}
#addBtn {
    position: relative;
    right: 15vw;
    border-radius: 8px;
    color: black;
    /* font-family: Verdana, Geneva, Tahoma, sans-serif; */
    font-family: "Bree serif", Verdana, Geneva, Tahoma, sans-serif;
    font-weight: bold;
    font-size: 1.2rem;
    /* margin-right: 3px; */
    /* margin-right: -2px; */
    margin-left: 13vw;
    border: 2px solid black;
    padding: 4px 14px;
}
#stockPage h3 {
    margin: 1.5rem 0px 1.5rem 0px;
    text-align: center;
    font-size: 1.3rem;
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
    border: 2px solid red;
    border-collapse: collapse;
    text-align: center;
    margin: auto;
    width: 60%;
}

#stock table thead tr th {
    font-size: 1.4rem;
    padding: 20px 5px 20px 5px;
    border: 2px solid grey;

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
#Btns {
    display: flex;
    justify-content: right;
    align-items: center;
    margin: 10px 10% 20px auto;
}

#Btns #save,
#reset {
    margin: 10px;
}

#Btns button {
    border-radius: 5px;
    background-color: #f3f3;

    padding: 4px 30px;
}

#Btns button a {
    text-decoration: none;
    font-size: 1.5rem;
}

#Btns button:hover {
    transform: scale(1.03);
    background: rgb(33, 238, 159);

}

#Btns button:active {
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
        font-size: 1.6rem;
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
        font-size: 0.7rem;
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