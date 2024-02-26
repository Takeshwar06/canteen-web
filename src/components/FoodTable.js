import React from 'react'
import { print } from 'react-html2pdf';
export default function FoodTable({realFood,orderArray}) {
    let total=0;
   
  return (
    <>
      <div className='container ' id={'jsx-template'} >
        <h3 className='text-center'>Generated Report</h3>
        <span> <small>{orderArray[0].date.substring(0,10)} to {orderArray[orderArray.length-1].date.substring(0,10)}</small> </span>
        <span style={{float:"right"}}><small>{new Date().toString().substring(0,15)}</small></span>
    <table className="table table-bordered border-primary text-center">
      <thead>
  <tr style={{backgroundColor:"aqua"}}>
    <th scope="col" style={{fontSize:"1.3rem",}}>#</th>
    <th scope="col" style={{fontSize:"1.3rem",}}>FoodName</th>
    <th scope="col" style={{fontSize:"1.3rem",}}>FoodQuatity</th>
    <th scope="col" style={{fontSize:"1.3rem",}}>FoodPrice</th>
  </tr>
</thead>
<tbody>

  {Array.from(realFood).map((food,index)=>{
    total=total+(food[1].price)*(food[1].quantity);
    return(
      <tr key={index}>
        <th scope="row">{index+1}</th>
        <td>{food[0]}</td>
        <td>{food[1].quantity}</td>
        <td>{(food[1].price)*(food[1].quantity)}</td>
      </tr>
    )
  })
    }

  <tr style={{backgroundColor:'aqua',color:"red"}}>
    <th  scope="row"></th>
    <td style={{color:"red",fontSize:"1.3rem",}} >TOTAL</td>
    <td></td>
    <td style={{color:"red",fontSize:"1.3rem",}} >{total}</td>
  </tr>
  {/* <tr>
    <th scope="row">3</th>
    <td colSpan="2">Larry the Bird</td>
    <td>@twitter</td>
  </tr> */}
</tbody>
</table>
 </div> 
<div className="container">
<button style={{fontSize:"20px",border:"1px solid black"
,borderRadius:"5px",backgroundColor:"#7be26d",padding:'0px 8px'}} className="mx-2" onClick={()=>print('Report', 'jsx-template')}> print</button>
</div>
    </>
  )
}
