/** @format */

import { trace } from "console";
import express, { Request, Response } from "express";
import { Book } from "../model/bookModel";
import { Borrow } from "../model/borrowModel";

export const borrowRoutes = express.Router();

borrowRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const { book: bookId, quantity, dueDate } = req.body;
    const book = await Book.findById(bookId);
    if (!book || book.copies < quantity) {
      res.status(400).json({
        success: false,
        message: "Not enough copies available",
        error: null,
      });
    }

    // create borrow
    const borrow = Borrow.create({ book: bookId, quantity, dueDate });
    res.status(201).json({
      success: trace,
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
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      {
        $unwind: "$bookDetails",
      },
      {
        $project: {
          _id: 0,
          book: {
            title: "$bookDetails.title",
            isbn: "$bookDetails.isbn",
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
