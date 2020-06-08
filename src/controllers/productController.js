const Product = require('../models/productModel');
const CatchError = require('../utils/catchError');
const CustomError = require('../utils/customError');

exports.add = CatchError(async (req, res, next)=>{
    const product = req.body;
    product.userId = req.user._id;

    const newProduct = await Product.create(product);

    res.status(200).json({
        result: true,
        message: "New product created successfully",
    })
});

exports.get = CatchError(async (req, res, next)=>{
    const idProduct = req.body.id;
    
    if(!idProduct)
        return next(new CustomError("You must provide product id", 400));
    
    const product = await Product.findById(idProduct);

    res.status(200).json(product);
});

exports.getList = CatchError(async (req, res, next)=>{
    const products = await Product.find({userId: { $eq: req.user._id}});

    res.status(200).json(products);
});

exports.update = CatchError(async (req, res, next)=>{
    const idProduct = req.body.id;
    const product = req.body.product;

    if(!idProduct)
        return next(new CustomError("You must provide product id", 400));
    
    if(!idProduct)
        return next(new CustomError("You must provide product obj to update", 400));
    

    const updateProduct = await Product.findByIdAndUpdate(idProduct, product);

    res.status(200).json({
        result: true,
        message: "Product updated successfully",
    })
});

exports.delete = CatchError(async (req, res, next) =>{
    const idProduct = req.body.id;

    if(!idProduct)
        return next(new CustomError("You must provide product id", 400));

    const deleteProduct = await Product.findByIdAndDelete(idProduct);

    res.status(200).json({
        result: true,
        message: "Product deleted successfully"
    });
});