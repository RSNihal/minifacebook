const crypto = require("crypto");
const express = require("express");
const app = express();

const router = require("express").Router();
const User = require("./models/User");
const Hostel = require("./models/Hostel");

const dotenv = require("dotenv");
const mongoose = require("mongoose")
const hostelRoute = require("./routes/hostels");
const houseRoute = require("./routes/houses");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const { application } = require("express");
const path = require("path");

var Minio = require('minio')

var minioClient = new Minio.Client({
    endPoint: '127.0.0.1',
    port: 9000,
    useSSL: false,
    accessKey: 'ILdloFV62IoAlMOV',
    secretKey: 'bKSQ8DzAZO1wsP5Q9kikl8IBHMAXigZz'
});

minioClient.bucketExists('mybucket', function(err, exists) {
    if (err) {
      return console.log(err)
    }
    if (exists) {
      return console.log('Bucket exists.')
    }
  })

var globalVariable={
    uuid: crypto.randomUUID()
  };
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
         cb(null, "images");
    },
    filename: (req, file, cb) => {
  
      cb(null, file.originalname);
   
    },
  });


const upload = multer({storage: storage });

app.post("/api/upload", upload.single('file'), (req, res) => {

    
  const directoryPath = path.join('./images/',req.file.filename);
  
console.log(req.file.filename)
  minioClient.fPutObject('mybucket', req.file.filename, directoryPath, function(err, objInfo) {
    if(err) {
        return console.log(err)
    }
    console.log("Success", objInfo.etag, objInfo.versionId)
})
  res.send(req.file)
}, (error, req, res, next) => {

  

  console.log(req.file)
 
  res.status(400).send({ error: error.message })
})
