const express = require('express');
const router = express.Router();
const NGO = require('../db/models/Ngo');

//=================API for Create NGO==================//
router.post('/signup', async function (req, res) {
    const { name, email, password, state, city, pincode, mobile, pocName, ngoCol } = req.body
    if (!name || !email || !password || !state || !city || !pincode || !mobile || !pocName || !ngoCol) {
        return res.status(201).json({ success: false, message: 'Please enter all name, email, password, state, city, pincode, mobile, pocName, ngoCol' });
    }
    let oldUSer = await NGO.find({ email })
    if (oldUSer && oldUSer.length > 0) {
        return res.status(201).json({ success: false, message: 'Account already exist with this email!' });
    }
    let ngoData = await NGO.create({ name, email, password, state, city, pincode, mobile, pocName, ngoCol });
    return res.status(200).json({ success: true, data: ngoData });
});

//=================API for login NGO==================//
router.post('/login', async function (req, res) {
    const { username, password } = req.body
    const userData = await NGO.find({ email: username, password: password });
    if (userData && userData.length > 0) {
        return res.status(200).json({ success: true, data: userData });
    } else {
        return res.status(201).json({ success: false, message: 'Invalid credentials' });
    }
});

//=================API for get ngo==================//
router.get('/id/:id', async function (req, res) {
    const { id } = req.params
    if (!id) {
        return res.status(201).json({ success: false, message: 'Please pass ngo id' });
    }
    let Data = await NGO.find({ _id: id });
    return res.status(200).json({ success: true, data: Data });
});

//=================API for get all ngo==================//
router.get('/all-ngo', async function (req, res) {
    let Data = await NGO.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: Data });
});

//=================API to update NGO==================//
router.put('/ngo-update', async function (req, res) {
    const { userId, name, state, city, pincode, mobile, pocName, ngoCol } = req.body
    console.log(req.body)
    if (!name || !userId || !state || !city || !pincode || !mobile) {
        return res.status(201).json({ success: false, message: 'userId, name, state, city, pincode, mobile, pocName, ngoCol' });
    }
    await NGO.findOneAndUpdate({ _id: userId }, { name, state, city, pincode, mobile, pocName, ngoCol })
    return res.status(200).json({ success: true, message: 'Updated successfully' });
});

//=================API to delete NGO==================//
router.put('/ngo-delete', async function (req, res) {
    const { userId } = req.body
    if (!userId) {
        return res.status(201).json({ success: false, message: 'userId needed' });
    }
    await NGO.deleteOne({ _id: userId })
    return res.status(200).json({ success: true, message: 'Deleted successfully' });
});
module.exports = router;
