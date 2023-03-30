const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const bankRoutes = require("./routes/bankRoutes");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config({ path: "./config/.env" });
require("./config/db");
const app = express();
var cors = require('cors');
app.use(cors());

app.use(cors({origin: true, credentials: true}));

const User = require('./models/user.model')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//routes
app.use("/api/user", userRoutes);
app.use("/api/bank", bankRoutes);
app.use("/api/auth", authRoutes);


app.listen(process.env.PORT, () => console.log("🚀 Server Launched - Listening on port", process.env.PORT || 5000));

const user = new User({
    name : 'name', 
    userName : 'username',
    password : 'password',
    soldAccount : '1000',
})

//user.save();

