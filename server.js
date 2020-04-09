const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const myconn = require("./connection");

// every single collection will need a model
const UserListing = require("./models/user-listings-model");
const Question = require("./models/questions-model");

// init express, bodyparser now built in to express...
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// added to allow us to upload images to public folder
app.use(fileUpload());
app.use("/assets", express.static("public"));
// end init express

// my functions
function updateAfterFileUpload(req, res, objFromDB, fileName) {
  // form data from frontend is stored in the request body , req.body
  var data = req.body;
  Object.assign(objFromDB, data);

  // must match the model entry
  objFromDB.Image = fileName;

  objFromDB.save().then(
    (response) => {
      res.json({
        result: true,
      });
    },
    (error) => {
      res.json({
        result: false,
      });
    }
  );
}
// end  my functions

// init database stuff
mongoose.connect(myconn.atlas, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("connected", (e) => {
  console.log("+++ Mongoose connected ");
});

db.on("error", () => console.log("Database error"));
// end database stuff

// start of routes
const router = express.Router();
// add api to beginning of all 'router' routes
app.use("/api", router);

// CRUD
// CREATE listing
router.post("/user-listing", (req, res) => {
  var collectionModel = new UserListing();

  if (req.files) {
    var files = Object.values(req.files);
    var uploadedFileObject = files[0];
    var uploadedFileName = uploadedFileObject.name;
    var nowTime = Date.now();
    var newFileName = `${nowTime}_${uploadedFileName}`;
    console.log(req.body);
    //console.log(req.files);

    uploadedFileObject.mv(`public/${newFileName}`).then(
      (params) => {
        updateAfterFileUpload(req, res, collectionModel, newFileName);
      },
      (params) => {
        updateAfterFileUpload(req, res, collectionModel);
      }
    );
  } else {
    updateAfterFileUpload(req, res, collectionModel);
  }
});

// READ all listings
router.get("/user-listing", (req, res) => {
  UserListing.find().then((data) => {
    res.json(data);
  });
});

// DELETE A listing - Will probably never need this
// send this endpoint the mongo _id and it ill delete the doc
router.delete("/user-listing/:id", (req, res) => {
  UserListing.deleteOne({ _id: req.params.id }).then(
    () => {
      res.json({ result: true });
    },
    () => {
      res.json({ result: false });
    }
  );
});

// READ ONE Listing ONLY based upon _id
router.get("/user-listing/:id", (req, res) => {
  UserListing.findOne({ _id: req.params.id })
    .populate("questions")
    .populate({ path: "questions", options: { sort: { updatedAt: -1 } } })
    .then((data) => {
      res.json([data]);
    });
});

//////////////////////////////////////////////////////////////////////
/// CRUD

//// END CRUD
///////////////////////////////////////////

//////////////////////////////////////////////////////////////////////
// THE rest of this is dealing with unhandled routes in a nice way //
router.get("/*", (req, res) => {
  res.json({ result: "invalid endpoint, please choose another" });
});

app.get("/*", (req, res) => {
  res.json({ result: "invalid endpoint, please choose another" });
});

// grab a port and start listening
const port = 4000;
app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening on port ${port}!`);
});
