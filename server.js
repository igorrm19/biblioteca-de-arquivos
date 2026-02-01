
const express = require("express");
const { Pool } = require("pg");

const app = express();

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'library_db',
    password: '123456',
    port: 5432,
});


app.use(express.json());


app.get("/books", async (req, res) => {
    try {

        const books = await pool.query("SELECT * FROM books");
        res.send(books.rows);

        if (books.rowCount === 0) {
            return res.status(404).send({ message: "Livro não encontrado" });
        }

    } catch (error) {

        res.status(500).send(error);
        console.error(error);
    }
});


app.get("/books/:id", async (req, res) => {
    try {
        const book = await pool.query("SELECT * FROM books WHERE id = $1", [req.params.id]);

        if (!book) {
            return res.status(404).send({ message: "Livro não encontrado" });
        }

        res.send(book.rows);
    } catch (error) {
        res.status(500).send(error);
        console.error(error);
    }
});


app.post("/books", async (req, res) => {
    try {
        const book = req.body;

        const books = await pool.query("INSERT INTO books (title, author, published_year) VALUES ($1, $2, $3)", [book.title, book.author, book.published_year]);

        res.status(201).send(books.rows);

    } catch (error) {
        res.status(500).send(error);
        console.error(error);
    }
});


app.put("/books/:id", async (req, res) => {
    try {
        const book = req.body;
        const books = await pool.query("UPDATE books SET title = $1, author = $2, published_year = $3 WHERE id = $4", [book.title, book.author, book.published_year, req.params.id]);

        if (books.rowCount === 0) {
            return res.status(404).send({ message: "Livro não encontrado" });
        }

        res.status(200).send(book);
    } catch (error) {
        res.status(500).send(error);
        console.error(error);
    }
});


app.delete("/books/:id", async (req, res) => {
    try {
        const books = await pool.query("DELETE FROM books WHERE id = $1", [req.params.id]);

        if (books.rowCount === 0) {
            return res.status(404).send({ message: "Livro não encontrado" });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).send(error);
        console.error(error);
    }
});


app.delete("/books", async (req, res) => {
    try {
        const books = await pool.query("DELETE FROM books");

        if (books.rowCount === 0) {
            return res.status(404).send({ message: "Livro não encontrado" });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).send(error);
        console.error(error);
    }
});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});