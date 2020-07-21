// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID;

const { MongoClient, ObjectID } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "tasks-app";

// const id = new ObjectID();

// console.log(id.toHexString());

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to database!");
    }

    const db = client.db(databaseName);

    //* USER FINDING
    // db.collection("users").findOne(
    //   { _id: ObjectID("5f056dd0e890ba1d1442e907") },
    //   (error, user) => {
    //     if (error) {
    //       console.log("unable to fetch");
    //     }

    //     console.log(user);
    //   }
    // );

    // db.collection("users")
    //   .find({ age: 27 })
    //   .toArray((error, users) => {
    //     console.log(users);
    //   });

    // db.collection("users")
    //   .find({ age: 27 })
    //   .count((error, count) => {
    //     console.log(count);
    //   });

    //*USER ADDING
    // db.collection("users").insertOne(
    //   { _id: id, name: "Holy", age: 27 },
    //   (error, result) => {
    //     if (error) {
    //       return console.log("Unable to insert user");
    //     }

    //     console.log(result.ops);
    //   }
    // );

    // db.collection("users").insertMany(
    //   [
    //     {
    //       name: "Jen",
    //       age: 29,
    //     },
    //     { name: "Gunther", age: 30 },
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       return console.log("Unable to insert documents!");
    //     }

    //     console.log(result.ops);
    //   }
    // );

    //*UPDATIING COLLECTION
    // db.collection("users")
    //   .updateOne(
    //     {
    //       _id: ObjectID("5f056dd0e890ba1d1442e907"),
    //     },
    //     // { $set: { name: "Mike" } } //*operator
    //     { $inc: { age: 1 } }
    //   )
    //   .then((result) => {
    //     console.log(result);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    db.collection("tasks")
      .updateMany({}, { $set: { completed: false } })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }
);
