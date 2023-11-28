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
        <h1>Welcome to Stock Issue Page : </h1>
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