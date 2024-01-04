const express = require('express');
const router = express.Router();
const Donation = require('../db/models/Donation');
const User = require('../db/models/User');
const NGO = require('../db/models/Ngo');
const cloudinary = require('../middleware/cloudinary')

//=================API for Create Medicine donation==================//
router.post('/add', async function (req, res) {
    let { brandName, genericName, medicineType, expiryDate, quantity, userId, userType, donationId, imageUrl } = req.body
    if (!brandName || !medicineType || !quantity || !userId || !userType) {
        return res.status(201).json({ success: false, message: 'Please enter all imageUrl, brandName, genericName, medicineType, expiryDate, state, city, quantity, userId, ngoId, type' });
    }

    if (userType == 'user' && !imageUrl) {
        return res.status(201).json({ success: false, message: 'Please imageUrl' });
    }
    let data = []
    let ngoId = null
    if (userType == 'user') {
        data = await User.find({ _id: userId })
    } else {
        data = await NGO.find({ _id: userId })
        ngoId = userId
        userId = null
    }
    let Data = []
    if (!donationId || donationId.length == 0) {
        Data = await Donation.create({ imageUrl: imageUrl, brandName, genericName, medicineType, expiryDate, state: data[0].state, city: data[0].city, quantity, userId, ngoId, userType });
    } else {
        Data = await Donation.updateOne({ _id: donationId }, { imageUrl: imageUrl, brandName, genericName, medicineType, expiryDate, state: data[0].state, city: data[0].city, quantity, userId, ngoId, userType })
    }
    res.status(200).json({ success: true, data: Data });

    // send email
    let dataToSendEmail = []
    let text = ''
    if (userType == 'user') {
        dataToSendEmail = await NGO.find({ state: data[0].state })
        text = 'New donation of Medicine is posted for your state, please check your MedHelp account! Thank You!'
    } else {
        dataToSendEmail = await User.find({ state: data[0].state })
        text = 'New requirement of Medicine is posted for your state, please check your MedHelp account! Thank You!'
    }

    for (let doc of dataToSendEmail) {
        const send = require('gmail-send')({
            user: 'medhelp025@gmail.com',
            pass: 'Godisgreat@123',
            to: doc.email,
            subject: 'Medicine Help ',
        });
        await send({
            text: text,
        }, (error, result, fullResult) => {
            if (error) console.error(error);
            console.log(result);
        })
    }
});


//=================API for Create Medicine donation==================//
router.get('/test', async function (req, res) {
    const send = require('gmail-send')({
        user: 'medhelp025@gmail.com',
        pass: 'Godisgreat@123',
        to: 'amanansari2507@gmail.com',
        subject: 'test subject',
    });

    send({
        text: 'gmail-send example 1',
    }, (error, result, fullResult) => {
        if (error) console.error(error);
        console.log(result);
    })

    return res.status(200).json({ success: true });
});
//=================API for get donation==================//
router.get('/id/:id', async function (req, res) {
    const { id } = req.params
    if (!id) {
        return res.status(201).json({ success: false, message: 'Please pass ngo id' });
    }
    let Data = await Donation.find({ _id: id });
    return res.status(200).json({ success: true, data: Data });
});

//=================API for get donation by User==================//
router.get('/user/:id', async function (req, res) {
    const { statusType } = req.query
    const { id } = req.params
    let where = { userId: id }
    if (statusType == 'pending') { where = { userId: id, status: 'pending' } }
    if (statusType == 'completed') { where = { userId: id, status: 'completed' } }
    if (!id) {
        return res.status(201).json({ success: false, message: 'Please pass user id' });
    }
    let Data = await Donation.find(where).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: Data });
});

//=================API for get donation by NGO==================//
router.get('/ngo/:id', async function (req, res) {
    const { statusType } = req.query
    const { id } = req.params
    let where = { ngoId: id }
    if (statusType == 'pending') { where = { ngoId: id, status: 'pending' } }
    if (statusType == 'completed') { where = { ngoId: id, status: 'completed' } }
    if (!id) {
        return res.status(201).json({ success: false, message: 'Please pass ngo id' });
    }
    let Data = await Donation.find(where).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: Data });
});

//=================API for get all donation==================//
router.get('/all-donations', async function (req, res) {
    let { userType, statusType, reported } = req.query
    let where = { "report.reported": 'no' }
    if (reported == 'yes') { where = { "report.reported": 'yes' } }
    if (userType == 'ngo') { where.userType = 'ngo' }
    if (userType == 'user') { where.userType = 'user' }
    if (statusType == 'pending') { where.status = 'pending' }
    if (statusType == 'completed') { where.status = 'completed' }
    let Data = await Donation.find(where).sort({ createdAt: -1 }).populate('ngoId').populate('userId');
    return res.status(200).json({ success: true, data: Data });
});

//=================API for status update==================//
router.post('/status', async function (req, res) {
    const { status, id } = req.body
    if (!status || !id) {
        return res.status(201).json({ success: false, message: 'Please pass status and id' });
    }
    await Donation.updateOne({ _id: id }, { status });
    return res.status(200).json({ success: true });
});

//=================API for delete donation==================//
router.post('/delete', async function (req, res) {
    const { id } = req.body
    if (!id) {
        return res.status(201).json({ success: false, message: 'Please pass id' });
    }
    await Donation.deleteOne({ _id: id });
    return res.status(200).json({ success: true });
});

//=================API for delete donation==================//
router.post('/report', async function (req, res) {
    const { id } = req.body
    if (!id) {
        return res.status(201).json({ success: false, message: 'Please pass id' });
    }
    await Donation.updateOne({ _id: id }, { "report.reported": 'yes' });
    return res.status(200).json({ success: true });
});

//=================API for un-report donation==================//
router.post('/un-report', async function (req, res) {
    const { id } = req.body
    if (!id) {
        return res.status(201).json({ success: false, message: 'Please pass id' });
    }
    await Donation.updateOne({ _id: id }, { "report.reported": 'no' });
    return res.status(200).json({ success: true });
});

//=================API for get reported donation==================//
router.get('/reported-donations', async function (req, res) {
    let { type } = req.query
    let where = { "report.reported": 'yes' }
    if (type == 'donation') { where.userType = 'user' }
    if (type == 'request') { where.userType = 'ngo' }
    let Data = await Donation.find(where).sort({ createdAt: -1 }).populate('ngoId').populate('userId');
    return res.status(200).json({ success: true, data: Data });
});

module.exports = router;
