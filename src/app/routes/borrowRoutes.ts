/** @format */

import express, { Request, Response } from "express";
import { Book } from "../model/bookModel";
import { Borrow } from "../model/borrowModel";

export const borrowRoutes = express.Router();

borrowRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const { book: bookId, quantity, dueDate } = req.body;
    console.log(bookId);
    const book = await Book.findById(bookId);
    if (!book || book.copies < quantity) {
      res.status(400).json({
        success: false,
        message: "Not enough copies available",
        error: null,
      });
    }

    // create borrow
    const borrow = await Borrow.create({ book: bookId, quantity, dueDate });
    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: borrow,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Borrow faild", error });
  }
});

borrowRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const result = await Borrow.aggregate([
      {
        // stage 1
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      // stage 2
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookSummary",
        },
      },
      // stage 3
      {
        $unwind: "$bookSummary",
      },
      // stage 4
      {
        $project: {
          _id: 0,
          book: {
            title: "$bookSummary.title",
            isbn: "$bookSummary.isbn",
          },
          totalQuantity: 1,
        },
      },
    ]);
    res.json({
      success: true,
      message: "Borrowed books summary retrieved successfully",
      data: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Aggregation failed", error });
  }
});
