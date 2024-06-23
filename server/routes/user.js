const router = require('express').Router()
const ctrls = require('../controllers/user')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')



router.post('/login', ctrls.login)
router.post('/mock', ctrls.createUsers)
router.get('/current', verifyAccessToken, ctrls.getCurrent)
router.post('/refreshtoken', ctrls.refreshAccessToken)
router.get('/logout', ctrls.logout)
router.post('/forgotpassword', ctrls.forgotPassword)
router.put('/resetpassword', ctrls.resetPassword)
router.get('/', [verifyAccessToken, isAdmin], ctrls.getUsers)
router.delete('/:uid', [verifyAccessToken, isAdmin], ctrls.deleteUsers)
router.put('/current', [verifyAccessToken], ctrls.updateUsers)
router.put('/address', [verifyAccessToken], ctrls.updateUserAddress)
// Link router updated address phải nằm trên link router updated id user bởi admin
router.put('/cart', [verifyAccessToken], ctrls.updateCart)
router.put('/:uid', [verifyAccessToken, isAdmin], ctrls.updateUserByAdmin)
router.post('/register', ctrls.register)
router.put('/finalregister/:token', ctrls.finalRegister)
module.exports = router

//CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETE