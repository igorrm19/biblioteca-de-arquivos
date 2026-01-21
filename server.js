
const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());



app.get("/books", async (req, res) => {
    try {
        const books = fs.readFileSync("books.json", "utf-8");
        res.send(JSON.parse(books));
    } catch (error) {
        if (res.statusCode === 404) {
            console.error(error);
        }
        res.status(500).send(error);
        console.error(error);
    }
});


app.get("/books/:id", async (req, res) => {
    try {
        const books = fs.readFileSync("books.json", "utf-8");
        const book = JSON.parse(books).find((book) => book.id === req.params.id);

        if (!book) {
            return res.status(404).send({ message: "Livro não encontrado" });
        }

        res.send(book);
    } catch (error) {
        res.status(500).send(error);
        console.error(error);
    }
});


app.post("/books", async (req, res) => {
    try {
        const book = req.body;
        const books = fs.readFileSync("books.json", "utf-8");
        const booksObject = JSON.parse(books);

        book.id = Date.now().toString();
        booksObject.push(book);

        fs.writeFileSync("books.json", JSON.stringify(booksObject, null, 2));
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

        const updatedBook = { ...booksObject[bookIndex], ...book, id: req.params.id }; // atualiza o livro selecionado com os dados enviados no body 

        booksObject[bookIndex] = updatedBook;  // atualiza o livro selecionado no array

        fs.writeFileSync("books.json", JSON.stringify(booksObject, null, 2)); // atualiza o arquivo json
        res.status(200).json(updatedBook);

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
            res.status(404).send({ message: "Livro não encontrado" });
        }

    } catch (error) {
        res.status(500).send(error);
        console.error(error);
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});