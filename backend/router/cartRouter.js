const express = require("express");
const cartrouter = express.Router();
const jwt = require('jsonwebtoken')
const {CartItems,Item} = require("../models/Models");
const { check, validationResult } = require("express-validator");
const authMiddleware = require("../middleware/auth")

cartrouter.get('/',authMiddleware,async(req,res)=>{
    try{
     const cart_items=await CartItems.findAll({where:{userID:res.locals.userID},include:[{model:Item,required:false}]})
        res.json(cart_items)
    }catch(err){
        console.log(err)
        res.status(500)
        res.json({success:false,msg:'Internal Server Error'})
    }

})
cartrouter.post('/add',authMiddleware,async(req,res)=>{
    try{
        const {product_id,quantity}=req.body
    
        await CartItems.create({
            userID:res.locals.userID,itemID:product_id,quantity:quantity
        })
        res.json({success:true})        
    }catch(err){
        try{
            const {product_id,quantity}=req.body
            await CartItems.increment({quantity:+1},{where:{userID:res.locals.userID,itemID:product_id}})
        }catch{
            res.status(500)
            res.json({success:false,msg:'Something wernt wrong'})
        }


    }
})
cartrouter.post('/remove',authMiddleware,async(req,res)=>{
    try{
        const {product_id}=req.body
        await CartItems.destroy({
            where:{userID:res.locals.userID,itemID:product_id}
        })
        res.json({success:true})        
    }catch(err){
        console.log(err)
        res.status(500)
        res.json({success:false,msg:'Something wernt wrong'})
    }
})
cartrouter.post('/update-quantity',authMiddleware,async(req,res)=>{
    try{
        const {product_id,quantity}=req.body
        if(quantity>0){
            await CartItems.update({quantity:quantity},{where:{userID:res.locals.userID,itemID:product_id}})
        }else{
            await CartItems.destroy({
                where:{userID:res.locals.userID,itemID:product_id}
            })  
        }
        res.json({success:true})        
    }catch(err){
        console.log(err)
        res.status(500)
        res.json({success:false,msg:'Something wernt wrong'})
    }
})
module.exports = cartrouter;



