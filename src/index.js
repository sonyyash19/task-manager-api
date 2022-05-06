const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter); // registering router with the express
app.use(taskRouter); 

// without middleware >    new request => run router handler
//
// with  middleware   >    new request =>  do something  => run router handler

app.listen(port, ()=>{
    console.log("Server is up on port "+ port);
})