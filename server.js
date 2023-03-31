const express = require("express");
/*CORS is used to open up the server for requests from different origins, which could otherwise be blocked.
This allows for secure and controlled data sharing between different applications and services.*/
const cors = require("cors");

const app = express();

// I'm using cors here to allow access from this http://localhost:4200  address
var corsOptions = {
  origin: "http://localhost:4200"
};
app.use(cors(corsOptions));

// parse requests of content-type - application/json , we use this middleware to
// enables the application to access JSON data from the request body object and use it for various operations such as creating objects etc
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./backend/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to flexIS application." });
});


require("./backend/routes/user.route")(app);
require("./backend/routes/department.route")(app);
//require("./app/routes/review.route")(app);
//require("./app/routes/request.route")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
