// main server
// export const host="http://localhost:5000";
export const host="https://canteen-server-8ouz.onrender.com";
// api for foodDetails
export const addfoodRoute=`${host}/api/food/addfood`
export const getAllFoodsRoute=`${host}/api/food/getAllFoods`
export const updateAvailableRoute=`${host}/api/food/updateAvailable`
export const upDateRating=`${host}/api/food/upDateRating` //id
export const getFoodById=`${host}/api/food/getFoodById` //id

// api for foodorder
export const addorder=`${host}/api/order/addorder`
export const getAllOrderForEmployee=`${host}/api/order/getAllOrderForEmployee`
export const getAllOrderForUser=`${host}/api/order/getAllOrderForUser`
export const getUserOrderHistory=`${host}/api/order/getuserorderhistory`
export const updateOrder=`${host}/api/order/updateOrder`
export const updateDeleted=`${host}/api/order/updateDeleted`
export const updateTake=`${host}/api/order/updateTake`
export const upDateRated=`${host}/api/order/upDateRated` //id
export const updateReject=`${host}/api/order/updateReject`
export const oneKeyForReturnMoney=`${host}/api/order/onekeyforreturnmoney`

// api for order through QR
export const getOrderThroughQr=`${host}/api/order/getOrderThroughQr`//id
export const expireQr=`${host}/api/order/expireQr`//id

// api for payment
export const ordergenerate=`${host}/api/payment/ordergenerate`
export const paymentVarification=`${host}/api/payment/paymentvarification`
export const getkey=`${host}/api/payment/getkey`

// api for inventory
export const addinventory=`${host}/api/inventory/addinventory`
export const updateinventory=`${host}/api/inventory/updateinventory`
export const getinventory=`${host}/api/inventory/getinventory`
export const allinventoryitem=`${host}/api/inventory/allinventoryitem`

// api for all stock entry
export const addAllStockEntry=`${host}/api/stockEntry/addAllStockEntry`
export const getAllStockEntry=`${host}/api/stockEntry/getAllStockEntry`

// api for all stock issue
export const addAllStockIssue=`${host}/api/stockIssue/addAllStockIssue`
export const getAllStockIssue=`${host}/api/stockIssue/getAllStockIssue`

// api for coin 
// export const addCoin=`${host}/api/coin/addCoin`
export const createCoin=`${host}/api/coin/createcoin`
export const getCoin=`${host}/api/coin/getCoin`
export const coinPlus=`${host}/api/coin/coinplus`
export const coinMinus=`${host}/api/coin/coinminus`

//api for devloper
export const oneCoinToDev=`${host}/api/devloper/onecointodev`
export const getDevInfo=`${host}/api/devloper/getdevinfo`

export const EmployeeId="emp@authenticate"
export const Head="head@rungta.com"
export const MINSTOCK=10;
// export const UserId="ser@authenticate";

// 5267 3181 8797 5449

{/*<script src="https://raw.githack.com/eKoopmas/html2pdf/master/dist/html2pdf.bundle.js"></script> */}