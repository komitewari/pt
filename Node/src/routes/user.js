const express = require('express');
const router = express.Router();
const User = require('../db/models/User');

//=================API for Create user==================//
router.post('/signup', async function (req, res) {
    const { name, email, password, state, city, pincode, mobile } = req.body
    if (!name || !email || !password || !state || !city || !pincode || !mobile) {
        return res.status(201).json({ success: false, message: 'Please enter all values' });
    }
    let oldUSer = await User.find({ email })
    if (oldUSer && oldUSer.length > 0) {
        return res.status(201).json({ success: false, message: 'Account already exist with this email!' });
    }
    let userData = await User.create({ name, email, password, state, city, pincode, mobile });
    return res.status(200).json({ success: true, data: userData });
});

//=================API for login user==================//
router.post('/login', async function (req, res) {
    const { username, password } = req.body
    const userData = await User.find({ email: username, password: password });
    if (userData && userData.length > 0) {
        return res.status(200).json({ success: true, data: userData });
    } else {
        return res.status(201).json({ success: false, message: 'Invalid credentials' });
    }
});

//=================API for get user==================//
router.get('/id/:id', async function (req, res) {
    const { id } = req.params
    if (!id) {
        return res.status(201).json({ success: false, message: 'Please pass user id' });
    }
    let userData = await User.find({ _id: id });
    return res.status(200).json({ success: true, data: userData });
});

//=================API for get all users==================//
router.get('/all-users', async function (req, res) {
    let userData = await User.find({ userType: 'user' }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: userData });
});

//=================API to update users==================//
router.put('/user-update', async function (req, res) {
    const { userId, name, state, city, pincode, mobile } = req.body
    if (!name || !userId || !state || !city || !pincode || !mobile) {
        return res.status(201).json({ success: false, message: 'userId, name, state, city, pincode, mobile' });
    }
    await User.findOneAndUpdate({ _id: userId }, { name, state, city, pincode, mobile }, { new: true })
    return res.status(200).json({ success: true, message: 'Updated successfully' });
});

//=================API to delete users==================//
router.put('/user-delete', async function (req, res) {
    const { userId } = req.body
    if (!userId) {
        return res.status(201).json({ success: false, message: 'Please pass userId' });
    }
    await User.deleteOne({ _id: userId })
    return res.status(200).json({ success: true, message: 'Deleted successfully' });
});

module.exports = router;
