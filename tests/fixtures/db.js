const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");

const testUserId = new mongoose.Types.ObjectId();
const testUser = {
  _id: testUserId,
  name: "Test User",
  email: "test@example.com",
  password: "pass11",
  tokens: [{ token: jwt.sign({ _id: testUserId }, process.env.JWT_SECRET) }],
};

const secondTestUserId = new mongoose.Types.ObjectId();
const secondTestUser = {
  _id: secondTestUserId,
  name: "Test User 2",
  email: "test2@example.com",
  password: "pass11",
  tokens: [
    { token: jwt.sign({ _id: secondTestUserId }, process.env.JWT_SECRET) },
  ],
};

const testTaskOne = {
  _id: new mongoose.Types.ObjectId(),
  title: "First test task",
  description: "Description of first test task",
  completed: false,
  creator: testUser._id,
};

const testTaskTwo = {
  _id: new mongoose.Types.ObjectId(),
  title: "Second test task",
  description: "Description of second test task",
  completed: true,
  creator: testUser._id,
};

const testTaskThree = {
  _id: new mongoose.Types.ObjectId(),
  title: "Third test task",
  description: "Description of third test task",
  completed: true,
  creator: secondTestUser._id,
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(testUser).save();
  await new User(secondTestUser).save();
  await new Task(testTaskOne).save();
  await new Task(testTaskTwo).save();
  await new Task(testTaskThree).save();
};

module.exports = {
  testUser,
  testUserId,
  setupDatabase,
  testTaskOne,
  secondTestUser,
};
