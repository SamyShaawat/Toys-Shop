









itemrouter.post(
    "/add",
    check("name", "Enter Product Name").not().isEmpty(),
    check("price", "Enter Product Price").not().isEmpty(),
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