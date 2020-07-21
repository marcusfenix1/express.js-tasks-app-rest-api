const mongoose = require("mongoose");

const dbURL = process.env.DATABASE_URL;

mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
