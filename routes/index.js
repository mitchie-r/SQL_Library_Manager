var express = require("express");
var router = express.Router();
const Book = require("../models").Book;
const { Op } = require('sequelize');

/* Handler function to wrap each route. */
function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (error) {
            // Forward error to the global error handler
            next(error);
        }
    };
}

/* Index redirect to Books */
router.get(
    "/",
    asyncHandler(async (req, res) => {
        res.redirect("/books");
    })
);


/* Display full list of books */
router.get("/books/", asyncHandler(async (req, res) => {
    // Results per page
    const resultsPerPage = 12;
    const books = await Book.findAll();
    console.log("books:", books);
    const currentPage = req.query.page ? parseInt(req.query.page) : 1;
    const begIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = Math.min(begIndex + resultsPerPage, books.length);
    // Total number in dataset
    const Total = Math.ceil(books.length / resultsPerPage)

    // Displays data with results per page
    const results = books.slice(begIndex, endIndex);
    console.log(resultsPerPage);
    res.render("index", {
        books: results,
        currentPage: currentPage,
        Total: Total,
        resultsPerPage,
    });
})
);

/* Route to enter a new book */
router.get(
    "/books/new",
    asyncHandler(async (req, res) => {
        // render the new book form - add an empty book object because no data exists yet
        res.render("new-book", { book: {}, title: "Create New Book" });
    })
);

/* Post new book to the database */
router.post(
    "/books/new",
    asyncHandler(async (req, res) => {
        console.log("req.body:", req.body);

        let book;
        console.log("book:", book);

        try {
            // create new book with data from form (= req.body)
            book = await Book.create(req.body);
            console.log("book:", book);

            res.redirect("/books");
        } catch (err) {
            if (err.name === "SequelizeValidationError") {
                console.log("err.message:", err.message);
                res.render("new-book", { book: req.body, errors: err.errors, title: "Create New Book" });
            } else {
                console.log(err);
            }
        }
    })
);

/* Searches for books using the Op feature in sequelize */
router.post(
    "/books/search",
    router.get('/books/search', asyncHandler(async (req, res) => {
        // Destructure the query from the query object
        const { query } = req.query;
        // If there is query (blank search)   redirect home
        if (!query) {
            res.redirect("/");
        } else {
            const books = await Book.findAll({
                where: {
                    [Op.or]: {
                        title: {
                            [Op.like]: `%${query}%`,
                        },
                        author: {
                            [Op.like]: `%${query}%`,
                        },
                        genre: {
                            [Op.like]: `%${query}%`,
                        },
                        year: {
                            [Op.like]: `%${query}%`,
                        },
                    },
                },
            });
            res.render("index", { books, count: books.length });
        }
    })
    )
);

/* Display detail of book */
router.get(
    "/books/:id",
    asyncHandler(async (req, res) => {
        const book = await Book.findByPk(req.params.id);
        if(book) {
            res.render("update-book", {book, title: book.title })
        } else {
            const error = new Error();
            error.status = 404;
            error.message = 'Oops! This book does not exist!';
            res.render("page-not-found", { title: "Page Not Found", error });
        }
    })
);

/* Updates book info in database */
router.post(
    "/books/:id",
    asyncHandler(async (req, res) => {
        console.log("req.body:", req.body);
        let book;
        try {
            book = await Book.findByPk(req.params.id);
           if (book) {
             await book.update(req.body);
             res.redirect("/")
           } else {
             const err = new Error();
             err.status = 404;
             err.message = "Book Id Doesn't Exist"
             res.render("page-not-found", {title: "Page-Not-Found", err });
           }
         } catch (error) {
           if (error.name === "SequelizeValidationError") {
             book = await Book.build(req.body);
             book.id = req.params.id;
             res.render("update-book", {book, errors: error.errors, title: "New Book "})
           } else {
             res.sendStatus(404);
           }
         }
       }));

// Delete Book
router.post(
    "/books/:id/delete",
    asyncHandler(async (req, res) => {
        const book = await Book.findByPk(req.params.id);
        await book.destroy();
        res.redirect("/books");
    })
);

module.exports = router;
