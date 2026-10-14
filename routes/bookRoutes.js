import express from 'express';
import Book from '../models/book.js';

const parseId = (rawId) => {
  if (typeof rawId !== 'string' || !/^\d+$/.test(rawId)) {
    return null;
  }
  const id = Number(rawId);
  if (id <= 0 || !Number.isSafeInteger(id)) {
    return null;
  }
  return id;
};

const router = express.Router(); // создаёт отдельный роутер для маршрутов, связанных с Book

router.get('/', async (req, res, next) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, author, year } = req.body ?? {};

    if (!title || !author || !year) {
      return res.status(400).json({
        message: 'title, author, year are required',
      });
    }

    const newBook = await Book.create({
      title,
      author,
      year,
    });

    res.status(201).json(newBook);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const bookId = parseId(req.params.id);
    const { title, author, year } = req.body ?? {};

    if (!title || !author || !year) {
      return res.status(400).json({
        message: 'title, author, year are required',
      });
    }

    const book = await Book.findByPk(bookId);

    if (!book) {
      return res.status(404).json({
        message: 'Book not found',
      });
    }

    await book.update({
      title: title.trim(),
      author: author.trim(),
      year,
    });

    res.json({
      message: 'Данные книги успешно обновлены',
      bookUpdated: book,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const bookId = parseId(req.params.id);

    const book = await Book.findByPk(bookId);

    await book.destroy();
    res.json({
      message: 'Book is successfully deleted',
      deletedBokk: book,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
