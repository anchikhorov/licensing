const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const customerRoutes = require("./routes/customers")


const app = express();

mongoose.set('useUnifiedTopology', true );
mongoose.set('useNewUrlParser', true );
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose
  .connect(
    "mongodb://localhost:27017/node-angular",
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});
// app.get("/download", (req, res, next) => {
//   console.log("C:/Users/alex/licensing/backend/lic_files")
//   var filePath = "C:/Users/alex/licensing/backend/lic_files"; // Or format the path using the `id` rest param
//   var fileName = "file.lic"; // The default name the browser will use

//   res.download("C:/Users/alex/licensing/backend/lic_files/file.lic");  
//   //res.download(filePath, fileName);    
// });
app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/customer", customerRoutes);

module.exports = app;
