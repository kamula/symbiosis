const MongoClient = require('mongodb').MongoClient;

const authuser = (req, res, next) => {
    const url = process.env.USER_DB;
    const client = new MongoClient(url);
    client.connect(async(err, client) => {
        const db = client.db('symbiosis');
        console.log('connected for authentication');
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
};
module.exports = authuser;