import React, { useEffect, useContext } from "react";
import axios from "axios";
import {  useParams } from "react-router-dom";
import { useState } from "react";
import { GlobalContext } from "../GlobalContext/GlobalContext";

const ProductDetails = () => {
  const params = useParams();
  const productid = params.productid;
  const { LoginStatus } = useContext(GlobalContext);
  // //console.log(productid);

  const { cart, addToCart, updateCart } = useContext(GlobalContext);

  const [product, setProduct] = useState([]);

  useEffect(() => {
    axios({
      url: `http://localhost:5000/api/items/get_item/${productid}`,
      method: "get",
    })
      .then((res) => {
        let product=res.data
        if(!product.image.startsWith('http')){
          product.image='/images/'+product.image
        }
        setProduct(product);

      })
      .catch((error) => {
        //console.log(error);
      });
  }, [productid]);

  const addToCartHandler = () => {
    axios.post('http://localhost:5000/api/cart/add',{product_id:product.id,quantity:1},{withCredentials: true}    ).then(res=>{
      //console.log(res.data)
    }).catch(err=>{
      //console.log(err)
    })
    const newItem = {
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: +product.price,
      image: product.image,
      quantity: 1,
    };

    const findItem = cart.find((item) => item.id === product.id);

    if (findItem) {
      ////console.log("exist");
      updateCart(product.id);
      // //console.log(cart);
      return;
    }
    addToCart(newItem);

    ////console.log(cart);
    ////console.log(newItem);
  };

  return (
    <div className="w-full h-100 mt-5 flex justify-center ">
      <div className="w-[80%] mt-[90px] grid gap-4 grid-cols-2">
        <div>
          <img src={product.image} className="w-full" alt="" />
        </div>
        <div className="grid gap-4">
          <div>
            <h2 className="hover:text-blue-500">Name:  {product.name} </h2>
            <h2 className="hover:text-blue-500">Brand:  {product.brand} </h2>
            <h3 className="my-2 hover:text-blue-500">Price:  ${product.price}</h3>
            <p className="hover:text-blue-500">Description:   {product.description}</p>
          </div>

          <div>
          {LoginStatus ? (
          <>
          <button
              onClick={addToCartHandler}
              className="w-full self-end block py-2 px-5 bg-orange-400 text-white rounded hover:bg-[#2C2A2A] cursor-pointer "
            >
              Add To Cart
            </button>
           
          </>
        ) : (
          <>
          <div>
          <a href="/login" >
            <button
             
              className="w-full self-end block py-2 px-5 bg-orange-400 text-white rounded hover:bg-[#2C2A2A] cursor-pointer "
            >
              Log in to add to Cart
              
            </button>
            </a>
      
           
          </div>
          </>
        )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;