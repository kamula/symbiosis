const express = require('express');
const bcrypt = require('bcrypt');
const MongoClient = require('mongodb').MongoClient;
const jwt = require('jsonwebtoken');
require('dotenv/config');
const router = express.Router();
const sendmail = require('./mail');
const { ObjectID } = require('mongodb');
//const authuser = require('./authuser');

const url = process.env.USER_DB;

const client = new MongoClient(url);

client.connect((err, client) => {
    if (err) {
        throw err;
    } else {
        const db = client.db('symbiosis');
        console.log('connected to db');
        router.post('/register', async(req, res) => {
            db.collection('users')
                .findOne({ email: req.body.email })
                .then((user) => {
                    if (!user) {
                        bcrypt.hash(req.body.password, 10, (err, hash) => {
                            hash = req.body.password;
                            db.collection('users').insertOne({
                                firstname: req.body.firstname,
                                lastname: req.body.lastname,
                                email: req.body.email,
                                datejoined: new Date(),
                                status: req.body.status,
                                password: hash,
                            });
                            sendmail(req.body.email);
                            res.json({
                                message: 'data saved ',
                            });
                        });
                    } else {
                        res.json({ message: 'email exist' });
                    }
                });
        });
        //login  route
        router.post('/login', async(req, res) => {
            await db
                .collection('users')
                .findOne({ email: req.body.email })
                .then((user) => {
                    if (user) {
                        if (bcrypt.compareSync(req.body.password, user.password)) {
                            res.json({ message: 'logged in' });
                            //redirect to new route
                            //res.redirect("./mail")
                            const loggeduser = {
                                _id: user._id,
                                firstname: user.firstname,
                                lastname: user.lastname,
                                email: user.email,
                            };
                            //let token = jwt.sign(loggeduser, { expiresIn: 1440 })
                            console.log(loggeduser);
                        } else {
                            res.json({ message: 'passwords do not match' });
                        }
                    } else {
                        res.json({ message: 'user does not exist' });
                    }
                })
                .catch((err) => {
                    res.json({ err: err });
                });
        });
        //get all users user
        router.get('/details', async(req, res) => {
            await db
                .collection('users')
                .find()
                .toArray((err, result) => {
                    if (err) {
                        throw err;
                    } else {
                        res.json(result);
                    }
                });
        });
        //remove user
        router.delete('/delete/:userId', async(req, res) => {
            try {
                const deleteduser = await db
                    .collection('users')
                    .deleteOne({ _id: ObjectID(req.params.userId) });
                res.json(deleteduser);
            } catch (err) {
                throw err;
            }
        });
        //update user password
        // router.patch("/password/:id", async(req, res) => {

        //     try {

        //         await db.collection("users").updateOne({ _id: req.params._id }, { $set: await bcrypt.hash(req.body.password, 10) })
        //         res.status(200).json({ "message": "updated" })


        //     } catch (err) {
        //         res.status(403).json({ "message": err })
        //     }

        // })
    }
});

module.exports = router;