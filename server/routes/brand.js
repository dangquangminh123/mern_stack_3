const router = require('express').Router()
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const ctrls = require('../controllers/brand')

router.get('/', ctrls.getBrand)
router.post('/', [verifyAccessToken, isAdmin], ctrls.createNewBrand)
router.put('/:bid', [verifyAccessToken, isAdmin], ctrls.updateBrand)
router.delete('/:bid', [verifyAccessToken, isAdmin], ctrls.deleteBrand)

module.exports = router