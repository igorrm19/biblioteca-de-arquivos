
const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());


app.get("/books", async (req, res) => {
    try {
        const books = fs.readFileSync("books.json", "utf-8");
        res.send(JSON.parse(books));
    } catch (error) {
        res.status(500).send(error);
    }
});


app.get("/books/:id", async (req, res) => {
    try {
        const books = fs.readFileSync("books.json", "utf-8");
        const book = JSON.parse(books).find((book) => book.id === req.params.id);
        res.send(book);
    } catch (error) {
        res.status(500).send(error);
    }
});


app.post("/books", async (req, res) => {
    try {
        const book = req.body;
        const books = fs.readFileSync("books.json", "utf-8");
        const booksObject = JSON.parse(books); //converte a string em objeto

        book.id = (booksObject.length + 1).toString();
        booksObject.push(book); //adiciona ao array de livros

        fs.writeFileSync("books.json", JSON.stringify(booksObject, null, 2)); //Escrever no arquivo json, books do body
        res.status(201).send(book);

    } catch (error) {
        res.status(500).send(error);
        console.error(error);
    }
});


app.put("/books/:id", async (req, res) => {
    try {
        const book = req.body;
        const books = fs.readFileSync("books.json", "utf-8");
        const booksObject = JSON.parse(books);
        const bookIndex = booksObject.findIndex((book) => book.id === req.params.id);

        book.id = req.params.id;

        booksObject[bookIndex] = book;
        fs.writeFileSync("books.json", JSON.stringify(booksObject, null, 2));
        res.status(204).send();
    } catch (error) {
        res.status(500).send(error);
        console.error(error);
    }
});


app.delete("/books/:id", async (req, res) => {
    try {
        const books = fs.readFileSync("books.json", "utf-8");
        const booksObject = JSON.parse(books);
        const bookIndex = booksObject.findIndex((book) => book.id === req.params.id);

        if (bookIndex >= 0) {
            booksObject.splice(bookIndex, 1);
            fs.writeFileSync("books.json", JSON.stringify(booksObject, null, 2));
            res.status(204).send();
        } else {
            res.status(404).send("Book not found");
        }
    } catch (error) {
        res.status(500).send(error);
        console.error(error);
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});