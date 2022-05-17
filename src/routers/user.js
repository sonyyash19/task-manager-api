const express = require('express');
const sharp = require('sharp');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();
const multer = require('multer');

// async before the function returns a promise
router.post('/users', async (req,res) => {  
    const user = new User(req.body);

    try{
        // await can only be used with the async function
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    }catch(e) {
        res.status(400).send(e);
    }

})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({user, token});
    } catch (e) {
        res.status(400).send();
    }
})

router.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;      // return true if not equal(tokens) and false if tokens equal and filters them out
        })

        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send();
    }
})

router.post('/users/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
        
    } catch (e) {
        res.status(500).send();
    }
})

router.get('/users/me', auth, async (req, res) => {
   res.send(req.user);
})

router.patch('/users/me', auth, async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({error : 'Invalid Updates'});
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update]);

        await req.user.save();

        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }

})

router.delete('/users/me', auth, async (req, res) => {

    try {
        await req.user.remove();

        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000     // 1000000 (million) = 1 mb
    },
    fileFilter(req, file, cb) {    // fun to check the file extension
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image'));
        }

        cb(undefined, true);
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save(); 
    res.send();
}, (error, req, res, next) => {  // error handler fun to convert multer html errors to json errors
    res.status(400).send({ error: error.message });
})

router.delete('/users/me/avatar', auth, async(req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
})

router.get('/users/:id/avatar', async(req , res) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user || !user.avatar){
            throw new Error();
        }

        res.set('Content-Type', 'image/jpg');
        res.send(user.avatar);
    } catch (error) {
        res.status(404).send();
    }
})

module.exports = router;