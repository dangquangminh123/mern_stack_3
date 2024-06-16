const Product = require('../models/product')
const ProductCategory = require('../models/productCategory')
const asyncHandler = require("express-async-handler");
const data = require('../../data/data2.json')
const categoryData = require('../../data/cate_brand')
const slugify = require('slugify')

const fn = async (product) => {
    await Product.create({
        title: product?.name,
        slug: slugify(product?.name) + Math.round(Math.random() * 100) + '',
        description: product?.description,
        brand: product?.brand,
        price: Math.round(Number(product?.price?.match(/\d/g).join('')) / 100),
        category: product?.category[1],
        quantity: Math.round(Math.random() * 1000),
        sold: Math.round(Math.random() * 100),
        images: product?.images,
        // Vào product và tìm đến mảng variants tìm những element có label là color và lấy phần tử đầu tiên
        color: product?.variants?.find(el => el.label === 'Color')?.variants[0],
        thumb: product?.thumb,
        // totalRatings: Math.round(Math.random() * 5)
        totalRatings: 0
    })
}

const insertProduct = asyncHandler(async (req, res) => {
    // const response = await Product.findByIdAndUpdate(pid, {$push: {images: {$each: req.files.map(el => el.path)}}}, {new: true})
    // return res.status(200).json({
    //     status: response ? true : false,
    //     updateProduct: response ? response : 'Cannot upload images product'
    // })
    const promises = []
    for (let product of data) promises.push(fn(product))
    await Promise.all(promises)
    return res.json('Done')
})

const fn2 = async (cate) => {
    await ProductCategory.create({
        title: cate?.cate,
        brand: cate?.brand,
        image: cate?.image
    })
}

const insertCategory = asyncHandler(async (req, res) => {
    // const response = await Product.findByIdAndUpdate(pid, {$push: {images: {$each: req.files.map(el => el.path)}}}, {new: true})
    // return res.status(200).json({
    //     status: response ? true : false,
    //     updateProduct: response ? response : 'Cannot upload images product'
    // })
    const promises = []
    for (let cate of categoryData) promises.push(fn2(cate))
    await Promise.all(promises)
    return res.json('Done')
})

module.exports = {
    insertProduct,
    insertCategory
}
