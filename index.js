const express = require("express");
const usersroute = require("./routes/users");
const bodyparser = require("body-parser")

const app = express();
app.use(bodyparser.json())


const port = process.env.PORT || 8000;
app.use("/users", usersroute);

app.listen(port, () => {
    console.log(`app running on port ${port}`);
});