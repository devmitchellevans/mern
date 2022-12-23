const express = require("express");
 
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");
 
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

const { v4: uuidv4 } = require("uuid");
const path = require("path");
const Multer = require('multer');
const { Storage } = require("@google-cloud/storage");



let projectId ='charismatic-sum-372505';
let keyFilename = "mykey.json";

const storage = new Storage({
  projectId,
  keyFilename
});

const bucket = storage.bucket('mern-stack');

// const storage = Multer.diskStorage({
//   destination: function(req, file, cb){
//     cb(null, 'images');
//   },
//   filename: function(req, file, cb){
//     cb(null, uuidv4() +  '-' + Date.now() + path.extname(file.originalname));
//   }
// });

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if(allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  }else{
    cb(null, false);
  }
}
// let upload = multer({ storage, fileFilter });
const multer = Multer({
  storage: Multer.memoryStorage(),
  fileFilter
});
// This section will help you get a list of all the records.
recordRoutes.route("/record").get(function (req, res) {
 let db_connect = dbo.getDb("employees");
 db_connect
   .collection("records")
   .find({})
   .toArray(function (err, result) {
     if (err) throw err;
     res.json(result);
   });
});
 
// This section will help you get a single record by id
recordRoutes.route("/record/:id").get(function (req, res) {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 db_connect
   .collection("records")
   .findOne(myquery, function (err, result) {
     if (err) throw err;
     res.json(result);
   });
});
 
// This section will help you create a new record.
recordRoutes.route("/record/add").post( multer.single('photo'), (req, response) =>{
  console.log('made it add');
 let db_connect = dbo.getDb();
try{
  console.log(req.file.originalname);
  if(req.file){
    console.log('uploading');
    let blob = bucket.file(req.file.originalname);
    let blobStream = blob.createWriteStream();
     blobStream.on('finish', () =>{
     });
     blobStream.end(req.file.buffer);
  }
}catch(err) {
  response.status(500).send(err);
}

  let photo;
  if(req.file){
    photo = req.file.originalname;
  }else{
    photo = null;
  }

  let myobj = {
    name: req.body.name,
    photo: photo,
    position: req.body.position,
    level: req.body.level,
  };

 db_connect.collection("records").insertOne(myobj, function (err, res) {
   if(myobj) console.log(myobj);
   if (err) throw err;
   response.json(res);
 });
});
 
// This section will help you update a record by id.
recordRoutes.route("/update/:id").post(multer.single('photo'), (req, response) => {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 let newvalues = {
   $set: {
     name: req.body.name,
     photo: bucket.file(req.file.originalname),
     position: req.body.position,
     level: req.body.level,
   },
 };
 db_connect
   .collection("records")
   .updateOne(myquery, newvalues, function (err, res) {
     if (err) throw err;
     console.log("1 document updated");
     response.json(res);
   });
});

// This section will help you delete a record
recordRoutes.route("/:id").delete((req, response) => {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 db_connect.collection("records").deleteOne(myquery, function (err, obj) {
   if (err) throw err;
   console.log("1 document deleted");
   response.json(obj);
 });
});
 
module.exports = recordRoutes;