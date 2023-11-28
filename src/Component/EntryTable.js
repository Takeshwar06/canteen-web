import React from 'react'
import { Fragment } from 'react';
import {print} from 'react-html2pdf'
export default function EntryTable({entryItem}) {
    console.log(entryItem);
  return (
   
       <Fragment key={entryItem._id}>
        <div id='jsx-template' >
     <h4 className='mx-3 my-2 text-center' style={{color:'red'}}>Entry{new Date(entryItem.date).toString().substring(0,15)}</h4>
            <div id="stock">
                <table>
                    <thead id="headTable">
                        <tr className="hRow">
                            <th className="headRow">S.no</th>
                            <th className="headRow" id="nameItem">Name-Item</th>
                            <th className="headRow">Carry-Quantity</th>
                            <th className="headRow">Price</th>
                        </tr>
                    </thead>
                    <tbody id="bodyTable">

                    {
                    entryItem.stockEntry.map((item,index)=>{
                        return(
                            <>
                            {item.name.length>0&&Number(item.quantity)!==NaN&&Number(item.price)!==NaN&&
                             Number(item.quantity)>0&& Number(item.price)>0&&
                                <tr key={index} className="bRow">
                                <td className="bodyRow">{index+1}</td>
                                <td className="bodyRow">{item.name}</td>
                                <td className="bodyRow ">{item.quantity}</td>
                                <td className="bodyRow">{item.price}</td>
                            </tr>}
                            </>
                        )
                    })
                   }
                   
                </tbody>
        </table>

    </div></div>
    <button style={{margin:"10px",position:'relative',left:'13vw',padding:'0px 8px',fontSize:"20px",border:"1px solid black"
     ,borderRadius:"5px",backgroundColor:"#7be26d"}} className="mx-4" onClick={()=>print("stockEntryReport","jsx-template")}>print</button>
    </Fragment>

  )
}
  