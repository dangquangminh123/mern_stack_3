const router = require('express').Router()
const ctgr = require('../controllers/productCategory')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/', [verifyAccessToken, isAdmin], ctgr.createCategory)
router.get('/', ctgr.getCategories)
router.put('/:pcid', [verifyAccessToken, isAdmin], ctgr.updateCategory)
router.delete('/:pcid', [verifyAccessToken, isAdmin], ctgr.deleteCategory)

module.exports = router

//CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETE