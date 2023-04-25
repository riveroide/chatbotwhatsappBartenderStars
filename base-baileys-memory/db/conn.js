const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.ATLAS_URI)
  .then(() => console.log("Database is already connected"))
  .catch((err) => console.log(err));