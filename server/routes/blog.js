const router = require('express').Router()
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const ctrls = require('../controllers/blog')
const uploader = require('../config/cloudinary.config')

router.get('/', ctrls.getBlogs)
router.get('/one/:bid', ctrls.getBlog)
router.post('/', [verifyAccessToken, isAdmin], ctrls.createNewBlog)
router.put('/:bid', [verifyAccessToken, isAdmin], ctrls.updateBlog)
router.put('/likes/:bid', [verifyAccessToken], ctrls.likeBlog)
router.put('/image/:bid', [verifyAccessToken, isAdmin], uploader.single("image"), ctrls.uploadImagesBlog)
router.put('/dislike/:bid', [verifyAccessToken], ctrls.dislikeBlog) 
router.delete('/:bid', [verifyAccessToken, isAdmin], ctrls.deleteBlog)

module.exports = router