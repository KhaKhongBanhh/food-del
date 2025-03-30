// import './MyOrders.css'
// import React, { useContext, useEffect, useState } from 'react';
// //import { useSearchParams, useNavigate } from 'react-router-dom';
// import { StoreContext } from '../../context/StoreContext';
// import axios from 'axios';
// import { assets } from '../../assets/assets';

// const MyOrders = () => {

//     const {url, token} = useContext(StoreContext);
//     const [data, setData] = useState([]);

//     const fetchOrders = async () => {
//         const response = await axios.get(`${url}/api/order/userorders`,{}, {headers:{token}});
//         setData(response.data.data);

//         console.log(response.data.data);
//     }

//     useEffect(() => {
        
//             fetchOrders();
//     }, [token]);

//   return (
//     <div className='my-orders'>
//         <h2>My Orders</h2>
//         <div className="container">
//             {data.map((order, index) => {
//                 return(
//                     <div className='my-orders-order' key={index}>
//                         <img src={assets.parcel_icon} alt="" />
//                         <p>{order.items.map((item, index) => {
//                             if(index === order.items.length - 1) {
//                                 return item.name + " x " + item.quantity;
//                             }else{
//                                 return item.name + " x " + item.quantity + ", ";
//                             }
//                         })}</p>
//                         <p>${order.amount}.00</p>
//                         <p>Items: {order.items.length}</p>
//                         <p><span>&#x25cf;</span><b>{order.status}</b></p>
//                         <button>Track Order</button>
//                     </div>
//                 )
//             })}
//         </div>
//     </div>
//   )
// }

// export default MyOrders

import './MyOrders.css'
import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);


    const fetchOrders = async () => {
        try {
            const response = await axios.post(`${url}/api/order/userorders`, {}, {
                headers: { token }
            });
            
            setData(response.data.data || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            <div className="container">
                {data && data.length > 0 ? (
                    data.map((order, index) => (
                        <div className='my-orders-order' key={index}>
                            <img src={assets.parcel_icon} alt="" />
                            <p>{order.items?.map((item, index) => (
                                <span key={index}>
                                    {item.name} x {item.quantity}
                                    {index !== order.items.length - 1 ? ", " : ""}
                                </span>
                            ))}</p>
                            <p>${order.amount}.00</p>
                            <p>Items: {order.items?.length || 0}</p>
                            <p><span>&#x25cf;</span><b>{order.status}</b></p>
                            <button>Track Order</button>
                        </div>
                    ))
                ) : (
                    <p>No orders found.</p>
                )}
            </div>
        </div>
    );
}

export default MyOrders;

// 4000 0035 6000 0008


