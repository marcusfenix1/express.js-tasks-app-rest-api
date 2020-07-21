const mongoose = require("mongoose");

const dbAddress = process.env.LOCAL_DB_ADDRESS;

mongoose.connect(dbAddress, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
