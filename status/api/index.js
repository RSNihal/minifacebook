const express = require("express");
const app = express();

const router = require("express").Router();


const dotenv = require("dotenv");
const mongoose = require("mongoose")

const http = require("http").createServer(app)
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const { application } = require("express");
const path = require("path");
const crypto = require("crypto");

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/images", express.static(path.join(__dirname, "/images")));

mongoose.connect('mongodb://localhost:27017/Status', {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => {
	console.log("Successfully connected to the database");
}).catch(err => {
	console.log('Could not connect to the database. Exiting now...', err);
	process.exit();
});


app.use("/api/posts", postRoute);
app.use("/api/categories",categoryRoute);


app.use('/',(req,res,next) => {

  return res.status(200).json({"msg":"Hello from status"})

})
app.use(
  express.urlencoded(
      {
          extended: true 
      }
  )
)
// app.listen("8001", () => {
//     console.log("Status Backend is running on 8001");
//   });

http.listen(8001,()=>{
  console.log('Listening on port 8001')
})


 




