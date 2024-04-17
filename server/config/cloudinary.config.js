const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
// https://console.cloudinary.com/pm/c-8fab4d5e6cad8706e4276291e36b83/media-explorer/mernecommercs-hip06 (link cloudinary)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpg', 'png'],
  params: {
    folder: 'mernecommercs-hip06',
  }
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;