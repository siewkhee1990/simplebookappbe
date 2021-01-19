const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const books = require("./book");
const port = 5000;
const sql = require("mysql");

const frontEndUrl = process.env.FRONT_END_URL || "http://localhost:3000";

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", frontEndUrl);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, PUT, POST, DELETE, OPTIONS, PATCH"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, x-access-token, Cookie, Content-Type, access_token, Accept, token"
  );
  next();
});

let sqldb = sql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "booksdb",
});

sqldb.connect(() => {
  console.log("SQL Server connected");
});

app.use(express.urlencoded({ extended: false })); // extended: false - does not allow nested objects in query strings
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/books", books);

app.listen(port, () => {
  console.log("I am listening to port:", port);
});
