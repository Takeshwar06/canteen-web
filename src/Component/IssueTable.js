import React from 'react'
import {print} from 'react-html2pdf'
export default function IssueTable({issueItem}) {
    console.log(issueItem);
  return (
    <>   
    <div className='cantainer' id='jsx-template'> 
 <h4 className='mx-3 my-2 text-center' style={{color:'red'}}>Issue-{new Date(issueItem.date).toString().substring(0,15)}</h4>
            <div style={{}}>
           
            </div>
         <div style={{margin:"auto",width:"80%",}} id="stock">
         <p style={{position:"relative",left:"9vw"}} >Issued by {issueItem.employeeId}</p>
             <table>
                 <thead id="headTable">
                     <tr className="hRow">
                         <th className="headRow">S.no</th>
                         <th className="headRow" id="nameItem">Name-Item</th>
                         <th className="headRow">Availabel(kg/l)</th>
                         <th className="headRow">Carry-Quantity</th>
                     </tr>
                 </thead>
                 <tbody id="bodyTable">

                    {
                      issueItem.stockIssue.map((item,index)=>{
                            return(
                                <>
                      {item.name.length>0&&Number(item.quantity)!==NaN&&Number(item.availableQuantity)!==NaN&&
                         Number(item.quantity)>0&& Number(item.availableQuantity)>0&&item.availableQuantity>item.quantity&&
                        <tr key={index} className="bRow">
                            <td className="bodyRow">{index+1}</td>
                            <td className="bodyRow">{item.name}</td>
                            <td className="bodyRow">{item.availableQuantity}</td>
                            <td className="bodyRow ">{item.quantity}</td>
                     </tr>}
                                </>
                            )
                        })
                    }
                
             </tbody>
     </table>

 </div>
 </div>
 <button style={{margin:"10px",position:'relative',left:'13vw',padding:'0px 8px',fontSize:"20px",border:"1px solid black"
,borderRadius:"5px",backgroundColor:"#7be26d"}} className="mx-4" onClick={()=>print("stockIssueReport","jsx-template")}>print</button>
 <hr />
 </>

  )
}
