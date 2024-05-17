const express = require('express');
const { connectToDB } = require('./config/db');
const config = require("./config/config.json");
// const userRoutes = require('./routes/user');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/user', userRoutes);





app.listen(config.development.PORT, async () => {
    connectToDB().then(() => {
        console.log('Server is running at port: ' + config.development.PORT);
    }).catch((e) => {
        console.log('Error in database connection', e);
    });
})