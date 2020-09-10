const express = require('express');
const bcrypt = require('bcrypt');
const MongoClient = require('mongodb').MongoClient;
require('dotenv/config');
const router = express.Router();
const sendmail = require("./mail")

const url = process.env.USER_DB;

const client = new MongoClient(url);

client.connect((err, client) => {
    if (err) {
        throw err;
    } else {
        const db = client.db('symbiosis');
        console.log('connected to db');
        router.post('/register', (req, res) => {
            let password = req.body.password;
            let password2 = req.body.password2;
            if (password !== password2) {

                res.json({ message: 'passwords dont match' });
            } else {
                bcrypt.hash(password, 10).then((hash) => {
                    let data = {
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        email: req.body.email,
                        datejoined: new Date(),
                        password: hash,
                    };
                    db.collection('users').insertOne({
                        data,
                    });
                    sendmail(data["email"])
                    res.json(data);
                });
            }
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
        router.delete('/:userId', async(req, res) => {
            try {
                const deleteduser = await db
                    .collection('users')
                    .deleteOne({ _id: req.params.userId });
                res.json(deleteduser);
            } catch (err) {
                throw err;
            }
        });
    }
});
module.exports = router;