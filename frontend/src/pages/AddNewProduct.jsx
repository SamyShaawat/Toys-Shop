import React from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";

const AddNewProduct = () => {
    const [inputs, setinputs] = useState({
    name: "",
    brand: "",
    price: "",
    image: "",
    description: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setinputs((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();


    axios({
      url: "http://localhost:5000/api/items/add",
      method: "post",
      data: {
        ...inputs,
      },
    })
      .then((res) => {
      
        if (res.data.status === 0) {
          toast.error(res.data.error[0].msg, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }

        if (res.data.status === 1) {
          toast.success(res.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      })
      .catch((error) => {
      
      });
  };
  
  return(
    <div className="w-full absolute mt-[80px] flex justify-center items-center">
      <form
        className="bg-white p-4 shadow-md border rounded my-5 py-3"
        onSubmit={submitHandler}
      >
        <h2 className="text-center w-full p-3 text-gray-500 text-xl font-bold">
          Add New Product
        </h2>
        <div className="mb-2">
          <label className="text-gray-500 mb-2 font-bold" htmlFor="username">
            Product Name
          </label>
          <input
            type="text"
            placeholder="name"
            id="name"
            name="name"
            value={inputs.name}
            onChange={onChangeHandler}
            className="w-full py-2 px-3 text-gray-500 shadow focus:outline-none focus:shadow-md border border-gray-500 rounded"
          />
        </div>

        <div className="mb-2">
          <label className="text-gray-500 mb-2 font-bold" htmlFor="brand">
            Product Brand
          </label>
          <input
            type="text"
            placeholder="brand"
            id="brand"
            name="brand"
            value={inputs.brand}
            onChange={onChangeHandler}
            className="w-full py-2 px-3 text-gray-500 shadow focus:outline-none focus:shadow-md border border-gray-500 rounded"
          />
        </div>

        <div className="mb-2">
          <label className="text-gray-500 mb-2 font-bold" htmlFor="password">
            Product Price
          </label>
          <input
            type="number"
            placeholder="Price"
            id="price"
            value={inputs.price}
            onChange={onChangeHandler}
            name="price"
            className="w-full py-2 px-3 text-gray-500 shadow focus:outline-none focus:shadow-md  border border-gray-500 rounded"
          />
        </div>

        <div className="mb-2">
          <label className="text-gray-500 mb-2 font-bold" htmlFor="password">
            Product Image (Link)
          </label>
          <textarea
            name="image"
            value={inputs.image}
            onChange={onChangeHandler}
            className="w-full py-2 px-3 text-gray-500 shadow focus:outline-none focus:shadow-md  border border-gray-500 rounded"
          ></textarea>
        </div>

        <div className="mb-2">
          <label className="text-gray-500 mb-2 font-bold" htmlFor="password">
            Product Description
          </label>
          <textarea
            name="description"
            value={inputs.description}
            onChange={onChangeHandler}
            className="w-full py-2 px-3 text-gray-500 shadow focus:outline-none focus:shadow-md  border border-gray-500 rounded"
          ></textarea>
        </div>

        <div className="flex justify-between items-center my-3 mb-5">
          <button className="text-white font-bold bg-blue-500 py-2 px-3 border rounder hover:bg-blue-700">
            Add New Product
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddNewProduct;
