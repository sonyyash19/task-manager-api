const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();

app.use(express.json());
app.use(userRouter); // registering router with the express
app.use(taskRouter); 

module.exports = app;

// without middleware >    new request => run router handler
//
// with  middleware   >    new request =>  do something  => run router handler
