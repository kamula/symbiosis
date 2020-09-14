require("dotenv/config")
const express = require("express")
const validation = require("./validate")
const MongoClient = require("mongodb").MongoClient
const router = express.Router()
const url = process.env.USER_DB;
const client = new MongoClient(url)

client.connect((err, client) => {
    if (err) {
        throw err
    } else {

        const db = client.db("symbiosis")
            //post route
        router.post("/post/:id", async(req, res) => {
                try {
                    const user = await db.collection("users").findOne({
                        id: req.params._id
                    })
                    if (user) {
                        await db.collection("posts").insertOne({
                            title: req.body.title,
                            content: req.body.content,
                            category: req.body.category,
                            author: user.firstname,
                            email: user.email,
                            date_posted: new Date()
                        })
                        res.status(201).json({ "message": "post created" })
                    } else {
                        res.status(403).json({ "message": "permission denied" })
                    }
                } catch (err) {

                }
            })
            //get post


    }
})


module.exports = router