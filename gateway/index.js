const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/status',proxy('http://localhost:8001'))

app.use('/story',proxy('http://localhost:8002'))

app.use('/',proxy('http://localhost:8003'))

app.listen(8000,()=>{

    console.log("gateway is listening port 8000")
})