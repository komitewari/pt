const express = require('express');
const FileReader = require('filereader');
const router = express.Router();
const Admin = require('../db/models/Admin');
CLOUDINARY_URL = "cloudinary://852588752971121:9VN0BvTC26a68Nr9-RgxBhdVz-Y@dcfq8edzv"
var cloudinary = require('cloudinary');
var multer = require('multer');
// var storage = multer.diskStorage({});
const storage = multer.memoryStorage()
// const upload = multer();
const app = express()

const upload = multer({ dest: 'uploads/' })

const streamifier = require('streamifier')
const uploadtest = multer({
    dest: 'avatar'
})

cloudinary.config({
    cloud_name: 'dcfq8edzv',
    api_key: '852588752971121',
    api_secret: '9VN0BvTC26a68Nr9-RgxBhdVz-Y'
});

//=================API for Admin Login==================//
router.post('/login', async function (req, res) {
    const { username, password } = req.body
    const adminData = await Admin.find({ email: username, password: password });
    if (adminData && adminData.length > 0) {
        return res.status(200).json({ success: true, data: adminData });
    } else {
        return res.status(201).json({ success: false, message: 'Invalid credentials' });
    }
});

//=================API for Admin Login==================//
router.post('/upload', upload.single('example'), async function (req, res, next) {
    // console.log("ggggggggggggg", req.files.file)
    // let file = (req && req.files.file) ? req.files.file : '';
    // let a = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
    // const cloudres = await cloudinary.uploader.upload(a, function (error, result) { console.log(result, error) });
    // console.log("gggggggggggggggggggg", cloudres)


    // let a = URL.createObjectURL(req.files.file)
    console.log("gggggggggg", req.body.url)
    try {
        // const cloudres = await cloudinary.v2.uploader.upload(req.body.url, { upload_preset: "ml_default" });
        console.log("cloudres")

    }
    catch (err) {
        console.log("rrrrrrrrr", err, "ffffffffffffffffffffffffff")
    }
});

module.exports = router;