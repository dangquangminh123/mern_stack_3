const Product = require('../models/product')
const asyncHandler = require("express-async-handler");
const slugify = require('slugify')

const createProduct = asyncHandler(async (req, res) => {
    const {title, price, description, brand, category, color} = req.body
    const thumb = req?.files?.thumb[0]?.path
    const images = req.files?.images?.map(el => el.path)
    if(!(title && price && description && brand && category && color)) throw new Error("Missing inputs")
    req.body.slug = slugify(title)
    if(thumb) req.body.thumb = thumb
    if(images) req.body.images = images
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        success: newProduct ? true : false,
        mes: newProduct ? 'Create Product successfully!' : 'Create product failed'
    })
})

const getAllProduct = asyncHandler(async (req, res) => {
     const products = await Product.find()
   return res.status(200).json({
        success: products ? true : false,
        productData: products ? products : 'Cannot get Products'
    })
})

const getProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const product = await Product.findById(pid).populate({
        path: 'ratings',
        populate: {
            path: 'postedBy',
            select: 'firstname lastname avatar'
        }
    })
    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product : 'Cannot get Product'
    })
})

const getProducts = asyncHandler(async (req, res) => {
    const queries = {...req.query}
    // Tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit','sort','page','fields']
    excludeFields.forEach(el => delete queries[el])
   
    // Format lại các operator cho đúng cú pháp mongoose
    let queryString =JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|It|lte)\b/g, macthedEl => `$${macthedEl}`)
    const formatedQueries = JSON.parse(queryString)
    let colorQueryObject = {}
    // Filterning
    if (queries?.title) formatedQueries.title = {$regex: queries.title, $options: 'i'}
    if (queries?.category) formatedQueries.category = {$regex: queries.category, $options: 'i'}
    if (queries?.color) {
        delete formatedQueries.color
        const colorArr = queries.color?.split(',')
        const colorQuery = colorArr.map(el => ({color: {$regex: el, $options: 'i'} }))
        colorQueryObject = { $or: colorQuery }
    }

    let queryObject = {}
    if(queries?.querySearch) {
        delete formatedQueries.querySearch
        queryObject = { $or: [
            {color: {$regex: queries.querySearch, $options: 'i'} },
            {title: {$regex: queries.querySearch, $options: 'i'} },
            {category: {$regex: queries.querySearch, $options: 'i'} },
            {brand: {$regex: queries.querySearch, $options: 'i'} },
            // {description: {$regex: queries.querySearch, $options: 'i'} },
        ]}
    }

    const q = {...colorQueryObject, ...formatedQueries, ...queryObject}
    // console.log(q);
    let queryCommand = Product.find(q)

    // Sorting
    if(req.query.sort) {
        const sortBy = req.query.sort.split('.').join(' ')
        queryCommand = queryCommand.sort(sortBy)
    }

    // Fields limiting
    if(req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    }

    // Pagination
    // Limit: số object lấy về 1 gọi API
    // skip: 2
    // 1 2 3 ... 10
    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS
    const skip = (page - 1) * limit;
    queryCommand.skip(skip).limit(limit)
    // dấu + đằng trước để convert sang dạng number ví dụ: +2 => 2, +dasfasd => NaN

    // Execute query
    // Số lượng sản phẩm thỏa mãn điều kiện !== số lượng sản phẩm trả về 1 lần khi gọi API
    queryCommand.exec(async (err, response) => {
        if(err) throw new Error(err.message)
        const counts = await Product.find(q).countDocuments()
        return res.status(200).json({
            success: response ? true : false,
            counts,
            products: response ? response : 'Cannot get Products',
        })
    })    
})

const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const files = req?.files
    console.log(req?.files)
    if(files?.thumb) req.body.thumb = files?.thumb[0]?.path
    if(files?.images) req.body.images = files?.images?.map(el => el.path)
        
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true })
    return res.status(200).json({
        success: updatedProduct ? true : false,
        mes: updatedProduct ? 'Updated Products successfully!' : 'Cannot Updated Products'
    })
})

const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const deletedProducts = await Product.findByIdAndDelete(pid)
    return res.status(200).json({
        success: deletedProducts ? true : false,
        mes: deletedProducts ? 'Deleted successfully!' : 'Cannot deleted Product'
    })
})

const ratings = asyncHandler(async (req, res) => {
    const {_id} = req.user
    const {star, comment, pid, updatedAt} = req.body
    if(!star || !pid) throw new Error('Missing inputs')
    const ratingProduct = await Product.findById(pid)
    const alreadyRating = ratingProduct?.ratings?.find(el => el.postedBy.toString() === _id)

    if(alreadyRating) {
        // Updated star & comment
        await Product.updateOne({
            ratings: { $elemMatch: alreadyRating}
        }, {
            /* dấu $ trong chuỗi là các object nào rating trong model product mà thỏa mãn đúng như giá trị của alreadyRating
            thì cập lại trong mongoDB*/
            $set: { "ratings.$.star": star, "ratings.$.comment": comment, "ratings.$.updatedAt": updatedAt }
        }, {new: true})
    }else {
        await Product.findByIdAndUpdate(pid, {
            $push: {ratings: {star, comment, postedBy: _id, updatedAt}}
        }, {new: true})
    }

    // Sum ratings
    const updatedProduct = await Product.findById(pid)
  
    // console.log(updatedProduct.ratings);
    if(updatedProduct.ratings?.length > 0) {
        const ratingsCount = updatedProduct.ratings.length
        const sumRatings = updatedProduct.ratings?.reduce((sum, el) => sum + +el.star, 0)
        updatedProduct.totalRatings = Math.round(sumRatings * 10 / ratingsCount) / 10;
    }
   
    await updatedProduct.save()
   
    return res.status(200).json({
        status: true,
        updateProduct
    })
})

const uploadImagesProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    if(!req.files) throw new Error('Missing inputs')
    // Đẩy các phần từ mới vào mảng images (lấy riêng từng phần tử path và sau đó push vào images, each )
    const response = await Product.findByIdAndUpdate(pid, {$push: {images: {$each: req.files.map(el => el.path)}}}, {new: true})
    return res.status(200).json({
        status: response ? true : false,
        updateProduct: response ? response : 'Cannot upload images product'
    })
})




module.exports = {
    createProduct,
    getAllProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    ratings,
    uploadImagesProduct,
}