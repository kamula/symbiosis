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
                let data = {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    datejoined: new Date()
                }

                db.collection("users").insertOne({
                    data
                })
                res.json(data)
            })
            //get all users user
        router.get("/details", async(req, res) => {
                await db.collection("users").find().toArray((err, result) => {
                    if (err) {
                        throw err
                    } else {
                        res.json(result)
                    }
                })
            })
            //remove user
        router.delete("/:userId", async(req, res) => {
            try {
                const deleteduser = await db.collection("users").remove({ _id: req.params.userId })
                res.json(deleteduser)

            } catch (err) {
                throw err
            }
        })
    }
})
module.exports = router