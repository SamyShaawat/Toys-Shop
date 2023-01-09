import React, { useContext,useEffect } from "react";
import { useState } from "react";
import { AiOutlineMenu, AiOutlineClose} from "react-icons/ai";
import { Link } from "react-router-dom";
import { GlobalContext } from "../GlobalContext/GlobalContext";
import Cookie from "js-cookie";
import axios from "axios";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [loading, setLoading] = useState(true);
  const {clearCart,addToCart, LoginStatus, IsLoggedIn, cart } = useContext(GlobalContext);
  const [user,setUser]=useState({})
  useEffect(()=>{
    async function getUser(){
      try{
        const res=await axios.get('http://localhost:5000/api/user/me',{ withCredentials: true } )
        const user=res.data
        if(res.data.success){
          setUser(user)
        }
        setLoading(false)
      }catch{
        setLoading(false)
      }
    }
    async function fetchCartData() {
      const res = await axios.get('http://localhost:5000/api/cart', { withCredentials: true })
      clearCart()
      let data = res.data
      data = data.map(i => {
        if (!i.item.image.startsWith('http')) {
          i.item.image = '/images/' + i.item.image
        }
        console.log('Add')
        addToCart({ ...i, ...i.item, price: Number(i.item.price) })
        return { ...i, ...i.item, price: Number(i.item.price) }
      })
      // setData(response.data.results)
      // //console.log(response.data.results);

    }
    fetchCartData();
    getUser()

  },[])

  const navHandler = () => {
    setNav(!nav);
  };

  const logoutHandler = () => {
    Cookie.remove("jwt_token");
    IsLoggedIn(false);
    setUser({})
  };
  //console.log(user)
  if(loading) return <></>
  return (
    <div className="w-full h-25 bg-[#000300] flex justify-between items-center">
      <h1 className="text-white font-bold md:text-4xl sm:3xl text-xl p-3">
      <Link to="/">Toys shop</Link>
      </h1>
      <ul className="hidden md:flex p-3">

        <Link to="/">
            <li className="text-white font-bold p-2 hover:bg-[#2C2A2A] cursor-pointer">
              Home
            </li>
        </Link>
        {user.id &&         
        <Link to="cart">
            <li className="text-white font-bold p-2 hover:bg-[#2C2A2A] cursor-pointer">
                Cart       <span className="px-1 py-0.4 text-black  bg-white rounded-full ">{cart.length}</span>
            </li>
        </Link>
        }

        {user.id ? (
          <>
          <Link to="addnewproduct">
              <li className="text-white font-bold p-2 hover:bg-[#2C2A2A] cursor-pointer">
                Add New Product
              </li>
            </Link>
            <Link to="/">
              <li className="text-white font-bold p-2 hover:bg-[#2C2A2A] cursor-pointer"> Hi,{user.username}</li>
            </Link>
            <Link to="/">
              <li
                onClick={logoutHandler}
                className="text-white font-bold p-2 hover:bg-[#2C2A2A] cursor-pointer"
              >
                Logout
              </li>
            </Link>
          </>
        ) : (
          <>
            <Link to="/login">
              <li className="text-white font-bold p-2 hover:bg-[#2C2A2A] cursor-pointer">
                Login
              </li>
            </Link>
            <Link to="register">
              <li className="text-white font-bold p-2 hover:bg-[#2C2A2A] cursor-pointer">
                Register
              </li>
            </Link>
          </>
        )}
    
      </ul>

      <div className="md:hidden">
        {nav ? (
          <AiOutlineClose
            onClick={navHandler}
            className="text-white text-4xl px-2"
          />
        ) : (
          <AiOutlineMenu
            onClick={navHandler}
            className="text-white text-4xl px-2 "
          />
        )}
      </div>

      <div
        className={
          nav
            ? `md:hidden fixed top-0 left-0 h-[100%] w-60 bg-[#000300] ease-in-out duration-300`
            : `hidden `
        }
      >
        <h1 className="text-white text-left font-bold md:text-4xl sm:3xl text-xl p-3">
          Toys shop
        </h1>
        <ul className=" flex flex-col text-left p-3">
          <Link to="/">
            {" "}
            <li className="text-white font-bold p-2 hover:bg-[#2C2A2A] cursor-pointer">
              Home
            </li>
          </Link>
          {LoginStatus &&         
        <Link to="cart">
            <li className="text-white font-bold p-2 hover:bg-[#2C2A2A] cursor-pointer">
                 Cart       <span className="px-1 py-0.4 text-black  bg-white rounded-full ">{cart.length}</span>
            </li>
        </Link>

        }
            {LoginStatus ? (
            <>
              <Link to="addnewproduct">
              <li className="text-white font-bold p-2 hover:bg-[#2C2A2A] cursor-pointer">
                Add New Product
              </li>
            </Link>
              <Link to="/">
                <li
                  onClick={logoutHandler}
                  className="text-white font-bold p-2 hover:bg-[#2C2A2A] cursor-pointer"
                >
                  Logout
                </li>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <li className="text-white font-bold p-2 hover:bg-[#2C2A2A] cursor-pointer">
                  Login
                </li>
              </Link>
              <Link to="register">
                <li className="text-white font-bold p-2 hover:bg-[#2C2A2A] cursor-pointer">
                  Register
                </li>
              </Link>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;