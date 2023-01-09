import axios from "axios";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { GlobalContext } from "../GlobalContext/GlobalContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
  //  const { cart, increaseQuantity, decreaseQuantity, removeItem } = useContext(GlobalContext);
  const { cart,setCart,clearCart, addToCart, increaseQuantity, decreaseQuantity, removeItem } = useContext(GlobalContext);
  // const [cart, setCart] = useState([])
  const showToastMessage = () => {
    toast.success('Checked Out Successfully', {
      position: toast.POSITION.TOP_RIGHT
    });
  }

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get('http://localhost:5000/api/cart', { withCredentials: true })
      let data = res.data
      data = data.map(i => {
        if (!i.item.image.startsWith('http')) {
          i.item.image = '/images/' + i.item.image
        }
        return { ...i, ...i.item, price: Number(i.item.price) }
      })
      setCart(data)
    }
    fetchData();
  }, [])
  console.log(cart)
  return (
    <div className="w-full min-h-full flex justify-center">
      <div className="w-[95%] mt-[90px] flex justify-between">
        <div className="w-[70%]">
          <table className="w-full border-collapse border border-slate-400">
            <tr className="bg-slate-300">
              <th className="border border-slate-700 p-3 ">Name</th>
              <th className="border border-slate-700 p-3 ">Price</th>
              <th className="border border-slate-700 p-3 ">Image</th>
              <th className="border border-slate-700 p-3 ">Quantity</th>
              <th className="border border-slate-700 p-3 ">Total</th>
              <th className="border border-slate-700 p-3 ">Action</th>
            </tr>
            {cart.length > 0 ? (
              cart.map((item) => {
                return (
                  <tr className="hover:bg-slate-100">
                    <td className="border border-slate-300 text-center">
                      {item.name}
                    </td>
                    <td className="border border-slate-300 text-center">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="border border-slate-300 text-center">
                      <img src={item.image} className="w-20 h-20" alt="" />
                    </td>
                    <td className="border border-slate-300 text-center">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="py-1 px-2 focus:border border-orange-300 mx-2 font-bold text-2xl"
                      >
                        -
                      </button>
                      {item.quantity}
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="py-1 px-2 focus:border border-orange-300 mx-2 font-bold text-2xl"
                      >
                        +
                      </button>
                    </td>
                    <td className="border border-slate-300 text-center">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="border border-slate-300 text-center">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="py-1 px-2 rounded bg-red-500 text-white"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center font-bold text-3xl">
                  Cart is Empty
                </td>
              </tr>
            )}
          </table>
        </div>
        <div className="w-[25%] shadow py-3 px-2 flex justify-center">
          <div className="w-[95%]">
            <h3 className="text-3xl fond-bold text-gray-600 text-center my-4 w-full border border-b-slate-200">
              Cart Info
            </h3>
            <h4 className="text-bold border border-b-slate-200 border-l-0 border-t-0 border-r-0 py-2">Total Items: {cart.length}</h4>
            <h4 className="text-bold text-bold border border-b-slate-200 border-l-0 border-t-0 border-r-0 py-2">
              Total Quantity:{" "}
              {cart.reduce((sum, items) => (sum += items.quantity), 0)}
            </h4>

            <h4 className="text-bold text-bold border border-b-slate-200 border-l-0 border-t-0 border-r-0 py-2">
              Total Price:{" "}
              $ {cart.reduce((sum, items) => (sum += items.price * items.quantity), 0).toFixed(2)}
            </h4>

            <div>
              <button
                className="w-full self-end block py-2 px-5 bg-orange-400 text-white rounded hover:bg-transparent hover:text-orange-400"
                onClick={showToastMessage}>Checkout</button>
              <ToastContainer />
            </div>


            <a href="/">
              <button
                className="block w-full py-2 px-10 my-2  bg-blue-600 text-white rounded hover:bg-blue-200 hover:text-black">
                Continue Shopping
              </button>
            </a>


          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
