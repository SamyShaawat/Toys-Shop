/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import img1 from "../assets/1.jpg";
import axios from "axios";
import { Link } from "react-router-dom";
import { GlobalContext } from "../GlobalContext/GlobalContext";
import { useContext } from "react";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [brandSelection, setBrandSelection] = useState(null)
  const [searchInput, setSearchInput] = useState(null)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState(null)
  const { cart, addToCart, updateCart, LoginStatus } = useContext(GlobalContext);


  function getAllItems() {
    axios({
      url: "http://localhost:5000/api/items/all_items",
      method: "get",
    })
      .then((res) => {
        let products = res.data
        products.map(p => {
          if (p.image.startsWith('http')) {
            return p
          } else {
            p.image = '/images/' + p.image
            return p
          }
        })
        products.map((p) => '/images/' + products.image)
        setProducts(products);
      })
      .catch((error) => {
      });
  }
  function handleReset() {
    setMinPrice('')
    setMaxPrice('')
    setSearchInput('')
    setBrandSelection(null)
    getAllItems()
  }
  function handleSearch() {
    console.log(searchInput)
    axios.get('http://localhost:5000/api/items/search', { params: { query: searchInput, min_price: minPrice, max_price: maxPrice, brand: brandSelection } }).then(res => {
      let products = res.data
      products.map(p => {
        if (p.image.startsWith('http')) {
          return p
        } else {
          p.image = '/images/' + p.image
          return p
        }
      })
      setProducts(products);
    })
  }
  useEffect(() => {
    getAllItems()
    axios.get('http://localhost:5000/api/items/brands').then(res => {
      setBrands(res.data)
    })
  }, []);



  const addToCartHandler = (event) => {
    event.preventDefault();
    let id = event.target.id;

    const name = document.getElementById("hiddenname" + id).value;
    const price = document.getElementById("hiddenprice" + id).value;
    const image = document.getElementById("hiddenimage" + id).value;

    const newItem = {
      id,
      name,
      price: +price,
      image,
      quantity: 1,
    };
    axios.post('http://localhost:5000/api/cart/add', { product_id: newItem.id, quantity: 1 }, { withCredentials: true }).then(res => {
    }).catch(err => {
    })
    const findItem = cart.find((item) => item.id === id);

    if (findItem) {
      updateCart(id);
      return;
    }

    addToCart(newItem);
  };

  return (
    <div className="w-full">
      <div className="">
        <img src={img1} className="h-[350px] w-full" alt="" />

        <div class="flex flex-col">
          <div class="bg-white p-6 rounded-xl shadow-lg">
            <div class="grid grid-cols-1 md:grid-cols-2   lg:grid-cols-4  xl:grid-cols-4 gap-20">
              <div class="flex flex-col justify-around">
                <label for="name" class="font-medium text-sm text-stone-600">Search</label>
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  maxlength="20"
                  id="name"
                  placeholder="Name"
                  class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                />
              </div>
              <div class="flex flex-col justify-around">
                <label for="name" class="font-medium text-sm text-stone-600">Minimum Price</label>
                <input
                  type="text"
                  maxlength="10"
                  value={minPrice}
                  onChange={(e) => (!isNaN(parseInt(e.target.value) || e.target.value == '') ? setMinPrice(parseInt(e.target.value) || '') : '')}
                  id="name"
                  placeholder="0-20000"
                  class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                />
              </div>
              <div class="flex flex-col justify-around">
                <label for="name" class="font-medium text-sm text-stone-600">Maximum Price</label>
                <input
                  value={maxPrice}
                  maxlength="10"
                  onChange={(e) => (!isNaN(parseInt(e.target.value) || e.target.value == '') ? setMaxPrice(parseInt(e.target.value) || '') : '')}
                  type="text"
                  id="name"
                  placeholder="0-20000"
                  class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                />
              </div>


              <div class="flex flex-col">
                <label for="status" class="font-medium text-sm text-stone-600">Brand</label>

                <select value={brandSelection} onChange={(e) => setBrandSelection(e.target.value)}
                  id="status"
                  class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                >
                  <option value=''>-- select a Brand -- </option>
                  {brands.map(b => <option value={b}> {b}</option>)}
                </select>
              </div>
            </div>

            <div class="grid md:flex grid-cols-2 justify-end space-x-4 w-full mt-6">
              <button onClick={handleReset} class="px-4 py-2 rounded-lg text-stone-50 bg-stone-400 hover:bg-stone-500 font-bold shadow-lg shadow-stone-200 transition ease-in-out duration-200 translate-10">
                Reset
              </button>

              <button onClick={handleSearch} class="px-4 py-2 rounded-lg text-orange-50 bg-orange-400 hover:bg-orange-500 font-bold shadow-lg shadow-orange-200 transition ease-in-out duration-200 translate-10">
                Search
              </button>
            </div>
          </div>
        </div>

      </div>

      <div className="w-full flex justify-center mt-5 mb-4">

        <div className="grid gap-4 grid-cols-3 w-[80%]">
          {products.map((product) => {
            return (
              <div className="shadow" key={product.id}>
                <img src={product.image} className="h-[250px] w-full " alt="" />

                <div className="w-[95%] flex justify-between   my-3">
                  <div className="mx-2">
                    <h3>{product.name}</h3>
                    <h4>${product.price}</h4>
                    <input
                      type="hidden"
                      value={product.name}
                      id={`hiddenname${product.id}`}
                    />
                    <input
                      type="hidden"
                      value={product.price}
                      id={`hiddenprice${product.id}`}
                    />
                    <input
                      type="hidden"
                      value={product.image}
                      id={`hiddenimage${product.id}`}
                    />
                  </div>
                  {LoginStatus ? (
                    <>
                  <div>
                    <button
                      id={product.id}
                      onClick={addToCartHandler}
                      className=" block py-2 px-5 bg-orange-400 text-white rounded hover:bg-orange-200 hover:text-black"
                    >
                      Add To Cart
                    </button>
                    <Link to={`productdetails/${product.id}`}>
                      <button className="block py-2 px-10 my-2  bg-blue-600 text-white rounded hover:bg-blue-200 hover:text-black">
                        details
                      </button>
                    </Link>
                  </div>
                  </>
                  ) : (
                    <>
                  <div>
                      <a href="/login" >
                    <button
                      id={product.id}
                      className=" block py-2 px-5 bg-orange-400 text-white rounded hover:bg-orange-200 hover:text-black"
                          >
                      Add To Cart
                    </button>
                    <Link to={`productdetails/${product.id}`}>
                      <button className="block py-2 px-10 my-2  bg-blue-600 text-white rounded hover:bg-blue-200 hover:text-black">
                        details
                      </button>
                    </Link>
                    </a> 
                  </div>

                    </>
                        )}

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;

