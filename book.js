const express = require("express");
const router = express.Router();
const sql = require("mysql");
const axios = require("axios");

let sqldb = sql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "booksdb",
});

//Authentication
router.post("/login", async (req, res) => {
  let data = req.body;
  let result = await axios
    .post("https://reqres.in/api/login", data)
    .then((response) => {
      console.log(response);
      return response.data;
    })
    .catch((err) => {
      return err;
    });
  res.json(result);
});

router.get("/", (req, res) => {
  sqldb.query("SELECT * FROM booksdb.books;", (err, rows, fields) => {
    if (err) throw err;
    res.json(rows);
  });
});

router.post("/create", (req, res) => {
  if (!req.headers.token) {
    res.json({ message: "not allowed!" });
  } else {
    sqldb.query(
      "INSERT INTO booksdb.books SET ?",
      req.body,
      function (error, results, fields) {
        if (error) throw error;
        res.status(201);
        res.json({
          message: "Book added!",
        });
      }
    );
  }
});

//This is for updating the book information!
router.put("/:id", (req, res) => {
  if (!req.headers.token) {
    res.json({ message: "not allowed!" });
  } else {
    let id = req.params.id;
    let { title, author, genre, language } = req.body;
    sqldb.query(
      "UPDATE booksdb.books SET title=?, author=?, genre=?, language=? WHERE id = ?",
      [title, author, genre, language, id],
      function (err, rows, fields) {
        if (err) throw err;
        if (rows.changedRows === 1) {
          res.status(200).json({ message: "Book updated!" });
        } else {
          res.status(404);
          res.json({ error: "Book not found!" });
        }
      }
    );
  }
});

//This is for deleting a book!
router.delete("/:id", (req, res) => {
  if (!req.headers.token) {
    res.json({ message: "not allowed!" });
  } else {
    sqldb.query(
      "DELETE FROM booksdb.books WHERE id = ?",
      [req.params.id],
      function (err, rows, fields) {
        if (err) throw err;

        if (rows.affectedRows === 1) {
          res.json({ message: "Book deleted!" });
        } else {
          res.status(404);
          res.json({ error: "Item not found!" });
        }
      }
    );
  }
});

const getRate = async () => {
  return await axios
    .get("https://api.exchangeratesapi.io/latest?symbols=USD,SGD&base=SGD")
    .then((response) => {
      return response;
    })
    .catch((err) => {
      return err;
    });
};

router.get("/conversion", async (req, res) => {
  let respond = await getRate();
  res.json(respond.data);
});

router.get("/rates", (req, res) => {
  axios
    .get("http://localhost:8080/rate")
    .then((response) => {
      console.log(response.data);
      res.json(response.data);
    })
    .catch((err) => {
      res.status(400);
      res.json(err);
    });
});

module.exports = router;
