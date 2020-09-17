require('dotenv/config');
const express = require('express');
const { ObjectID } = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const router = express.Router();
const url = process.env.USER_DB;
const client = new MongoClient(url);

client.connect((err, client) => {
    if (err) {
        throw err;
    } else {
        const db = client.db('symbiosis');
        //post route
        router.post('/post/:id', async(req, res) => {
            try {
                const user = await db.collection('users').findOne({
                    id: req.params._id,
                });
                if (user) {
                    await db.collection('posts').insertOne({
                        title: req.body.title,
                        content: req.body.content,
                        category: req.body.category,
                        author: user.firstname,
                        email: user.email,
                        date_posted: new Date(),
                    });
                    res.status(201).json({ message: 'post created' });
                } else {
                    res.status(403).json({ message: 'permission denied' });
                }
            } catch (err) {}
        });
        //edit articles
        router.patch('/update/:articleId', async(req, res) => {
            try {
                const updated = await db
                    .collection('posts')
                    .updateOne({ _id: ObjectID(req.params.articleId) }, { $set: { content: req.body.content } });
                res.json(updated);
            } catch (err) {
                res.status(501).json({ message: err });
            }
        });
        //get specific post
        router.get('/singlepost/:id', async(req, res) => {
            try {
                const article = await db
                    .collection('posts')
                    .findOne({ id: req.params._id });
                if (article) {
                    res.json(article);
                } else {
                    res.status(404).json({ message: 'not found' });
                }
            } catch (err) {
                res.json(err);
            }
        });
        //get articles of specific field
        router.get('/specific/:category', async(req, res) => {
            try {
                const specific_post = await db
                    .collection('posts')
                    .find({ category: req.params.category })
                    .toArray();
                res.json(specific_post);
            } catch (err) {
                res.json(err);
            }
        });
        // delete route
        router.delete('/delete/:articleId', async(req, res) => {
            //const _id = new ObjectID(req.params._id)
            try {
                const deletedarticle = await db
                    .collection('posts')
                    .deleteOne({ _id: ObjectID(req.params.articleId) });
                res.json(deletedarticle);
            } catch (err) {
                res.json(err);
            }
        });
    }
});

module.exports = router;