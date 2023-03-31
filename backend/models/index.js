/*
Student Name : Manal Magdy Eid Khalil Eid
Student ID : B1901825
---------------------------------------------------------------------------------------
 Here I'm  setting up a MongoDB database connection and establishing the various models for use in the application.
 It imports the db.config.js file for the connection details, connects to Mongoose
 , and then sets up the user, review, request, and department models that will be used in the application.
 Finally, it exports the database object so that it can be imported and used in other parts of the application.
*/
const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.users = require("./user.model")(mongoose);
//db.reviews = require("./review.model.js")(mongoose);
//db.requests = require("./request.model.js")(mongoose);
db.departments = require("./department.model")(mongoose);

module.exports = db;
