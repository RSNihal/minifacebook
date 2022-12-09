const express = require("express");
const app = express();

const router = require("express").Router();
const User = require("./models/User");


const dotenv = require("dotenv");
const mongoose = require("mongoose")

const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");

const categoryRoute = require("./routes/categories");
const multer = require("multer");
const { application } = require("express");
const path = require("path");
const crypto = require("crypto");

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/images", express.static(path.join(__dirname, "/images")));

mongoose.connect('mongodb://localhost:27017/Assignment', {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => {
	console.log("Successfully connected to the database");
}).catch(err => {
	console.log('Could not connect to the database. Exiting now...', err);
	process.exit();
});


var Minio = require('minio')

var minioClient = new Minio.Client({
    endPoint: '127.0.0.1',
    port: 9000,
    useSSL: false,
    accessKey: 'ILdloFV62IoAlMOV',
    secretKey: 'bKSQ8DzAZO1wsP5Q9kikl8IBHMAXigZz'
});


minioClient.bucketExists('ppbucket', function(err, exists) {
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

app.post("/api/uploadprofile", upload.single('file'), (req, res) => {

    
  const directoryPath = path.join('./images/',req.file.filename);
  
console.log(req.file.filename)
  minioClient.fPutObject('ppbucket', req.file.filename, directoryPath, function(err, objInfo) {
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


app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/categories", categoryRoute);

app.use('/',(req,res,next) => {

  return res.status(200).json({"msg":"Hello from user"})

})

app.listen("8003", () => {
    console.log("User Backend is running on 8003");
  });

  const videoStorage = multer.diskStorage({
    destination: 'images', // Destination to store video 
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
});

const videoUpload = multer({
    storage: videoStorage,
    limits: {
        fileSize: 10000000   // 10000000 Bytes = 10 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(mp4|MPEG-4)$/)) {     // upload only mp4 and mkv format
            return cb(new Error('Please upload a Video'))
        }
        cb(undefined, true)
    }
})


