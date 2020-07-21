const mongoose = require("mongoose");
// const validator = require("validator");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: {
      type: String,
      required: true,
      validate(value) {
        if (value.length > 500) {
          throw new Error("length is more then 10 symbols");
        }
      },
    },
    completed: { type: Boolean, default: false },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
