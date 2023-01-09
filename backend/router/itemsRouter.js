const express = require("express");
const itemrouter = express.Router();
const {Item} = require("../models/Models");
const { check, validationResult } = require("express-validator");
const { Sequelize,Op } = require("sequelize");

itemrouter.get("/all_items", async (req, res) => {
  const product = await Item.findAll();
  res.json(product);
});
itemrouter.get("/get_item/:id", async (req, res) => {
  const id  = req.params.id;

  const product = await Item.findOne({
    where: {
      id: id
    }
  })

  if (!product) {
    res.json({ message: "product not found", status: 0 });
    return;
  }

  res.json(product);
});



itemrouter.post(
    "/add",
    check("name", "Enter Product Name").not().isEmpty(),
    check("price", "Enter Product Price").not().isEmpty(),
    check("brand", "Product Brand").not().isEmpty(),
    check("image", "Add Image Link").not().isEmpty(),
    check("description", "Enter product description").not().isEmpty(),
   async (req, res) => {
      const { name, price, image, brand, description } = req.body;
  
      const error = validationResult(req);
  
      if (!error.isEmpty()) {
        res.json({ error: error.array(), status: 0 });
        return;
      }
  
      const newProduct = await Item.create({ 
        name,
        price,
        brand,
        image,
        description,
      });
  
      newProduct.save().then((docs) => {
        res.send({ message: "Product added", status: 1, docs });
      });
    }
  );

  itemrouter.get('/brands',async (req,res)=>{
    try{
      const brands=await Item.findAll({attributes:[Sequelize.fn('DISTINCT', Sequelize.col('brand')) ,'brand']})
      res.json(brands.map(i=>i.brand))
    }
    catch(err){
    
      res.status(500)
      res.json({success:false,msg:'Internal Server Error'})
    }
  })
  itemrouter.get('/search',async (req,res)=>{
    const {query,min_price,max_price,brand}=req.query
    try{
      const items=await Item.findAll({
        where: { 
            name:{
            [Op.like]: (query)?'%'+query+'%':'%'
            },
            price: {
            [Op.and]: {
                [Op.gte]: min_price || 0,
                [Op.lte]: max_price || 99999999,
                }
            },
            brand: {
            [Op.regexp]: brand || '^*'
            }
        }
        })  
      res.json(items)
    }
    catch(err){
      res.status(500)
      res.json({success:false,msg:'Internal Server Error'})
    }
  })
  module.exports = itemrouter;
  