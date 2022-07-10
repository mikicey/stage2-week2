const express = require("express");
const app = express();

// Middleware
const verifyAdmin = require("./middleware/verifyAdmin");
const verifyJWT = require("./middleware/verifyJWT");

// Connect
const sequelize = require("./config/connect");
sequelize.authenticate().then(()=>{
    console.log("connected")
});


app.use(express.urlencoded());
app.use(express.json());
app.use(express.static("uploads"));



app.use("/api/v1", require("./routes/auth"));

// CHECK USER
app.use(verifyJWT);

// ROUTES


app.use("/api/v1/", require("./routes/categories"));
app.use("/api/v1/" , require("./routes/products"));
app.use("/api/v1/profile/", require("./routes/profiles"));
app.use("/api/v1/", require("./routes/chats"));
app.use("/api/v1/", require("./routes/transactions"));




app.listen(3000,()=>{
    console.log("connected to 3000")
});