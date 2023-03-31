/*
Student Name : Manal Magdy Eid Khalil 
Student ID : B1901825
*/
const db = require("../models");
const Department = db.departments;

// Create and Save a new Department
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  //check if department with same name  already exists
    Department.findOne
    (
        {
            name: req.body.name,
        }, function(err, department) {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Department.",
            });
        }
        else if (department) {
            res.status(400).send({
                message: "Department already exists.",
            });
        }
        else {
            var count = 0;
            Department.find().count().then((data) => {
              count = data;
            });
           // Create a Department
          const department = new Department({
          departmentID: "D" + (count + 1),
          name: req.body.name,
          });

          // Save Department in the database
          department
            .save(department)
            .then((data) => {
              res.send(data);
            }
                )
            .catch((err) => {
              res.status(500).send({
              message: err.message || "Some error occurred while creating the Department.",
            });
          });

        }
    }
    );
  };







/*
basically I exported .findAll  that takes two parameters, req and res. It then declares a const variable called name and assigns it the value of req.query.name.
A condition is then set which checks if there is a name present or not. If there is, a new regular expression object will be created with the given name. If not, an empty object will be created instead.
The Department.find method is then called, passing in the condition, and populating its employees. A .then() block is then used to send the data if the operation is successful
, otherwise a .catch() block is used to send an error message along with a status code of 500.
*/
// Retrieve all Departments from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name
        ? { name: { $regex: new RegExp(name), $options: "i" } }
        : {};
    //Department.find(condition).populate('requests').populate('employees')
    Department.find(condition).populate('employees')
        .then((data) => {
        res.send(data);
        })
        .catch((err) => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving departments.",
        });
        });
    }



/*
It creates a user in the database and then searches for a department by its ID.
It sets the department and positions information on the user object and then adds the user to the department's employees array.
 It then saves the department data and sends back the user information in the response.
 Finally, it catches any errors while running the function and returns an error message with a status code of 500.
*/
//add employee to department
exports.addEmployee = (req, res) => {
    db.users.create(req).then((user) => {
        db.departments.findById(req.params.id).then((department) => {
            user.department = department._id;
            user.position = req.body.position;
            department.employees.push(user._id);
            department.save();
            res.send(user);
        });
    }
    ).catch((err) => {
        res.status(500).send({
            message: err.message || "Some error occurred while adding employee to department.",
        });
    });
};


// Find a single Department with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    //Department.findById(id).populate('employees').populate({path: 'requests', populate: {path: 'reviews', populate: {path: 'supervisor'}}})
    /*
    Populate here  is used here to show all the employees associated with a specific department, identified by its ID.
    and basically populate is an action within Mongoose  that allows references between documents
    , used to resolve the reference between the Department document that was queried and the Employee documents associated with it.
     This will return a single query result with the Department and its associated Employees
     , allowing for easy access to both the Department's information and the Employee records.
    */
    Department.findById(id).populate('employees')
        .then((data) => {
        if (!data)
            res.status(404).send({ message: "Not found Department with id " + id });
        else res.send(data);
        }
        )
        .catch((err) => {
        res
            .status(500)
            .send({ message: "Error retrieving Department with id=" + id });
        }
        );
};

// Update a Department by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
        message: "Data to update can not be empty!",
        });
    }

    const id = req.params.id;

    Department.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then((data) => {
        if (!data) {
            res.status(404).send({
            message: `Cannot update Department with id=${id}. Maybe Department was not found!`,
            });
        } else res.send({ message: "Department was updated successfully." });
        }
        )
        .catch((err) => {
        res.status(500).send({
            message: "Error updating Department with id=" + id,
        });
        }
        );
}

// Delete a Department with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Department.findByIdAndRemove(id)
        .then((data) => {
        if (!data) {
            res.status(404).send({
            message: `Cannot delete Department with id=${id}. Maybe Department was not found!`,
            });
        } else {
            res.send({
            message: "Department was deleted successfully!",
            });
        }
        }
        )
        .catch((err) => {
        res.status(500).send({
            message: "Could not delete Department with id=" + id,
        });
        }
        );
}

// Delete all Departments from the database.
exports.deleteAll = (req, res) => {
    Department.deleteMany({})
        .then((data) => {
        res.send({
            message: `${data.deletedCount} Departments were deleted successfully!`,
        });
        })
        .catch((err) => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while removing all departments.",
        });
        }
        );
}



