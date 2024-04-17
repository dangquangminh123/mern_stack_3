const Brand = require('../models/brand')
const asyncHandler = require("express-async-handler")

const createNewBrand = asyncHandler(async (req, res) => {
    const response = await Brand.create(req.body)
    return res.json({
        success: response ? true : false,
        createdBrand: response ? response : 'Cannot create new Brand'
    })
})

const updateBrand = asyncHandler(async (req, res) => {
    const {bid} = req.params
    const response = await Brand.findByIdAndUpdate(bid, req.body, {new: true})
    return res.json({
        success: response ? true : false,
        updatedBrand: response ? response : 'Cannot updated Brand'
    })
})

const getBrand = asyncHandler(async (req, res) => {
    const response = await Brand.find()
    return res.json({
        success: response ? true : false,
        Brand: response ? response : 'Cannot get Brand'
    })
})


const deleteBrand = asyncHandler(async (req, res) => {
    const {bid} = req.params
    const response = await Brand.findByIdAndDelete(bid)
    return res.json({
        success: response ? true : false,
        deleteBrand: response || 'Something went wrong', 
    })
})



module.exports = {
    createNewBrand,
    updateBrand,
    getBrand,
    deleteBrand
}
