const express = require("express");
const MongoClient = require("mongodb").MongoClient
require("dotenv/config")
const router = express.Router();

const url = process.env.USER_DB

const client = new MongoClient(url)

client.connect((err, client) => {
    if (err) {
        throw err
    } else {
        const db = client.db("symbiosis")
        console.log("connected to db")
        router.post("/register", (req, res) => {
            let data = {}
            data["firstname"] = req.body.firstname
            data["lastname"] = req.body.lastname
            data["email"] = req.body.email
            data["datejoined"] = Date.now
            db.collection("users").insertOne({
                // firstname: req.body.firstname,
                // lastname: req.body.lastname,
                // email: req.body.email,
                // datejoined: Date.now
                data
            })
            res.json(data)
        })
    }
})
module.exports = router