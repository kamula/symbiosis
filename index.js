const express = require("express");
const usersroute = require("./routes/users");

const app = express();


const port = process.env.PORT || 8000;
app.use("/users", usersroute);

app.listen(port, () => {
    console.log(`app running on port ${port}`);
});